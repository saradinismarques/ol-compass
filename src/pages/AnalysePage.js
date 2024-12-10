import React, { useState, useMemo } from 'react';
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

    const initialTaskA = useMemo(() => ({
        components: [],
        texts: [],
    }), []);
    
    const [state, setState] = useState(initialState); 
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [mode, setMode] = useState('analyse');

    const handleButtonClick = (index) => {
        setActiveTask(index); // Set active button based on the index
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
            // onButtonClick={handleCompassClick}
            // selectedComponents={selectedComponents}
        ></textarea>
        <div id='capture' className='a-ol-compass'>
            <OLCompass 
                colors={colors}
                mode={mode}
                position="center" 
            /> 
        </div>
        <Menu />
        <div className="a-tasks-nav">
            <button 
                className={`a-task-button ${'A' === activeTask ? 'active' : ''}`} 
                onClick={taskA}>
                A
            </button>

            <button 
                className={`a-task-button ${'B' === activeTask ? 'active' : ''}`} 
                onClick={taskA}>
                B
            </button>

            <button 
                className={`a-task-button ${'C' === activeTask ? 'active' : ''}`} 
                onClick={taskA}>
                C
            </button>

            <button 
                className={`a-task-button ${'D' === activeTask ? 'active' : ''}`} 
                onClick={taskA}>
                D
            </button>

        </div>
        <button onClick={taskA}>Generate Visual Report</button>
        </>
    );
};

export default AnalysePage;