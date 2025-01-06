import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import OLCompass from '../components/OLCompass.js';
import DraggableCompass from '../components/DraggableCompass.js'
import CompassIcon from '../components/CompassIcon.js'
import Menu from '../components/Menu';
import Description from '../components/Description';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib"; // For merging PDFs
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { State, StateContext } from "../State";
import coverImage from '../assets/images/analyse/PDF-cover-background.png';
import indexImage from '../assets/images/analyse/PDF-index.png';
import { createRoot } from 'react-dom/client';
import '../styles/pages/AnalysePage.css';

const AnalysePage = () => {
    const {
        colors,
        isExplanationPage,
        setIsExplanationPage,
        allComponents,
      } = useContext(StateContext);

    const [projectName, setProjectName] = useState('');
    const [stopTextareaFocus, setStopTextareaFocus] = useState(false);
    const [components, setComponents] = useState([]);
    const [activeTask, setActiveTask] = useState('A'); // Track active button
    const [mode, setMode] = useState('analyse-a');
    const [downloadProgress, setDownloadProgress] = useState(0); // State to trigger re-renders
    const [isGenerating, setIsGenerating] = useState(false);

    const componentsRef = useRef(components);

    useEffect(() => {
        componentsRef.current = components;
    }, [components]);
    
    const resetState = useCallback(() => {
        setProjectName('');
        setStopTextareaFocus(false);
        setComponents([]);
        componentsRef.current = [];
        setActiveTask('A');
        setMode('analyse-a');
        setDownloadProgress(0);
        setIsGenerating(false);
        setIsExplanationPage(true);
    }, [setIsExplanationPage]);

    const handleDragStop = (code, title, label, headline, type, angle, x, y, textareaX, textareaY, textareaData, arrowX1, arrowY1, arrowX2, arrowY2, textGapY2, topTip, rightTip) => {
        // Delete if receives null
        if(title === null) {
            // Remove the component from selectedComponents
            setComponents((prevComponents) => {
                const updatedComponents = prevComponents.filter(
                    (component) => component.code !== code
                );
                componentsRef.current = updatedComponents; // Update the ref
                return updatedComponents;
            });
        } else {
            setComponents((prevComponents) => {
                // Check if the component exists in the current list
                const componentExists = prevComponents.some((component) => component.code === code);
              
                // Define the new or updated component object
                const newComponent = {
                  code,
                  title,
                  label,
                  headline,
                  type,
                  angle,
                  x,
                  y,
                  textareaX,
                  textareaY,
                  textareaData,
                  arrowX1,
                  arrowY1,
                  arrowX2,
                  arrowY2,
                  textGapY2,
                  topTip,
                  rightTip,
                };
              
                // Update or add the component
                const updatedComponents = componentExists
                  ? prevComponents.map((component) =>
                      component.code === code ? { ...component, ...newComponent } : component
                    )
                  : [...prevComponents, newComponent];
              
                // Sort the components based on their order in `allComponents`
                const sortedComponents = updatedComponents.sort((a, b) => {
                  const indexA = allComponents.indexOf(a.code);
                  const indexB = allComponents.indexOf(b.code);
              
                  return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB;
                });
              
                // Update the reference and return the sorted components
                componentsRef.current = sortedComponents;
                return sortedComponents;
            });     
        } 
    };

    // Handle Enter key
    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Enter') return;
        setIsExplanationPage(false);
    }, [setIsExplanationPage]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Handle input change for project name
    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };
    
    const handleTaskChange = (task) => {
        setActiveTask(task); // Set active button based on the index
        setMode('analyse-' + task.toLowerCase());
    };

    // PDF Generation Functions
    const handleDownloadPDF = async () => {
        setStopTextareaFocus(true);
        const pageWidth = 297; // mm
        const pageHeight = (9 / 16) * pageWidth; // mm for 16:9
    
        const pages = [
            async (pdf) => {
                // Loading Fonts
                pdf.addFileToVFS('Manrope-Medium.ttf', encodedFonts['Manrope-Medium']);
                pdf.addFont('Manrope-Medium.ttf', 'Manrope', 'medium');
                pdf.addFileToVFS('Manrope-SemiBold.ttf', encodedFonts['Manrope-SemiBold']);
                pdf.addFont('Manrope-SemiBold.ttf', 'Manrope', 'semi-bold');
                pdf.addFileToVFS('Manrope-Bold.ttf', encodedFonts['Manrope-Bold']);
                pdf.addFont('Manrope-Bold.ttf', 'Manrope', 'bold');

                // Cover Page
                pdf.addImage(coverImage, "PNG", 0, 0, pageWidth, pageHeight);
                pdf.setFont("Manrope", "semi-bold");
                pdf.setTextColor("white");
                pdf.setFontSize(55);
                pdf.text(projectName, 15, 40);
            },
            async (pdf) => {
                // Index Page
                pdf.addImage(indexImage, "PNG", 0, 0, pageWidth, pageHeight);
            },
            async (pdf) => {
                 // Task A All Page
                const text = 'The OL aspects/potential of your project that I could initially capture';
                await addTaskPage(pdf, text, 'A', 'All'); 
            },
            async (pdf) => {
                  
                // Task A Principles
                const text = 'The OL aspects/potential of your project > PRINCIPLES focus';
                await addTaskPage(pdf, text, 'A', 'Principle'); 
            },
            async (pdf) => {
                // Task A Perspectives
                const text = 'The OL aspects/potential of your project > PERSPECTIVES focus';
                await addTaskPage(pdf, text, 'A', 'Perspective'); 
            },
            async (pdf) => {
                // Task A Dimensions
                const text = 'The OL aspects/potential of your project > DIMENSIONS focus';
                await addTaskPage(pdf, text, 'A', 'Dimension'); 
            },
            //Task B
            //Task C
            //Task D
        ];
    
        const pdfBlobs = []; // Store each PDF as a Blob
        setIsGenerating(true);

        try {
            // Generate individual PDFs
            for (let i = 0; i < pages.length; i++) {
                const pdf = new jsPDF("landscape", "mm", [pageWidth, pageHeight]);
                await pages[i](pdf); // Render content for the page
                
                const pdfBlob = pdf.output("blob");
                
                pdfBlobs.push(pdfBlob);
        
                 // Use setTimeout to delay progress update (to avoid too many state updates)
                setTimeout(() => {
                    setDownloadProgress(((i + 1) / pages.length) * 100);
                }, 50); // Delay progress updates by 50ms
            }
    
            // Merge all individual PDFs
            const mergedPdf = await mergePDFChunks(pdfBlobs);
            setDownloadProgress(100); // Complete progress

            // Save the final merged PDF
            const link = document.createElement("a");
            link.href = URL.createObjectURL(mergedPdf);
            if (projectName.length !== 0) 
                link.download = `Visual_Report_${projectName.replace(/ /g, "_")}.pdf`;
            else 
                link.download = `Visual_Report.pdf`;
            link.click();

            setIsGenerating(false);
            setDownloadProgress(0); // Reset progress once done
            setStopTextareaFocus(false);
        } catch (error) {
            setIsGenerating('Error');
            setDownloadProgress(0); // Reset progress once done
        } 
    };
    
    const addTaskPage = async(pdf, text, task, type) => {
        // Loading Fonts
        pdf.addFileToVFS('Manrope-Medium.ttf', encodedFonts['Manrope-Medium']);
        pdf.addFont('Manrope-Medium.ttf', 'Manrope', 'medium');
        pdf.addFileToVFS('Manrope-SemiBold.ttf', encodedFonts['Manrope-SemiBold']);
        pdf.addFont('Manrope-SemiBold.ttf', 'Manrope', 'semi-bold');
        pdf.addFileToVFS('Manrope-Bold.ttf', encodedFonts['Manrope-Bold']);
        pdf.addFont('Manrope-Bold.ttf', 'Manrope', 'bold');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Margin
        pdf.setFillColor('#dfe9e9'); // RGB for green
        pdf.rect(0, 0, pageWidth, pageHeight, 'F'); // Draw a filled rectangle covering the entire page

        const rectWidth = pageWidth - 16;  // Width of the rectangle
        const rectHeight = pageHeight - 16; // Height of the rectangle
        const rectX = (pageWidth - rectWidth) / 2;  // Centered X position
        const rectY = (pageHeight - rectHeight) / 2; // Centered Y position
        const borderRadius = 3; // Radius of the rounded corners
                
        pdf.setFillColor('white'); // RGB for green
        pdf.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'F'); // Draw a filled rectangle covering the entire page

        // Text
        const parts = text.split(' focus');
        const mainText = parts[0].trim();
        const highlightText = mainText.split(' ').pop();  // Get the last word (to highlight)
        const remainingText = 'focus';

        pdf.setFont('Manrope', 'medium');
        pdf.setFontSize(12);
        pdf.setTextColor("#0a4461");

        let currentText;
        if(type === 'All' || task !== 'A') {
            currentText = text;
            pdf.text(currentText, 16, 151);
        } else {
            currentText = mainText.replace(highlightText, '').trim();
           
            pdf.text(currentText, 16, 151);

            // Set the highlight color for the key part (the word to be highlighted)
            pdf.setFont('Manrope', 'bold');
            pdf.setTextColor(colors['Wave'][type]);
            pdf.text(highlightText, 101, 151);

            // Set the default color again for the 'focus' part
            let padding = 101;
            if(type === 'Principle') padding += 25.5; 
            else if(type === 'Perspective') padding += 32; 
            else if(type === 'Dimension') padding += 27.5; 

            pdf.setFont('Manrope', 'medium');
            pdf.setTextColor("#0a4461");
            pdf.text(remainingText, padding, 151);
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
                pdf, 14, 155, 'auto', 1
        );

        // Big Wave
        let x;
        if(type === "All") 
            x = 52.5;
        else
            x = 93;    ;

        await renderToCanvas(
            <State>
                <DraggableCompass 
                    className='a-ol-compass'
                    mode={'analyse-' + task.toLowerCase()}
                    currentType={type}
                    pdfComponents={componentsRef.current}
                /> 
            </State>,
            pdf, x, 12, 1450, 1
        );
         
        if(task === 'A' && type === 'All')
            return;
        await addIconAndDefinitions(pdf, task, type);
    };

    const addIconAndDefinitions = async(pdf, task, type) => {
        // Compass Icon
        await renderToCanvas(
            <State>
                <CompassIcon 
                    mode={"analyse-" + task.toLowerCase()} 
                    currentType={type} />
            </State>,
            pdf, 11, 6, 'auto', 1.1
        );

        // Definitions
        if(componentsRef.current.filter((c) => c.type === type).length === 0)
            return;
        await renderToCanvas(
            <div className='a-definitions-container'>
                {componentsRef.current
                    .filter((c) => c.type === type) // Filter by the specific type
                    .map((c, i) => (
                        <div key={i} className='a-definition'>
                            <p className='a-definition-title' 
                                style={{
                                    color: `${colors['Label'][type]}`,
                                    background: `linear-gradient(
                                        to right, 
                                        ${colors['Wave'][type]} 5%, 
                                        white 60%
                                    )`,
                                }}>
                                {c.title}
                            </p>
                            <p className='a-definition-text'>{c.headline}</p>
                        </div>
                ))}
                <div className="a-definitions-top-lines">
                    <div className="a-definitions-horizontal-line"
                        style={{
                            background: `${colors['Intro Text'][type]}`,
                        }}>
                    </div>
                    <div className="a-definitions-vertical-line"
                        style={{
                            background: `linear-gradient(
                                to bottom, 
                                ${colors['Intro Text'][type]} 60px, 
                                white 59px 100%
                            )`,
                        }}>
                    </div>
                </div>
            </div>,
            pdf, 16, 55, 'auto', 1
        );
    };

    const renderToCanvas = async(html, pdf, x, y, size, resizeFactor) => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        const root = createRoot(container);
        root.render(html);
        
        const scale = 2; // max = 10

        // Wait for the next frame to ensure the component is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 0));

        const canvas = await html2canvas(container, { scale: scale, logging: true, backgroundColor: null });
        root.unmount(); // Clean up the root

        const imgData = canvas.toDataURL('image/png');
 
        // Original dimensions of the captured canvas
        let imgWidth, imgHeight;
        if(size === 'auto') {
            imgWidth = canvas.width / scale; // In pixels
            imgHeight = canvas.height / scale; // In pixels
        } else  {
            imgWidth = size / 2; // In pixels
            imgHeight = ((730/1.5)/(1536/2.2)) * imgWidth; // In pixels
        }

        // Convert pixel dimensions to mm
        const pixelToMm = 25.4 / 96; // Conversion factor (1 inch = 25.4 mm, screen DPI = 96)
        const contentWidth = imgWidth * pixelToMm * resizeFactor;
        const contentHeight = imgHeight * pixelToMm * resizeFactor;
  
        pdf.addImage(imgData, 'PNG', x, y, contentWidth, contentHeight);
         
        document.body.removeChild(container);
    };
    
    // Merge PDF chunks using pdf-lib
    const mergePDFChunks = async (pdfBlobs) => {
        const mergedPdf = await PDFDocument.create();

        for (const blob of pdfBlobs) {
            const pdfBytes = await blob.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);

            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        return new Blob([mergedPdfBytes], { type: "application/pdf" });
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
                <DraggableCompass 
                    mode={mode}
                    resetState={resetState}
                    onDragStop={handleDragStop}
                    stopTextareaFocus={stopTextareaFocus}
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
                    onFocus={() => setStopTextareaFocus(true)}  // Set focus flag when focused
                    onBlur={() => setStopTextareaFocus(false)} 
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
                        className={`a-generate-pdf-button ${isGenerating === true ? 'no-hover' : 'hover'}`}
                        onClick={handleDownloadPDF}
                        disabled={isGenerating === true} // Disable the button while generating
                        style={{
                            background: isGenerating === true 
                                ? `linear-gradient(to right, #0a4461 ${downloadProgress}%, white ${downloadProgress}%)`
                                : 'white', // Change background to show progress
                            color: isGenerating === true 
                                ? 'transparent'
                                : '', // Change background to show progress
                        }}
                    >
                    {isGenerating !== 'Error' ? 'Download Visual Report' : 'Try again'}
                    </button>
                    <p className='a-download-progress' style={{
                        color: isGenerating === 'Error' 
                            ? 'red' 
                            : isGenerating 
                            ? '#0a4461' 
                            : 'transparent', // Change text color based on isGenerating state
                    }}>
                        {isGenerating === 'Error' 
                            ? 'Error Generating PDF :(' 
                            : `${Math.round(downloadProgress)}% Complete`
                        }
                    </p>
                        
                </div> 
                </>
            )}
            <Menu />
        </>  
    );
};

export default AnalysePage;
