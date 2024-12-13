import React, { useState, useMemo, useCallback } from 'react';
import OLCompass from '../components/OLCompass'
import CompassIcon from '../components/CompassIcon'
import Menu from '../components/Menu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ManropeFont from '../utils/Font.js';
import '../styles/pages/AnalysePage.css';
import ReactDOM from 'react-dom';

const AnalysePage = ({ colors }) => {
    const initialState = useMemo(() => ({
        project: '',
    }), []);

    // Initial state with 'Principle', 'Perspective', 'Dimension'
    const [taskAComponents, setTaskAComponents] = useState({
        Principle: [],
        Perspective: [],
        Dimension: [],
    });

    
    const [state, setState] = useState(initialState); 
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [ASubtask, setASubtask] = useState('All'); // Track active button
    const [mode, setMode] = useState('analyse');
    const [selectedComponents, setSelectedComponents] = useState([]);
    
    const resetState = useCallback(() => {
        setState(initialState);
        setActiveTask('A');
        setASubtask('All');
        setMode('analyse');
    }, [initialState]);
    
    const handleCompassClick = (code, title, headline, type) => {
        setTaskAComponents((prevComponents) => {
            // Get the existing components for the specific type
            let updatedComponents = [...prevComponents[type]];
    
            // Check if the component with the same Code already exists
            const componentExists = updatedComponents.some(component => component.Code === code);
    
            if (componentExists) {
                // If it exists, remove it
                updatedComponents = updatedComponents.filter(component => component.Code !== code);
            } else {
                // If it doesn't exist, add the new component
                const newComponent = { Code: code, Title: title, Text: headline };
    
                // Find the correct position to insert the new component in sorted order
                const index = updatedComponents.findIndex(component => component.Code > code);
    
                if (index === -1) {
                    updatedComponents.push(newComponent); // Add at the end if it's the largest
                } else {
                    updatedComponents.splice(index, 0, newComponent); // Insert at the correct position
                }
            }
    
            // Return the updated components state
            return {
                ...prevComponents,
                [type]: updatedComponents,
            };
        });
        setSelectedComponents((prevState) => {
             // If the code exists, remove it. Otherwise, add it.
            if (prevState.includes(code)) {
                return prevState.filter((item) => item !== code); // Remove it
            } else {
                return [...prevState, code]; // Add it if it doesn't exist
            }
        });
    }
    const handleTaskChange = (task) => {
        setActiveTask(task); // Set active button based on the index
    };

    const handleASubtaskChange = (subtask) => {
        let subtaskName;

        if(subtask === "All")
            subtaskName ="-a-all";
        else if(subtask === "Principle")
            subtaskName = "-a-p";
        else if(subtask === "Perspective")
            subtaskName = "-a-pe";
        else if(subtask === "Dimension")
            subtaskName = "-a-d";
        
        setASubtask(subtask); // Set active button based on the index
        setMode('analyse' + subtaskName)
        
        document.documentElement.style.setProperty('--background-color', colors['Wave'][subtask]);
        document.documentElement.style.setProperty('--title-color', colors['Text'][subtask]);
    };

    const addTaskPage = async(pdf, text, currentMode, subtask, type) => {
        const a4Width = pdf.internal.pageSize.getWidth();
        const a4Height = pdf.internal.pageSize.getHeight();

        pdf.addPage();
        // Set the green background for the third page
        pdf.setFillColor('#dfe9e9'); // RGB for green
        pdf.rect(0, 0, a4Width, a4Height, 'F'); // Draw a filled rectangle covering the entire page

        // Add a white rounded rectangle in the center of the page
        const rectWidth = a4Width - 20;  // Width of the rectangle
        const rectHeight = a4Height - 20; // Height of the rectangle
        const rectX = (a4Width - rectWidth) / 2;  // Centered X position
        const rectY = (a4Height - rectHeight) / 2; // Centered Y position
        const borderRadius = 5; // Radius of the rounded corners
                
        pdf.setFillColor('white'); // RGB for green
        pdf.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'F'); // Draw a filled rectangle covering the entire page

         
        
        const parts = text.split(' focus');
        const mainText = parts[0].trim();
        const highlightText = mainText.split(' ').pop();  // Get the last word (to highlight)
        const remainingText = 'focus';

        pdf.setFontSize(13);
        pdf.setTextColor("#0a4461");

        let currentText;
        if(type === 'All') {
            currentText = text;
            pdf.text(currentText, 20, 190);
        } else {
            currentText = mainText.replace(highlightText, '').trim();
           
            pdf.text(currentText, 20, 190);

            // Measure the width of the main text (to correctly position the highlighted part)
            //const textWidth = pdf.getTextWidth(mainText.replace(highlightText, '').trim());

            // Set the highlight color for the key part (the word to be highlighted)
            pdf.setTextColor(colors['Wave'][type]);
            pdf.text(highlightText, 118, 190);

            // Set the default color again for the 'focus' part
            let padding = 118;
            if(type === 'Principle')
                padding += 27; 
            else if(type === 'Perspective')
                padding += 34; 
            else if(type === 'Dimension')
                padding += 30; 

            pdf.setTextColor("#0a4461");
            pdf.text(remainingText, padding, 190);
        }
       

        // OL Compass
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        // Render React component into the container
        ReactDOM.render(
            <OLCompass id='ol-compass' className='a-ol-compass'
                colors={colors}
                mode={currentMode}
                position="center" 
                resetState={resetState}
                onButtonClick={handleCompassClick}
                selectedComponents={selectedComponents}
            />,
            container
        );

        let canvas = await html2canvas(container, { scale: 2, logging: true });
        let imgData = canvas.toDataURL('image/png');

        // Original dimensions of the captured canvas
        let imgWidth = 550; // In pixels
        let imgHeight = 550; // In pixels
 
        // Convert pixel dimensions to mm
        let pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        let contentWidth = imgWidth * pixelToMm;
        let contentHeight = imgHeight * pixelToMm;
 
        // Calculate the x and y positions to center the image
        let x = (a4Width - contentWidth)/ 2 ;
        let y = (a4Height - contentHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);
        
        document.body.removeChild(container);

        // Subtask Menu
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        // Render React component into the container
        ReactDOM.render(
            <div className="a-tasks-nav">
            <button className={`a-task-button ${'A' === activeTask ? 'active' : ''}`} >
                A
            </button>

            <button className={`a-task-button ${'B' === activeTask ? 'active' : ''}`} >
                B
            </button>

            <button className={`a-task-button ${'C' === activeTask ? 'active' : ''}`} >
                C
            </button>

            <button className={`a-task-button ${'D' === activeTask ? 'active' : ''}`} >
                D
            </button>
        </div>,
            container
        );

        canvas = await html2canvas(container, { scale: 1, logging: true, backgroundColor: null });
        imgData = canvas.toDataURL('image/png');

        // Original dimensions of the captured canvas
        imgWidth = canvas.width; // In pixels
        imgHeight = canvas.height; // In pixels
 
        // Convert pixel dimensions to mm
        pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        contentWidth = imgWidth * pixelToMm;
        contentHeight = imgHeight * pixelToMm;
 
        pdf.addImage(imgData, 'PNG', 20, 195, contentWidth, contentHeight);
        
        document.body.removeChild(container);

        
        // Definitions
        if(type === "All")
            return;
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        // Render React component into the container
        ReactDOM.render(
            <div className='a-definitions-container'>
                {taskAComponents[type].map((c) => (
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
                        <p className='a-definition-text'>{c.Text}</p>
                    </div>
                ))}
            </div>,
            container
        );

        canvas = await html2canvas(container, { scale: 2, logging: true, backgroundColor: null });
        imgData = canvas.toDataURL('image/png');

        // Original dimensions of the captured canvas
        imgWidth = canvas.width*0.5; // In pixels
        imgHeight = canvas.height*0.5; // In pixels
 
        // Convert pixel dimensions to mm
        pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        contentWidth = imgWidth * pixelToMm;
        contentHeight = imgHeight * pixelToMm;
 
        pdf.addImage(imgData, 'PNG', 20, 50, contentWidth, contentHeight);
        
        document.body.removeChild(container);

        // Compass Icon
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);
 
        // Render React component into the container
        ReactDOM.render(
            <CompassIcon 
                colors={colors} 
                mode={currentMode}
                type={type} 
            />,
            container
        );
 
        canvas = await html2canvas(container, { scale: 1, logging: true, backgroundColor: null });
        imgData = canvas.toDataURL('image/png');
 
        // Original dimensions of the captured canvas
        imgWidth = canvas.width; // In pixels
        imgHeight = canvas.width; // In pixels
  
        // Convert pixel dimensions to mm
        pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        contentWidth = imgWidth * pixelToMm;
        contentHeight = imgHeight * pixelToMm;
  
        pdf.addImage(imgData, 'PNG', 20, 5, contentWidth, contentHeight);
         
        document.body.removeChild(container);
 
    };

    const handleDownloadPDF = async () => {
        // PDF
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addFileToVFS('Manrope-Regular.ttf', ManropeFont);
        pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');
        pdf.setFont('Manrope', 'normal');
        
        // Cover 
        // pdf.text(state.project, 10, 10);

        // // Index 
        // pdf.addPage();

        // Task A.All 
        let text = 'The OL aspects/potential of your project that I could initially capture';
        await addTaskPage(pdf, text, 'analyse-pdf-a-all', 'A', 'All'); 
          
        //Task A.P 
        if(taskAComponents['Principle'].length !== 0) {
            text = 'The OL aspects/potential of your project > PRINCIPLES focus';
            await addTaskPage(pdf, text, 'analyse-pdf-a-p', 'A', 'Principle'); 
        }
        // Task A.Pe
        if(taskAComponents['Perspective'].length !== 0) {
            text = 'The OL aspects/potential of your project > PERSPECTIVES focus';
            await addTaskPage(pdf, text, 'analyse-pdf-a-pe', 'A', 'Perspective'); 
        }
        // Task A.D
        if(taskAComponents['Dimension'].length !== 0) {
            text = 'The OL aspects/potential of your project > DIMENSIONS focus';
            await addTaskPage(pdf, text, 'analyse-pdf-a-d', 'A', 'Dimension'); 
        }
        // // Task B
        // handleTaskChange("B");
        // text = 'Your revision of the visual map';
        // await addTaskPage(pdf, text); 
        
        // // Task C
        // handleTaskChange("B");
        // text = 'Your revision of the visual map';
        // await addTaskPage(pdf, text); 
        
        // // Task D
        // // Back Cover 

        // // Trigger the download
        pdf.save("Visual_Report.pdf");
        
        
    };
    

    // Handle input change for project name
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value // Update the project name in the state
        }));
    };

    return (
        <>
        <textarea
            name="project"
            className="a-textarea" 
            type="text" 
            placeholder='Insert Project Name'
            value={state.project} 
            onChange={handleInputChange}
            spellcheck="false"
        ></textarea>
        <div id='ol-compass' className='a-ol-compass'>
            <OLCompass 
                colors={colors}
                mode={mode}
                position="center" 
                resetState={resetState}
                onButtonClick={handleCompassClick}
            /> 
        </div>
        {/* <CompassIcon 
                colors={colors} 
                mode={'analyse'}
                type={'Dimension'} 
        /> */}
        <Menu />
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
                className={`a-subtask-button ${'All' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('All')}>
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
                {taskAComponents[ASubtask].map((c) => (
                    <div className='a-definition'>
                        <p className='a-definition-title'>{c.Title}</p>
                        <p className='a-definition-text'>{c.Text}</p>
                    </div>
                ))}
            </div>
        }
        
            </>
        }
        </>
    );
};

export default AnalysePage;