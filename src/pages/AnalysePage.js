import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import OLCompass from '../components/OLCompass'
import BigWave from '../components/BigWave.js'
import CompassIcon from '../components/CompassIcon'
import Menu from '../components/Menu';
import Description from '../components/Description';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { encodedFonts } from '../utils/Fonts.js';
import { State, StateContext } from "../State";
import '../styles/pages/AnalysePage.css';
import coverImage from '../assets/images/PDF-cover-background.png';
import { createRoot } from 'react-dom/client';

const AnalysePage = () => {
    const {
        colors,
        isExplanationPage,
        setIsExplanationPage,
        allComponents,
      } = useContext(StateContext);

    const [projectName, setProjectName] = useState('');
    const [isProjectNameFocused, setIsProjectNameFocused] = useState(false);
    const [components, setComponents] = useState([]);
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [mode, setMode] = useState('analyse');

    const componentsRef = useRef(components);

    useEffect(() => {
        componentsRef.current = components;
    }, [components]);
    
    const resetState = useCallback(() => {
        setProjectName('');
        setIsProjectNameFocused(false);
        setComponents([]);
        componentsRef.current = [];
        setActiveTask('A');
        setMode('analyse');
        setIsExplanationPage(true);
    }, [setIsExplanationPage]);

    // Handle Enter key
    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Enter') return;
        setIsExplanationPage(false);
    }, [setIsExplanationPage]);

    useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleDragStop = (code, title, label, headline, type, angle, x, y, textAreaX, textAreaY, textAreaData, arrowX1, arrowY1, arrowX2, arrowY2, topTip, rightTip) => {
        setComponents((prevComponents) => {
            const componentExists = prevComponents.some((component) => component.code === code);
        
            const updatedComponents = componentExists
                ? prevComponents.map((component) =>
                      component.code === code
                          ? {
                                ...component, // Keep existing fields
                                title,
                                label,
                                headline,
                                type,
                                angle,
                                x,
                                y,
                                textAreaX,
                                textAreaY,
                                textAreaData,
                                arrowX1,
                                arrowY1,
                                arrowX2,
                                arrowY2,
                                topTip,
                                rightTip
                            }
                          : component // Keep components that are not being updated as is
                  )
                : [
                      ...prevComponents,
                      {
                          code,
                          title,
                          label,
                          headline,
                          type,
                          angle,
                          x,
                          y,
                          textAreaX,
                          textAreaY,
                          textAreaData,
                          arrowX1,
                          arrowY1,
                          arrowX2,
                          arrowY2,
                          topTip,
                          rightTip
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

    const renderToCanvas = async(component, pdf, x, y, scale, resize) => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const root = createRoot(container);
        root.render(component);

        // Wait for the next frame to ensure the component is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 0));

        const canvas = await html2canvas(container, { scale: scale, logging: true, backgroundColor: null });

        root.unmount(); // Clean up the root

        //let canvas = await html2canvas(container, { scale: 3, logging: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
 
        // Original dimensions of the captured canvas
        const imgWidth = canvas.width; // In pixels
        const imgHeight = canvas.height; // In pixels
  
        // Convert pixel dimensions to mm
        const pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        const contentWidth = imgWidth * pixelToMm * resize;
        const contentHeight = imgHeight * pixelToMm * resize;
  
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);
         
        document.body.removeChild(container);
    };

    const addIconAndDefinitions = async(pdf, currentMode, type) => {
        // Compass Icon
        await renderToCanvas(
            <State>
                <CompassIcon 
                    mode={currentMode} 
                    type={type} />
            </State>,
            pdf, 20, 5, 3, 0.4
        );

        // Definitions
        await renderToCanvas(
            <div className='a-definitions-container'>
                {components
                    .filter((c) => c.type === type) // Filter by the specific type
                    .map((c, i) => (
                        <div key={i} className='a-definition'>
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
            pdf, 20, 60, 3, 0.3
        );
    };

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

        pdf.setFont('Manrope', 'medium');
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
            pdf.setFont('Manrope', 'bold');
            pdf.setTextColor(colors['Wave'][type]);
            pdf.text(highlightText, 112, 190);

            // Set the default color again for the 'focus' part
            let padding = 118;
            if(type === 'Principle') padding += 22; 
            else if(type === 'Perspective') padding += 29; 
            else if(type === 'Dimension') padding += 24; 

            pdf.setFont('Manrope', 'medium');
            pdf.setTextColor("#0a4461");
            pdf.text(remainingText, padding, 190);
        }

        // Subtask Menu
        await renderToCanvas(
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
                pdf, 20, 195, 3, 0.3
        );

        // Big Wave
        await renderToCanvas(
            <State>
                <BigWave 
                    className='a-ol-compass'
                    mode={currentMode}
                    pdfComponents = {componentsRef.current}
                /> 
            </State>,
            pdf, -150, -10, 3, 0.4
        );
         
        if(currentMode === 'analyse-a-all')
            return;
        if(currentMode.startsWith('analyse-a-'))
            await addIconAndDefinitions(pdf, currentMode, type);
    };

    const handleDownloadPDF = async () => {
        const pdf = new jsPDF("landscape", "mm", "a4");
        
        // Loading Fonts
        pdf.addFileToVFS('Manrope-Medium.ttf', encodedFonts['Manrope-Medium']);
        pdf.addFont('Manrope-Medium.ttf', 'Manrope', 'medium');
        pdf.addFileToVFS('Manrope-SemiBold.ttf', encodedFonts['Manrope-SemiBold']);
        pdf.addFont('Manrope-SemiBold.ttf', 'Manrope', 'semi-bold');
        pdf.addFileToVFS('Manrope-Bold.ttf', encodedFonts['Manrope-Bold']);
        pdf.addFont('Manrope-Bold.ttf', 'Manrope', 'bold');

        // Add the image as a background
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(coverImage, 'PNG', 0, 0, pageWidth, pageHeight);

        // Add text on top of the background
        pdf.setFont('Manrope', 'semi-bold');
        pdf.setTextColor('white'); // RGB for green
        pdf.setFontSize(60);
        pdf.text(projectName, 30, 40);

        // Index Page
        pdf.addPage();

        // Task A All Page
        let text = 'The OL aspects/potential of your project that I could initially capture';
        await addTaskPage(pdf, text, 'analyse-a-all', 'A', 'All'); 
        
        // Task A Principles
        if (componentsRef.current.filter((c) => c.type === 'Principle').length !== 0) {
            text = 'The OL aspects/potential of your project > PRINCIPLES focus';
            await addTaskPage(pdf, text, 'analyse-a-p', 'A', 'Principle'); 
        }
        // Task A Perspectives
        if (componentsRef.current.filter((c) => c.type === 'Perspective').length !== 0) {
            text = 'The OL aspects/potential of your project > PERSPECTIVES focus';
            await addTaskPage(pdf, text, 'analyse-a-pe', 'A', 'Perspective'); 
        }
        // Task A Dimensions
        if (componentsRef.current.filter((c) => c.type === 'Dimension').length !== 0) {
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

        {isExplanationPage && <Description mode="analyse" />}
        
        <div className='a-ol-compass'>
            <BigWave 
                mode={mode}
                resetState={resetState}
                onDragStop={handleDragStop}
                isProjectNameFocused={isProjectNameFocused}
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
                onFocus={() => setIsProjectNameFocused(true)}  // Set focus flag when focused
                onBlur={() => setIsProjectNameFocused(false)} 
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
