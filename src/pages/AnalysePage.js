import React, { useState, useMemo, useCallback, useRef, useEffect, useContext } from 'react';
import OLCompass from '../components/OLCompass'
import CompassIcon from '../components/CompassIcon'
import Menu from '../components/Menu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ManropeFont from '../utils/Font.js';
import ReactDOM from 'react-dom';
import { State, StateContext } from "../State";
import '../styles/pages/AnalysePage.css';

const AnalysePage = () => {
    const {
        colors,
        firstMessage,
        setFirstMessage,
        isExplanationPage,
        setIsExplanationPage,
        allComponents,
      } = useContext(StateContext);

    const [projectName, setProjectName] = useState('');
    const [components, setComponents] = useState([]);
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [ASubtask, setASubtask] = useState(''); // Track active button
    const [mode, setMode] = useState('analyse');

    const componentsRef = useRef(components);

    useEffect(() => {
        componentsRef.current = components;
    }, [components]);
    
    const resetState = useCallback(() => {
        setProjectName('');
        setActiveTask('A');
        setASubtask('');
        setMode('analyse');
    }, []);

    const handleCompassClick = (code, title, headline, type) => {
        setIsExplanationPage(false);
        
        setComponents((prevComponents) => {
            const componentExists = prevComponents.some((component) => component.code === code);
      
            const updatedComponents = componentExists
              ? prevComponents.filter((component) => component.code !== code)
              : [
                  ...prevComponents,
                  {
                    code,
                    title,
                    headline,
                    type,
                  },
                ];
      
            const sortedComponents = updatedComponents.sort((a, b) => {
              const indexA = allComponents.indexOf(a.code);
              const indexB = allComponents.indexOf(b.code);
      
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
      
              return indexA - indexB;
            });
      
            componentsRef.current = sortedComponents;
            return sortedComponents;
          });
    };

    const addIconAndDefinitions = async(pdf, currentMode, type) => {
        // Compass Icon
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);
 
        // Render React component into the container
        ReactDOM.render(
            <State>
                <CompassIcon 
                    mode={currentMode}
                    type={type} 
                />
            </State>,
            container
        );
 
        let canvas = await html2canvas(container, { scale: 3, logging: true, backgroundColor: null });
        let imgData = canvas.toDataURL('image/png');
 
        // Original dimensions of the captured canvas
        let imgWidth = canvas.width; // In pixels
        let imgHeight = canvas.width; // In pixels
  
        // Convert pixel dimensions to mm
        let pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        let contentWidth = imgWidth * pixelToMm * 0.4;
        let contentHeight = imgHeight * pixelToMm * 0.4;
  
        pdf.addImage(imgData, 'PNG', 20, 5, contentWidth, contentHeight);
         
        document.body.removeChild(container);
 
        // Definitions
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        // Render React component into the container
        ReactDOM.render(
            <div className='a-definitions-container'>
                {components
                    .filter((c) => c.type === type) // Filter by the specific type
                    .map((c) => (
                        <div className='a-definition'>
                            <p className='a-definition-title' 
                                style={{
                                    color: `${colors['Label'][type]}`,
                                    background: `linear-gradient(
                                        to right, 
                                        ${colors['Wave'][type]} 20%, 
                                        white 80%
                                    )`,
                                }}>
                                {c.title}
                            </p>
                            <p className='a-definition-text'>{c.headline}</p>
                        </div>
                    ))}
            </div>,
            container
        );

        canvas = await html2canvas(container, { scale: 3, logging: true, backgroundColor: null });
        imgData = canvas.toDataURL('image/png');

        // Original dimensions of the captured canvas
        imgWidth = canvas.width*0.3; // In pixels
        imgHeight = canvas.height*0.3; // In pixels
 
        // Convert pixel dimensions to mm
        contentWidth = imgWidth * pixelToMm;
        contentHeight = imgHeight * pixelToMm;
 
        pdf.addImage(imgData, 'PNG', 20, 60, contentWidth, contentHeight);
        
        document.body.removeChild(container);
    }

    const addTaskPage = async(pdf, text, currentMode, task, type) => {
        const a4Width = pdf.internal.pageSize.getWidth();
        const a4Height = pdf.internal.pageSize.getHeight();

        pdf.addPage();
        
        // Margin
        pdf.setFillColor('#dfe9e9'); // RGB for green
        pdf.rect(0, 0, a4Width, a4Height, 'F'); // Draw a filled rectangle covering the entire page

        const rectWidth = a4Width - 20;  // Width of the rectangle
        const rectHeight = a4Height - 20; // Height of the rectangle
        const rectX = (a4Width - rectWidth) / 2;  // Centered X position
        const rectY = (a4Height - rectHeight) / 2; // Centered Y position
        const borderRadius = 5; // Radius of the rounded corners
                
        pdf.setFillColor('white'); // RGB for green
        pdf.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'F'); // Draw a filled rectangle covering the entire page

        // Text
        const parts = text.split(' focus');
        const mainText = parts[0].trim();
        const highlightText = mainText.split(' ').pop();  // Get the last word (to highlight)
        const remainingText = 'focus';

        pdf.setFontSize(13);
        pdf.setTextColor("#0a4461");

        let currentText;
        if(type === 'All' || task !== 'A') {
            currentText = text;
            pdf.text(currentText, 20, 190);
        } else {
            currentText = mainText.replace(highlightText, '').trim();
           
            pdf.text(currentText, 20, 190);

            // Set the highlight color for the key part (the word to be highlighted)
            pdf.setTextColor(colors['Wave'][type]);
            pdf.text(highlightText, 118, 190);

            // Set the default color again for the 'focus' part
            let padding = 118;
            if(type === 'Principle') padding += 27; 
            else if(type === 'Perspective') padding += 34; 
            else if(type === 'Dimension') padding += 30; 

            pdf.setTextColor("#0a4461");
            pdf.text(remainingText, padding, 190);
        }

        // Subtask Menu
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);
        
        // Render React component into the container
        ReactDOM.render(
            <div className="a-tasks-nav">
                <button className={`a-task-button ${'A' === task ? 'active' : ''}`} >
                    A
                </button>
                            
                <button className={`a-task-button ${'B' === task ? 'active' : ''}`} >
                    B
                </button>
        
                <button className={`a-task-button ${'C' === task ? 'active' : ''}`} >
                    C
                </button>
        
                <button className={`a-task-button ${'D' === task ? 'active' : ''}`} >
                    D
                </button>
            </div>,
                container
            );
            
        let canvas = await html2canvas(container, { scale: 3, logging: true, backgroundColor: null });
        let imgData = canvas.toDataURL('image/png');
        
        // Original dimensions of the captured canvas
        let imgWidth = canvas.width; // In pixels
        let imgHeight = canvas.height; // In pixels
            
        // Convert pixel dimensions to mm
        let pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        let contentWidth = imgWidth * pixelToMm * 0.3;
        let contentHeight = imgHeight * pixelToMm *0.3;
         
        pdf.addImage(imgData, 'PNG', 20, 195, contentWidth, contentHeight);
                
        document.body.removeChild(container);
        
        // OL Compass
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);
        
        // Render React component into the container
        ReactDOM.render(
            <State>
                <OLCompass 
                    className='a-ol-compass'
                    mode={currentMode}
                    position="center" 
                    selected={componentsRef.current.map((component) => component.code)}
                />
            </State>,
            container
        );
        
        canvas = await html2canvas(container, { scale: 3, logging: true, backgroundColor: null  });
        imgData = canvas.toDataURL('image/png');
        
        // Original dimensions of the captured canvas
        imgWidth = canvas.width; // In pixels
        imgHeight = canvas.height; // In pixels
         
        contentWidth = imgWidth * pixelToMm*0.3;
        contentHeight = imgHeight * pixelToMm*0.3;
         
        // Calculate the x and y positions to center the image
        let x = (a4Width - contentWidth)/ 2 ;
        let y = (a4Height - contentHeight) / 2;
                
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);
                
        document.body.removeChild(container);


        if(currentMode === 'analyse-a-all')
            return;
        if(currentMode.startsWith('analyse-a-'))
            await addIconAndDefinitions(pdf, currentMode, type);
    };

    const handleDownloadPDF = async () => {
        const pdf = new jsPDF("landscape", "mm", "a4");
        
        // Font
        pdf.addFileToVFS('Manrope-Regular.ttf', ManropeFont);
        pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');
        pdf.setFont('Manrope', 'normal');
    
        // Cover Page
        pdf.text(projectName, 10, 10);

        // Index Page
        pdf.addPage();

        // Task A All Page
        let text = 'The OL aspects/potential of your project that I could initially capture';
        await addTaskPage(pdf, text, 'analyse-a-all', 'A', 'All'); 
        
        //Task A Principles
        if (componentsRef.current.filter((c) => c.type === 'Principle').length !== 0) {
            text = 'The OL aspects/potential of your project > PRINCIPLES focus';
            await addTaskPage(pdf, text, 'analyse-a-p', 'A', 'Principle'); 
        }
        //Task A Perspectives
        if (componentsRef.current.filter((c) => c.type === 'Principle').length !== 0) {
            text = 'The OL aspects/potential of your project > PERSPECTIVES focus';
            await addTaskPage(pdf, text, 'analyse-a-pe', 'A', 'Perspective'); 
        }
        //Task A Dimensions
        if (componentsRef.current.filter((c) => c.type === 'Principle').length !== 0) {
            text = 'The OL aspects/potential of your project > DIMENSIONS focus';
            await addTaskPage(pdf, text, 'analyse-a-d', 'A', 'Dimension'); 
        }
        //Task B
        //Task C
        //Task D
        pdf.save("Visual_Report.pdf");
    };

    // Handle input change for project name
    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };

    const handleTaskChange = (task) => {
        setActiveTask(task); // Set active button based on the index
        setMode('analyse-' + task.toLowerCase());
    };

    const handleASubtaskChange = (subtask) => {
        setASubtask(subtask); // Set active button based on the index
        setMode('analyse-a-' + subtask.toLowerCase())
        
        document.documentElement.style.setProperty('--background-color', colors['Wave'][subtask]);
        document.documentElement.style.setProperty('--title-color', colors['Text'][subtask]);
    };

    return (
    <>
        <div className='a-ol-compass'>
            <OLCompass 
                mode={mode}
                position="center" 
                resetState={resetState}
                onButtonClick={handleCompassClick}
            /> 
        </div>
        {!isExplanationPage && (
            <>
            <textarea
                className="a-textarea" 
                type="text" 
                placeholder='Insert Project Name'
                value={projectName} 
                onChange={handleInputChange}
                spellCheck="false"
            ></textarea>
            <div className="a-tasks-nav fixed">
                <button 
                    className={`a-task-button ${'A' === activeTask ? 'active' : ''}`} 
                    onClick={() => handleTaskChange('A')}>
                    A
                </button>

                <button 
                    className={`a-task-button ${'B' === activeTask ? 'active' : ''}`} 
                    onClick={() => handleTaskChange('B')}>
                    B
                </button>

                <button 
                    className={`a-task-button ${'C' === activeTask ? 'active' : ''}`} 
                    onClick={() => handleTaskChange('C')}>
                    C
                </button>

                <button 
                    className={`a-task-button ${'D' === activeTask ? 'active' : ''}`} 
                    onClick={() => handleTaskChange('D')}>
                    D
                </button>
                <button 
                    className='a-generate-pdf-button'
                    onClick={handleDownloadPDF}>
                    Generate Visual Report
                </button>
            </div> 

            {activeTask === 'A' &&
            <>
            <div className="a-subtask-nav">
                <button 
                    className={`a-subtask-button ${'' === ASubtask ? 'active' : ''}`} 
                    onClick={() => handleASubtaskChange('')}>
                    All
                </button>

                <button 
                    className={`a-subtask-button ${'Principle' === ASubtask ? 'active' : ''}`} 
                    onClick={() => handleASubtaskChange('Principle')}>
                    P
                </button>

                <button 
                    className={`a-subtask-button ${'Perspective' === ASubtask ? 'active' : ''}`} 
                    onClick={() => handleASubtaskChange('Perspective')}>
                    Pe
                </button>

                <button 
                    className={`a-subtask-button ${'Dimension' === ASubtask ? 'active' : ''}`} 
                    onClick={() => handleASubtaskChange('Dimension')}>
                    D
                </button>
            </div>
            
                {ASubtask !== 'All' &&
                    <div className='a-definitions-container fixed'>
                        {components
                            .filter((c) => c.Type === ASubtask) // Filter by the specific type
                            .map((c) => (
                                <div className='a-definition'>
                                    <p className='a-definition-title'>{c.Title}</p>
                                    <p className='a-definition-text'>{c.Text}</p>
                                </div>
                        ))}
                    </div>
                }
            
                </>
            }

            {activeTask === 'B' &&
                <>
                <div className='a-changed-components'>
                    <p className='a-added-components'>ADDED</p>
                    <p className='a-removed-components'>REMOVED</p>
                </div>
                </>
            }
            </>
        )}
        <Menu />
    </>  
    );
};
export default AnalysePage;
