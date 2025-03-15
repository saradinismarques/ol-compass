import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon.js'
import Menu from '../components/Menu';
import Description from '../components/Description';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib"; // For merging PDFs
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { State, StateContext } from "../State.js";
import coverImage from '../assets/images/map/PDF-cover-background.png';
import { createRoot } from 'react-dom/client';
import '../styles/pages/Map2Page.css';

const Map2Page = () => {
  const {
    colors,
    language,
    showExplanation,
    setShowExplanation,
    mapComponents,
    setMapComponents,
    mapProjectName,
    setMapProjectName,
  } = useContext(StateContext);

  const [firstClick, setFirstClick] = useState(true);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [currentComponent, setCurrentComponent] = useState();
  const [downloadProgress, setDownloadProgress] = useState(0); // State to trigger re-renders
  const [isGenerating, setIsGenerating] = useState(false);

  const componentsRef = useRef(mapComponents);
  const textareaRefs = useRef([]); // Initialize refs for textareas

  useEffect(() => {
    componentsRef.current = mapComponents; // Keep the ref in sync with the latest state
  }, [mapComponents]);
  
  useEffect(() => {
    if(isGenerating)
      setCurrentComponent();
  }, [isGenerating]);

  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

  // Reset state and UI elements
  const resetState = useCallback(() => {
    setFirstClick(true);
    setShowExplanation(true);
    setCurrentComponent();
  }, [setShowExplanation]);

  // Trigger compass action
  const handleCompassClick = (code, label, paragraph, type) => {
    if(code) {
      setMapComponents(prevComponents => {
        const exists = prevComponents.some(component => component.code === code);
      
        if (exists && !showExplanation) {
          // Remove component if it already exists
          const updatedComponents = prevComponents.filter(component => component.code !== code);
      
          // Focus on the last textarea after removal (if any remain)
          setTimeout(() => {
            if (updatedComponents.length > 0) {
              textareaRefs.current[updatedComponents.length - 1]?.focus();
            }
          }, 0); // Ensuring it runs after the state update
          setCurrentComponent(mapComponents[mapComponents.length-1].code)
          return updatedComponents;
        } else if (exists && showExplanation) {
          return prevComponents;
        } else {
          // Add new component with default values
          const newComponent = { code, label, paragraph, type, text: "" };
          const updatedComponents = [...prevComponents, newComponent];
      
          // Focus the last added textarea
          setTimeout(() => {
            textareaRefs.current[updatedComponents.length - 1]?.focus();
          }, 0); // Ensuring it runs after the state update
          setCurrentComponent(code)
      
          return updatedComponents;
        }
      });
      
      setLimitExceeded(false);
    } else {
      setLimitExceeded(true);
    }
    setShowExplanation(false);
  };

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Enter') return;

    if(showExplanation)
      setShowExplanation(false);
  }, [firstClick, setShowExplanation, showExplanation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update form state
  const handleProjectNameChange = (e) => {
    setMapProjectName(e.target.value);
  };

  // Update individual component text field
  const handleComponentChange = (e, index) => {
    if(e.target.value.length < 130) {
      let updatedComponents = [...mapComponents];
      updatedComponents[index] = { ...updatedComponents[index], text: e.target.value };
      setMapComponents(updatedComponents);
    }
  };

  const handleFocus = (code) => {
    setCurrentComponent(code); // Update the currentComponent state with the code of the focused textarea
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`; // Return as "r, g, b"
  };

  // PDF Generation Functions
  const handleDownloadPDF = async () => {
    console.log(mapComponents);
    const pageWidth = 297; // mm
    const pageHeight = (9 / 16) * pageWidth; // mm for 16:9

    const pages = [
      async (pdf) => {
        // Loading Fonts
        pdf.addFileToVFS('Manrope-Medium.ttf', encodedFonts['Manrope-500']);
        pdf.addFont('Manrope-Medium.ttf', 'Manrope', 'medium');
        pdf.addFileToVFS('Manrope-SemiBold.ttf', encodedFonts['Manrope-600']);
        pdf.addFont('Manrope-SemiBold.ttf', 'Manrope', 'semi-bold');
        pdf.addFileToVFS('Manrope-Bold.ttf', encodedFonts['Manrope-700']);
        pdf.addFont('Manrope-Bold.ttf', 'Manrope', 'bold');

        // Cover Page
        pdf.addImage(coverImage, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.setFont("Manrope", "semi-bold");
        pdf.setTextColor("white");
        pdf.setFontSize(55);
        pdf.text(mapProjectName, 15, 40);
      },
      async (pdf) => {
        // All Page
        let text;
        if(language === "pt")
          text = 'Os aspetos/potencial de Literacia Oceânica do teu projeto que consegui captar inicialmente.';
        else
          text = 'The OL aspects/potential of your project that I could initially capture';

        await addTaskPage(pdf, text, 'All'); 
      },
      async (pdf) => {
        // Principles
        let text;
        if(language === "pt")
          text = 'Os aspetos/potencial de Literacia Oceânica do seu projeto > PRINCÍPIOS em foco';
        else
          text = 'The OL aspects/potential of your project > PRINCIPLES focus';

        await addTaskPage(pdf, text, 'Principle'); 
      },
      async (pdf) => {
        // Perspectives
        let text;
        if(language === "pt")
          text = 'Os aspetos/potencial de Literacia Oceânica do seu projeto > PERSPECTIVAS em foco';
        else
          text = 'The OL aspects/potential of your project > PERSPECTIVES focus';

        await addTaskPage(pdf, text, 'Perspective'); 
      },
      async (pdf) => {
        // Dimensions
        let text;
        if(language === "pt")
          text = 'Os aspetos/potencial de Literacia Oceânica do seu projeto > DIMENSÕES em foco';
        else
          text = 'The OL aspects/potential of your project > DIMENSIONS focus';
        
        await addTaskPage(pdf, text, 'Dimension'); 
      },
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
      if (mapProjectName.length !== 0) 
        link.download = `Visual_Report_${mapProjectName.replace(/ /g, "_")}.pdf`;
      else 
        link.download = `Visual_Report.pdf`;
      link.click();

      setIsGenerating(false);
      setDownloadProgress(0); // Reset progress once done
    } catch (error) {
      setIsGenerating('Error');
      setDownloadProgress(0); // Reset progress once done
    } 
};

  const addTaskPage = async(pdf, text, type) => {
    // Loading Fonts
    pdf.addFileToVFS('Manrope-Medium.ttf', encodedFonts['Manrope-500']);
    pdf.addFont('Manrope-Medium.ttf', 'Manrope', 'medium');
    pdf.addFileToVFS('Manrope-SemiBold.ttf', encodedFonts['Manrope-600']);
    pdf.addFont('Manrope-SemiBold.ttf', 'Manrope', 'semi-bold');
    pdf.addFileToVFS('Manrope-Bold.ttf', encodedFonts['Manrope-700']);
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
    let parts 
    if(language === "pt") parts = text.split(' em foco');
    else parts = text.split(' focus');
    const mainText = parts[0].trim();
    const highlightText = mainText.split(' ').pop();  // Get the last word (to highlight)
    const remainingText = language === "pt" ? 'em foco' : 'focus';

    pdf.setFont('Manrope', 'medium');
    pdf.setFontSize(12);
    pdf.setTextColor("#0a4461");

    let currentText;
    if(type === 'All') {
      currentText = text;
      pdf.text(currentText, 16, 151);
    } else {
      currentText = mainText.replace(highlightText, '').trim();
      
      pdf.text(currentText, 16, 151);

      // Set the highlight color for the key part (the word to be highlighted)
      pdf.setFont('Manrope', 'bold');
      pdf.setTextColor(colors['Wave'][type]);

      let padding;
      if(language === "pt") padding = 137
      else padding = 101;
      pdf.text(highlightText, padding, 151);

      // Set the default color again for the 'focus' part
      if(type === 'Principle') {
        if(language === "pt") padding += 25.5; 
        else padding += 25.5; 
      } else if(type === 'Perspective') {
        if(language === "pt") padding += 33; 
        else padding += 32; 
      } else if(type === 'Dimension') {
        if(language === "pt") padding += 26.5; 
        else padding += 27.5; 
      }

      pdf.setFont('Manrope', 'medium');
      pdf.setTextColor("#0a4461");
      pdf.text(remainingText, padding, 151);
    }

    // Big Wave
    let x;
    if(type === "All") 
      x = 83;
    else
      x = 145;    ;
    await renderToCanvas(
      <State>
        <Compass
          className='m2-ol-compass'
          mode="map-2-pdf"
          currentType={type}
          stateSaved={mapComponents.map(component => component.code)}
        />
      </State>,
        pdf, x, 12, 0.9
    );
    
    if(type === 'All')
      await addTextareas(pdf);
    else
      await addIconAndDefinitions(pdf, type);
  };

  
  const addTextareas = async(pdf) => {
    // Textareas

    let componentsTextareas = mapComponents.filter(
      (component, id) => id <= mapComponents.length / 2 - 1 && component.text.length !== 0
    );
    // First section for the first 5 components
    if (componentsTextareas.length > 0) {
      await renderToCanvas(
        <>
          {mapComponents.map((component, id) => (
            (id <= Math.ceil(mapComponents.length)/2 && component.text.length !== 0) && (
              <div
                key={id} 
                className="m2-components-textarea-pdf"
                style={{
                  '--text-color': colors['Text'][component.type], // Define CSS variable
                }}
              >
                <div className='m2-textarea-label-pdf'>
                  {component.label}
                </div>

                <div
                  className="m2-component-textarea-pdf"
                  style={{
                    '--text-color': colors['Text'][component.type], // Define CSS variable
                    backgroundColor: `rgba(${hexToRgb(colors['Wave'][component.type])}, 0.3)`,
                  }}
                >
                  {component.text}
                </div>
              </div>
            )
          ))}
        </>,
        pdf, 17, 15, 0.9
      );
    }

    componentsTextareas = mapComponents.filter(
      (component, id) => id > mapComponents.length / 2 - 1 && component.text.length !== 0
    );
    // Second section for the first 5 components
    if (componentsTextareas.length > 0) {
      await renderToCanvas(
        <>
          {mapComponents.map((component, id) => (
            (id > Math.ceil(mapComponents.length)/2 && component.text.length !== 0) && (
              <div
                key={id} 
                className="m2-components-textarea-pdf"
                style={{
                  '--text-color': colors['Text'][component.type], // Define CSS variable
                }}
              >
                <div className='m2-textarea-label-pdf'>
                  {component.label}
                </div>

                <div
                  className="m2-component-textarea-pdf"
                  style={{
                    '--text-color': colors['Text'][component.type], // Define CSS variable
                    backgroundColor: `rgba(${hexToRgb(colors['Wave'][component.type])}, 0.3)`,
                  }}
                >
                  {component.text}
                </div>
              </div>
            )
          ))}
        </>,
        pdf, 222, 15, 0.9
      );
    } 
  };

  const addIconAndDefinitions = async(pdf, type) => {
    // Compass Icon
    await renderToCanvas(
      <State>
        <CompassIcon 
          mode="map" 
          currentType={type} />
      </State>,
      pdf, 18, 4, 1.1
    );

    // Definitions
    if(mapComponents.filter((component) => component.type === type).length === 0)
      return;
    await renderToCanvas(
      <>
        {mapComponents
          .filter((component) => component.type === type) // Filter by the specific type
          .map((component, index) => (
            <div key={index} className='m2-definition'>
              <p className='m2-definition-title' 
                style={{
                  color: `${colors['Label'][type]}`,
                  background: `linear-gradient(
                    to right, 
                    ${colors['Wave'][type]} 5%, 
                    white 60%
                  )`,
                }}>
                {component.label}
              </p>
              <p className='m2-definition-text'>
                {component.paragraph}
              </p>
            </div>
        ))}
          <div className="m2-definitions-top-lines">
            <div className="m2-definitions-horizontal-line"
              style={{
                background: `${colors['Intro Text'][type]}`,
              }}>
          </div>
          <div className="m2-definitions-vertical-line"
            style={{
              background: `linear-gradient(
                to bottom, 
                ${colors['Intro Text'][type]} 60px, 
                white 59px 100%
              )`,
            }}>
          </div>
        </div>
      </>,
      pdf, 23, 53, 1.1
    );
  };

  const renderToCanvas = async(html, pdf, x, y, resizeFactor) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(html);
    
    const scale = 5; // max = 10

    // Wait for the next frame to ensure the component is fully rendered
    await new Promise((resolve) => setTimeout(resolve, 0));

    const canvas = await html2canvas(container, { scale: scale, logging: true, backgroundColor: null });
    root.unmount(); // Clean up the root

    const imgData = canvas.toDataURL('image/png');

    // Original dimensions of the captured canvas
    let imgWidth, imgHeight;
    imgWidth = canvas.width / scale; // In pixels
    imgHeight = canvas.height / scale; // In pixels

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
      <Compass
        mode="map-2"
        position="fixed"
        resetState={resetState}
        onButtonClick={handleCompassClick}
        currentComponent={currentComponent}
        stateSaved={mapComponents.map(component => component.code)}
      />
      {showExplanation && 
        <Description mode="map" />
      }

      {!showExplanation && (
        <>
          <div className='m2-text-container'>
            <textarea
                className="m2-project-name-textarea" 
                type="text" 
                placeholder={language === "pt" ? "Insere o título do mapa" : "Insert map title"}
                value={mapProjectName} 
                onChange={handleProjectNameChange}
                spellCheck="false"
                disabled={window.innerWidth > 1300 ? false : true}
            ></textarea>
          </div>
          
          {/* First section for the first 5 components */}
          <div className="m2-components-textarea-container right">
            {Array.from({ length: 4 }).map((_, id) => {
              const component = mapComponents[id]; // Get the corresponding component if it exists
              return (
                <div
                  key={id}
                  className="m2-components-textarea"
                  style={{
                    '--text-color': component ? colors['Text'][component.type] : 'transparent',
                  }}
                >
                  {component ? (
                    <>
                      {component.text.length !== 0 && (
                        <div className='m2-textarea-label'>
                          {component.label}
                        </div>
                      )}
                      <textarea
                        className="m2-component-textarea"
                        ref={(el) => (textareaRefs.current[id] = el)}
                        style={{
                          '--text-color': colors['Text'][component.type],
                          backgroundColor: `rgba(${hexToRgb(colors['Wave'][component.type])}, 0.3)`,
                        }}
                        type="text"
                        placeholder={
                          language === 'pt'
                            ? `Por que é que o teu projeto tem ${component.label}?`
                            : `Why does your project have ${component.label}?`
                        }
                        value={component.text}
                        onFocus={() => handleFocus(component.code)}
                        onChange={(e) => handleComponentChange(e, id)}
                        spellCheck="false"
                        disabled={window.innerWidth > 1300 ? false : true}
                      />
                    </>
                  ) : (
                    <div className="m2-empty-card"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Second section for components with id > 4 */}
          <div className="m2-components-textarea-container">
            {Array.from({ length: 4 }).map((_, id) => {
              const component = mapComponents[id+4]; // Get the corresponding component if it exists
              return (
                <div
                  key={id}
                  className="m2-components-textarea"
                  style={{
                    '--text-color': component ? colors['Text'][component.type] : 'transparent',
                  }}
                >
                  {component ? (
                    <>
                      {component.text.length !== 0 && (
                        <div className='m2-textarea-label'>
                          {component.label}
                        </div>
                      )}
                      <textarea
                        className="m2-component-textarea"
                        ref={(el) => (textareaRefs.current[id] = el)}
                        style={{
                          '--text-color': colors['Text'][component.type],
                          backgroundColor: `rgba(${hexToRgb(colors['Wave'][component.type])}, 0.3)`,
                        }}
                        type="text"
                        placeholder={
                          language === 'pt'
                            ? `Por que é que o teu projeto tem ${component.label}?`
                            : `Why does your project have ${component.label}?`
                        }
                        value={component.text}
                        onFocus={() => handleFocus(component.code)}
                        onChange={(e) => handleComponentChange(e, id)}
                        spellCheck="false"
                        disabled={window.innerWidth > 1300 ? false : true}
                      />
                    </>
                  ) : (
                    <div className="m2-empty-card"></div>
                  )}
                </div>
              );
            })}
          </div>

          {mapComponents.length > 0 &&
            <>
              <button 
              className={`m2-download-pdf-button ${isGenerating === true ? 'no-hover' : 'hover'}`}
              onClick={handleDownloadPDF}
              disabled={isGenerating === true} // Disable the button while generating
              style={{
                  background: isGenerating === true 
                      ? `linear-gradient(to right, ${colors['Gray']} ${downloadProgress}%, white ${downloadProgress}%)`
                      : 'white', // Change background to show progress
                  color: isGenerating === true 
                      ? 'transparent'
                      : '', // Change background to show progress
              }}
              >
                {isGenerating !== 'Error' 
                ? (language === 'pt' 
                    ? 'Baixar Relatório Visual' 
                    : 'DONE! DOWNLOAD VISUAL REPORT') 
                : (language === 'pt' 
                    ? 'Tente Novamente' 
                    : 'Try again')}
              </button>

              <p className='m2-download-progress' style={{
                color: isGenerating === 'Error' 
                  ? 'red' 
                  : isGenerating 
                  ? `${colors['Gray']}` 
                  : 'transparent', // Change text color based on isGenerating state
              }}>
                {isGenerating === 'Error' 
                ? (language === 'pt' 
                    ? 'Erro ao Gerar PDF :(' 
                    : 'Error Generating PDF :(') 
                : `${Math.round(downloadProgress)}% ${language === 'pt' ? 'Completo' : 'Complete'}`}
              </p> 
            </>
          }

          {limitExceeded &&
            <div className='m2-limit-exceed-message'>
              {language === 'pt' 
              ? 'Máximo de 8 elementos!' 
              : 'Maximum 8 elements!'}
            </div>
          }
        </>
      )}
      <Menu />
    </>
  );
};

export default Map2Page;
