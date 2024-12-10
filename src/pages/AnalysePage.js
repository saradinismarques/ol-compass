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
        // Prepare the new component
    const newComponent = { Code: code, Title: title, Text: headline };

    setTaskAComponents((prevComponents) => {
        // Sort the existing components in the respective category (Principle, Perspective, Dimension)
        const sortedComponents = [...prevComponents[type]];

        // Insert the new component in the correct position
        // We use the code to find the right position (e.g., insert P3 before P4)
        const index = sortedComponents.findIndex(component => component.Code > code);

        if (index === -1) {
            // If the component code is larger than all existing codes, add it at the end
            sortedComponents.push(newComponent);
        } else {
            // Otherwise, insert it before the first larger code
            sortedComponents.splice(index, 0, newComponent);
        }

        // Return the updated components state with the new sorted list
        return {
            ...prevComponents,
            [type]: sortedComponents,
        };
    });
    };

    const handleTaskChange = (task) => {
        setActiveTask(task); // Set active button based on the index
    };

    const handleASubtaskChange = (subtask) => {
        setASubtask(subtask); // Set active button based on the index
        setMode('analyse' + '-' + activeTask.toLowerCase() + '-' + subtask.toLowerCase())
        
        if(subtask === "P") {
            document.documentElement.style.setProperty('--background-color', colors['Wave']['Principle']);
            document.documentElement.style.setProperty('--title-color', colors['Text']['Principle']);
        } else if(subtask === "Pe") {
            document.documentElement.style.setProperty('--background-color', colors['Wave']['Perspective']);
            document.documentElement.style.setProperty('--title-color', colors['Text']['Perspective']);
        } else if(subtask === "D") {
            document.documentElement.style.setProperty('--background-color', colors['Wave']['Dimension']);
            document.documentElement.style.setProperty('--title-color', colors['Text']['Dimension']);
        }
    };

    // PDF
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addFileToVFS('Manrope-Regular.ttf', ManropeFont);
    pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');
    pdf.setFont('Manrope', 'normal');
    const a4Width = pdf.internal.pageSize.getWidth();
    const a4Height = pdf.internal.pageSize.getHeight();

    const handleDownloadPDf = async () => {
        // Add Cover Page
        pdf.addPage(1);

        // Add content to the new page
        pdf.text(state.project, 10, 10);
    };

    const taskA = async () => {
        const element = document.getElementById('capture');
        
        const canvas = await html2canvas(element, { scale: 2, logging: true });
        const imgData = canvas.toDataURL('image/png');

        pdf.text("Sample text using Manrope font", 10, 20);
        // pdf.text("Ocean Literacy Concepts", 10, 20);

        // Step 3: Calculate the center position for the content
        // Dimensions of the A4 page
        
         // Original dimensions of the captured canvas
         const imgWidth = 600; // In pixels
         const imgHeight = 600; // In pixels
 
         // Convert pixel dimensions to mm
         const pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
         const contentWidth = imgWidth * pixelToMm;
         const contentHeight = imgHeight * pixelToMm;
 
         // Calculate the x and y positions to center the image
         const x = (a4Width - contentWidth)/ 2 ;
         const y = (a4Height - contentHeight) / 2;
        // Example: Add an image (optional)
        // (You need the image as a Base64 string or a URL)
        // const imgBase64 = "data:image/png;base64,...";
        // doc.addImage(imgBase64, "PNG", 10, 60, 50, 50);
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);

        // Add a new page
        pdf.addPage();

        // Add content to the new page
        pdf.text(state.project, 10, 10);
        pdf.text("You can add more content here.", 10, 20);
        // Trigger the download
        pdf.save("Ocean_Literacy.pdf");
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
        ></textarea>
        <div id='capture' className='a-ol-compass'>
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
                onClick={taskA}>
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
                className={`a-subtask-button ${'P' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('P')}>
                P
            </button>

            <button 
                className={`a-subtask-button ${'Pe' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('Pe')}>
                Pe
            </button>

            <button 
                className={`a-subtask-button ${'D' === ASubtask ? 'active' : ''}`} 
                onClick={() => handleASubtaskChange('D')}>
                D
            </button>
        </div>
            {ASubtask === "P" &&
                <div className='a-definitions-container'>
                    {taskAComponents['Principle'].map((c) => (
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