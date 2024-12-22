import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import OLCompass from '../components/OLCompass'
import BigWave from '../components/BigWave.js'
import CompassIcon from '../components/CompassIcon'
import Menu from '../components/Menu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ManropeFont from '../utils/Font.js';
import ReactDOM from 'react-dom';
import { State, StateContext } from "../State";
import '../styles/pages/AnalysePage.css';
import coverImage from '../assets/images/PDF-cover-background.png';

const AnalysePage = () => {
    const {
        colors,
        isExplanationPage,
        setIsExplanationPage,
        allComponents,
      } = useContext(StateContext);

    const [projectName, setProjectName] = useState('');
    const [components, setComponents] = useState([]);
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [mode, setMode] = useState('analyse');

    const componentsRef = useRef(components);

    useEffect(() => {
        componentsRef.current = components;
    }, [components]);
    
    const resetState = useCallback(() => {
        setProjectName('');
        setActiveTask('A');
        setMode('analyse');
    }, []);

    // Handle Enter key
    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Enter') return;
        setIsExplanationPage(false);
    }, [setIsExplanationPage]);

    useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleDragStop = (code, title, label, headline, type, angle, x, y, textAreaX, textAreaY, textAreaData) => {
        setComponents((prevComponents) => {
            const componentExists = prevComponents.some((component) => component.Code === code);
        
            const updatedComponents = componentExists
                ? prevComponents.map((component) =>
                      component.Code === code
                          ? {
                                ...component, // Keep existing fields
                                Title: title,
                                Label: label,
                                Headline: headline,
                                Type: type,
                                angle,
                                x,
                                y,
                                textAreaX,
                                textAreaY,
                                textAreaData
                            }
                          : component // Keep components that are not being updated as is
                  )
                : [
                      ...prevComponents,
                      {
                          Code: code,
                          Title: title,
                          Label: label,
                          Headline: headline,
                          Type: type,
                          angle,
                          x,
                          y,
                          textAreaX,
                          textAreaY,
                          textAreaData
                      },
                  ];
        
            const sortedComponents = updatedComponents.sort((a, b) => {
                const indexA = allComponents.indexOf(a.Code);
                const indexB = allComponents.indexOf(b.Code);
        
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
                    .filter((c) => c.Type === type) // Filter by the specific type
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
                                {c.Title}
                            </p>
                            <p className='a-definition-text'>{c.Headline}</p>
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
                <BigWave 
                    className='a-ol-compass'
                    mode={currentMode}
                    selected={componentsRef.current.map((component) => component.Code)}
                    positions = {componentsRef.current}
                /> 
            </State>,
            container
        );
        
        canvas = await html2canvas(container, { scale: 3, logging: true, backgroundColor: null  });
        imgData = canvas.toDataURL('image/png');
        
        // Original dimensions of the captured canvas
        imgWidth = canvas.width; // In pixels
        imgHeight = canvas.height; // In pixels
         
        contentWidth = imgWidth * pixelToMm * 0.4;
        contentHeight = imgHeight * pixelToMm * 0.4;
         
        // Calculate the x and y positions to center the image
        let x = (a4Width - contentWidth) / 2 - 50;
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
    
        // Add the image as a background
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(coverImage, 'PNG', 0, 0, pageWidth, pageHeight);

        // Add text on top of the background
        pdf.setTextColor('white'); // RGB for green
        pdf.setFontSize(50);
        pdf.text(projectName, 30, 30);

        // Index Page
        pdf.addPage();

        // Task A All Page
        let text = 'The OL aspects/potential of your project that I could initially capture';
        await addTaskPage(pdf, text, 'analyse-a-all', 'A', 'All'); 
        
        // Task A Principles
        if (componentsRef.current.filter((c) => c.Type === 'Principle').length !== 0) {
            text = 'The OL aspects/potential of your project > PRINCIPLES focus';
            await addTaskPage(pdf, text, 'analyse-a-p', 'A', 'Principle'); 
        }
        // Task A Perspectives
        if (componentsRef.current.filter((c) => c.Type === 'Perspective').length !== 0) {
            text = 'The OL aspects/potential of your project > PERSPECTIVES focus';
            await addTaskPage(pdf, text, 'analyse-a-pe', 'A', 'Perspective'); 
        }
        // Task A Dimensions
        if (componentsRef.current.filter((c) => c.Type === 'Dimension').length !== 0) {
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

    return (
    <>
        <OLCompass 
            mode={mode}
            position={isExplanationPage ? "center-2" : "left-2"}
            resetState={resetState}
        /> 
        
        <div className='a-ol-compass'>
            <BigWave 
                mode={mode}
                resetState={resetState}
                onDragStop={handleDragStop}
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
