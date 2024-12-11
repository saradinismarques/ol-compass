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

    // PDF
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addFileToVFS('Manrope-Regular.ttf', ManropeFont);
    pdf.addFont('Manrope-Regular.ttf', 'Manrope', 'normal');
    pdf.setFont('Manrope', 'normal');
    const a4Width = pdf.internal.pageSize.getWidth();
    const a4Height = pdf.internal.pageSize.getHeight();

    const handleDownloadPDf = async () => {
        // Add Cover Page
        
    };

    const taskA = async () => {
        const element = document.getElementById('capture');
        
        const canvas = await html2canvas(element, { scale: 2, logging: true });
        const imgData = canvas.toDataURL('image/png');

        // Add content to the new page
        pdf.text(state.project, 10, 10);
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
        pdf.addPage();
        
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);

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