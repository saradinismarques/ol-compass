import React, { useState, useMemo, useCallback } from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ManropeFont from '../utils/Font.js';
import '../styles/pages/AnalysePage.css';

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
    };
    
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

    

    const handleDownloadPDF = async () => {
        // PDF
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addFileToVFS('Manrope-Regular.ttf', ManropeFont);
        pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');
        pdf.setFont('Manrope', 'normal');
        const a4Width = pdf.internal.pageSize.getWidth();
        const a4Height = pdf.internal.pageSize.getHeight();

        // Cover 
        pdf.text(state.project, 10, 10);

        // Index 
        pdf.addPage();

        // Task A.All 
        
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

        pdf.setFontSize(13);
        pdf.setTextColor("#0a4461");
        pdf.text('The OL aspects/potential of your project that I could initially capture', 20, 190);
        
        // Capture the task menu section
        const element2 = document.getElementById('task-menu');
        
        const canvas2 = await html2canvas(element2, { scale: 4, logging: true, backgroundColor: null });
        const imgData2 = canvas2.toDataURL('image/png');

        // Calculate the width and height for the image (in mm)
        // Get the natural width and height of the captured image
        const imgWidthPx2 = canvas2.width;
        const imgHeightPx2 = canvas2.height;

        // Convert the image dimensions from pixels to mm for the PDF
        const pixelToMm2 = 25.4 / 96; // Conversion factor: 1 inch = 25.4 mm, 1 pixel = 1/96 inches
        const imgWidth2 = imgWidthPx2 * pixelToMm2;
        const imgHeight2 = imgHeightPx2 * pixelToMm2;

        // Define a scaling factor to make the image smaller
        const scaleFactor = 0.2; // Example: scale the image to 50% of its original size

        // Apply the scaling factor to the image width and height
        const scaledImgWidth = imgWidth2 * scaleFactor;
        const scaledImgHeight = imgHeight2 * scaleFactor;

        // Add the captured image to the PDF (position at the top of the page)
        pdf.addImage(imgData2, 'PNG', 20, 196, scaledImgWidth, scaledImgHeight);

        const element = document.getElementById('ol-compass');
        const canvas = await html2canvas(element, { scale: 4, logging: true });
        const imgData = canvas.toDataURL('image/png');

        // Step 3: Calculate the center position for the content
        // Dimensions of the A4 page
        
        // Original dimensions of the captured canvas
        const imgWidth = 550; // In pixels
        const imgHeight = 550; // In pixels
 
        // Convert pixel dimensions to mm
        const pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        const contentWidth = imgWidth * pixelToMm;
        const contentHeight = imgHeight * pixelToMm;
 
        // Calculate the x and y positions to center the image
        const x = (a4Width - contentWidth)/ 2 ;
        const y = (a4Height - contentHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);

        // Task A.P 
        // Task A.Pe
        // Task A.D
        // Task B
        // Task C
        // Task D
        // Back Cover 

        // Trigger the download
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
        <Menu />
        <div className="a-tasks-nav">
            <div id='task-menu' className='a-tasks-buttons'>
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
            </div>
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
            <div className='a-definitions-container'>
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