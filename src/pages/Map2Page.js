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
import PDFPage1 from '../assets/images/map/pdf-page-1.png';
import PDFPage2 from '../assets/images/map/pdf-page-2.png';
import PDFPage8 from '../assets/images/map/pdf-page-8.png';
import PDFPage9 from '../assets/images/map/pdf-page-9.png';
import PDFWatermark from '../assets/images/map/pdf-watermark-pagesize.png';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { getLabelsTexts, getModeTexts } from '../utils/DataExtraction.js';
import { replaceHighlightsPlaceholders, replaceBolds } from '../utils/TextFormatting.js';
import '../styles/pages/Map2Page.css';

const Map2Page = () => {
  const {
    colors,
    language,
    showExplanation,
    setShowExplanation,
    showInstruction,
    setShowInstruction,
    mapComponents,
    setMapComponents,
    mapProjectName,
    setMapProjectName,
    setFirstUse,
    iconsMap,
    mapCurrentType,
    setMapCurrentType,
    typeComplete,
    setTypeComplete
  } = useContext(StateContext);

  const labelsTexts = getLabelsTexts(language, "map");
  const compassTexts = getLabelsTexts(language, "compass");
  const instruction = getModeTexts("map", language).Instruction;
  
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [currentComponent, setCurrentComponent] = useState();
  const [downloadProgress, setDownloadProgress] = useState(0); // State to trigger re-renders
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const componentsRef = useRef(mapComponents);
  const textareaRefs = useRef([]); // Initialize refs for textareas

  useEffect(() => {
    componentsRef.current = mapComponents; // Keep the ref in sync with the latest state
  }, [mapComponents]);
  
  useEffect(() => {
    if(isGenerating)
      setCurrentComponent();
  }, [isGenerating]);

  useEffect(() => {
    const principles = mapComponents.filter(component => component.type === 'Principle');
    const perspectives = mapComponents.filter(component => component.type === 'Perspective');
    const dimensions = mapComponents.filter(component => component.type === 'Dimension');

    // Update typeComplete['Principle'] only if all principles have text
    if (principles.length > 0 && principles.every(principle => principle.text.length > 0)) {
      console.log(principles);
      setTypeComplete(prevState => ({
        ...prevState,
        Principle: true, // Set to true if all Principles have text
      }));
    }
  }, [mapComponents, setTypeComplete]);


  useEffect(() => {
    if(mapComponents.length === 0) {
      setCurrentComponent();
      setShowInstruction(true);
    } else {
      setShowInstruction(false);
      setFirstUse(prevState => ({
        ...prevState, // Keep all existing attributes
        "map": false   // Update only 'home'
      }));
    }
  }, [mapComponents, setShowInstruction]);

  // Reset state and UI elements
  const resetState = useCallback(() => {
    navigate('/home');
  }, [navigate]);

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
      setTypeComplete(prevState => ({
        ...prevState,
        [type]: false, // Set to true if all Principles have text
      }));
      setLimitExceeded(false);
    } else {
      setLimitExceeded(true);
    }
    setShowExplanation(false);
  };

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
  const findComponentByType = (index, type) => {
    // Filter components that match the given type
    const filteredComponents = mapComponents.filter(component => component.type === type);
  
    // Return the first or second matching component, if it exists
    return filteredComponents[index] || null;
  };  

  // PDF Generation Functions
  const handleDownloadPDF = async () => {
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
        pdf.addFileToVFS('Bitter-SemiBold.ttf', encodedFonts['Bitter-600']);
        pdf.addFont('Bitter-SemiBold.ttf', 'Bitter', 'semi-bold');
        pdf.addFileToVFS('Bitter-Medium.ttf', encodedFonts['Bitter-500']);
        pdf.addFont('Bitter-Medium.ttf', 'Bitter', 'medium');

        // Page 1
        pdf.addImage(PDFPage1, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.setFont("Bitter", "semi-bold");
        pdf.setTextColor("white");
        pdf.setFontSize(49);
        pdf.text(mapProjectName, 15.5, 38);
      }, 
      async (pdf) => {
        // Page 2
        pdf.addImage(PDFPage2, "PNG", 0, 0, pageWidth, pageHeight);
      }, 
      async (pdf) => {
        // All Page
        let text = labelsTexts["overview"];

        await addTaskPage(pdf, text, 'All'); 
      },
      async (pdf) => {
        // Principles
        let text = compassTexts["Principle"];

        await addTaskPage(pdf, text, 'Principle'); 
      },
      async (pdf) => {
        // Perspectives
        let text = compassTexts["Perspective"];

        await addTaskPage(pdf, text, 'Perspective'); 
      },
      async (pdf) => {
        // Dimensions
        let text = compassTexts["Dimension"];
        
        await addTaskPage(pdf, text, 'Dimension'); 
      },
      async (pdf) => {
        // All Page
        let text = labelsTexts["recap"];

        await addTaskPage(pdf, text, 'All'); 
      },
      async (pdf) => {
        // Page 8
        pdf.addImage(PDFPage8, "PNG", 0, 0, pageWidth, pageHeight);
      }, 
      async (pdf) => {
        // Page 9
        pdf.addImage(PDFPage9, "PNG", 0, 0, pageWidth, pageHeight);
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

        // Update progress after generating each page
        setDownloadProgress(((i + 1) / pages.length) * 100); // Direct progress update
      }

      // Merge all individual PDFs
      const mergedPdf = await mergePDFChunks(pdfBlobs);
      setDownloadProgress(100); // Complete progress

      // Save the final merged PDF
      const fileName = mapProjectName.length !== 0 ? 
        `Visual_Report_${mapProjectName.replace(/ /g, "_")}.pdf` : 
        `Visual_Report.pdf`;

      // Using FileSaver.js to trigger the download in a more reliable way
      saveAs(mergedPdf, fileName);

      setIsGenerating(false);
      setDownloadProgress(0); // Reset progress once done
    } catch (error) {
      setIsGenerating('Error');
      setDownloadProgress(0); // Reset progress once done
    } 
};

  const addTaskPage = async(pdf, text, type) => {
    pdf.addFileToVFS('Manrope-Bold.ttf', encodedFonts['Manrope-700']);
    pdf.addFont('Manrope-Bold.ttf', 'Manrope', 'bold');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Margin
    pdf.setFillColor('#dfe9e9'); // RGB for green
    pdf.rect(0, 0, pageWidth, pageHeight, 'F'); // Draw a filled rectangle covering the entire page

    const rectWidth = pageWidth - 16.5;  // Width of the rectangle
    const rectHeight = pageHeight - 16.5; // Height of the rectangle
    const rectX = (pageWidth - rectWidth) / 2;  // Centered X position
    const rectY = (pageHeight - rectHeight) / 2; // Centered Y position
    const borderRadius = 3; // Radius of the rounded corners
            
    pdf.setFillColor('white'); // RGB for green
    pdf.roundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius, borderRadius, 'F'); // Draw a filled rectangle covering the entire page

    // Text
    pdf.setFont('Manrope', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor("#0a4461");
    // Calculate text width
    const textWidth = pdf.getTextWidth(text);

    // Centering the text
    const textX = (pageWidth - textWidth) / 2; // Center horizontally

    // Add text to the PDF
    pdf.text(text, textX, 152);

    // Compass
    await renderToCanvas(
      <State>
        <Compass
          className='m2-ol-compass'
          mode="map-2-pdf"
          currentType={type}
          stateSaved={mapComponents.map(component => component.code)}
        />
      </State>,
        pdf, 87.4, 19, 0.83
    );
    
    if(text === 'RECAP')
      await addTextareas(pdf);
    else if(text !== 'OVERVIEW')
      await addIconDefinitionsTextareas(pdf, type);

    pdf.addImage(PDFWatermark, "PNG", 0, 0, pageWidth, pageHeight);
  };

  const addTextareas = async(pdf) => {
    // First section for the first 5 components
    if (mapComponents.length > 0) {
      await renderToCanvas(
        <>
          {mapComponents.map((component, id) => (
            (id % 2 === 0) && (
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
        pdf, 27.5, 23, 0.9
      );
    }

    // Second section for the first 5 components
    if (mapComponents.length > 1) {
      await renderToCanvas(
        <>
          {mapComponents.map((component, id) => (
            (id % 2 !== 0) && (
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
        pdf, 223, 23, 0.9
      );
    } 
  };

  const addIconDefinitionsTextareas = async(pdf, type) => {
    // Compass Icon
    await renderToCanvas(
      <State>
        <CompassIcon 
          mode="map" 
          currentType={type} />
      </State>,
      pdf, 12, 8, 1.1
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
                  backgroundColor: `rgba(${hexToRgb(colors['Wave'][type])}, 0.3)`,
                }}>
                {`${component.code} - ${component.label}`}
              </p>
              <p className='m2-definition-text'>
                {component.paragraph}
              </p>
            </div>
        ))}
      </>,
      pdf, 27.5, 53, 1.1
    );

    // Textareas
    await renderToCanvas(
      <>
        {mapComponents
          .filter((component) => component.type === type) // Filter by the specific type
          .map((component, index) => (
            <div
              key={index} 
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
        ))}
      </>,
      pdf, 223, 23, 0.9
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
    await new Promise((resolve) => setTimeout(resolve, 100));

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
        currentType={mapCurrentType}
        stateSaved={mapComponents.map(component => component.code)}
      />
      {showExplanation && 
        <Description mode="map" />
      }

      
      {showInstruction && 
        <div className='instruction-container'>
          {replaceHighlightsPlaceholders(instruction, 'instruction', 'instruction highlightP', 'instruction highlightPe', 'instruction highlightD', iconsMap)}
        </div>
      }

      {!showExplanation && mapComponents.length > 0 && (
        <>
          <div className='m2-text-container'>
            <textarea
                className="m2-project-name-textarea" 
                type="text" 
                placeholder={labelsTexts["inster-map-title"]}
                value={mapProjectName} 
                onChange={handleProjectNameChange}
                spellCheck="false"
                disabled={window.innerWidth > 1300 ? false : true}
            ></textarea>
          </div>
          <div className='m2-text-below-container'>
            <div className='m2-project-name-text-below'>
              {labelsTexts["text-below"]}
            </div>
          </div>
          <div className='m2-what-buttons-container'>
            <button 
              className={`m2-what-button ${mapCurrentType === 'Principle' ? "active" : ""}`}
              style={{
                '--text-color': colors['Text'][mapCurrentType],
                '--background-color': colors['Wave'][mapCurrentType],
              }}
            >
              {labelsTexts["what"]}
            </button>
            <button 
              className={`m2-what-button ${mapCurrentType === 'Perspective' ? "active" : ""} ${typeComplete['Principle'] ? "" : "disabled"}`}
              style={{
                '--text-color': colors['Text'][mapCurrentType],
                '--background-color': colors['Wave'][mapCurrentType],
              }}
            >
              {labelsTexts["from-what-angle"]}
            </button>
            <button 
              className={`m2-what-button ${mapCurrentType === 'Dimension' ? "active" : ""}  ${typeComplete['Perspective'] ? "" : "disabled"}`}
              style={{
                '--text-color': colors['Text'][mapCurrentType],
                '--background-color': colors['Wave'][mapCurrentType],
              }}
            >
              {labelsTexts["how"]}
            </button>
          </div>
          <div className='m2-step-text-container'>
            <div className='m2-step-text'>
              {labelsTexts["step"]} 1
            </div>
              {replaceBolds(
                labelsTexts["what-principles"], 
                null, 'm2-what-components', 'm2-what-components bold')}
          </div>

          {/* Principles */}
          <div className="m2-components-textarea-container">
            <div className="m2-components-textarea-row">
              {Array.from({ length: 2 }).map((_, id) => {
                const component = findComponentByType(id, 'Principle'); // Get the corresponding component if it exists
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
            <div className="m2-components-textarea-row">
              {Array.from({ length: 2 }).map((_, id) => {
                const component = findComponentByType(id, 'Perspective'); // Get the corresponding component if it exists
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
                          ref={(el) => (textareaRefs.current[id+2] = el)}
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
                          onChange={(e) => handleComponentChange(e, id+2)}
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
            <div className="m2-components-textarea-row">
              {Array.from({ length: 2 }).map((_, id) => {
                const component = findComponentByType(id, 'Dimension'); // Get the corresponding component if it exists
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
                          ref={(el) => (textareaRefs.current[id+4] = el)}
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
                          onChange={(e) => handleComponentChange(e, id+4)}
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
          </div>

          {mapComponents.length > 0 &&
            <>
              <button 
              className={`m2-download-pdf-button ${isGenerating === true ? 'no-hover' : ''}`}
              onClick={handleDownloadPDF}
              disabled={isGenerating === true} // Disable the button while generating
              style={{
                  background: isGenerating === true 
                      ? `linear-gradient(to right, black ${downloadProgress}%, white ${downloadProgress}%)`
                      : 'white', // Change background to show progress
                  color: isGenerating === true 
                      ? 'transparent'
                      : '', // Change background to show progress
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) e.target.style.backgroundColor = 'white';
              }}
              >
                {isGenerating !== 'Error' 
                ? labelsTexts["download-visual-report"]
                : labelsTexts["try-again"]}
              </button>

              <p className='m2-download-progress' style={{
                color: isGenerating === 'Error' 
                  ? 'red' 
                  : isGenerating 
                  ? 'black'
                  : 'transparent', // Change text color based on isGenerating state
              }}>
                {isGenerating === 'Error' 
                ? labelsTexts["error-generating-pdf"]
                : `${Math.round(downloadProgress)}% ${language === 'pt' ? 'Completo' : 'Complete'}`}
              </p> 
            </>
          }

          {limitExceeded &&
            <div className='m2-limit-exceed-message'>
              {labelsTexts["max-6-elements"]}
            </div>
          }
        </>
      )}
      <Menu />
    </>
  );
};

export default Map2Page;
