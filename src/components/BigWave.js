import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { getGetStartedData } from '../utils/Data.js'; 
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { StateContext } from "../State";
import Draggable from "react-draggable";

// Sizes and positions 
let size;

if(window.innerHeight > 700) 
  size = 490;
else
  size = 460;

const waveWidth = size/2.6;
const waveHeight = waveWidth*3;

// SVG Path for button shape
const svgPath = "m82.54,14.01c-.44.31-.88.61-1.32.92-.54.38-1.09.77-1.63,1.16-.34.24-.69.48-1.03.72-.55.39-1.1.78-1.65,1.17-.55.38-1.09.76-1.64,1.15-.47.33-.93.66-1.4.99-.43.3-.86.6-1.29.9-.44.31-.89.62-1.34.93-.26.18-.51.35-.77.52-.29.19-.58.38-.88.56-.26.15-.52.29-.78.43-.36.19-.71.4-1.07.58-.62.3-1.24.59-1.87.86-.59.25-1.19.49-1.79.69-.95.31-1.91.63-2.9.83-.37.08-.74.18-1.12.25-.28.06-.57.09-.85.14-.38.06-.77.14-1.15.18-1.17.13-2.35.21-3.53.21-.19,0-.38,0-.57,0-.3,0-.6-.03-.9-.04-.37-.02-.74-.02-1.11-.05-.59-.06-1.18-.13-1.76-.22-.9-.14-1.79-.29-2.67-.52-.55-.14-1.1-.28-1.64-.44-.4-.12-.79-.26-1.19-.4-.34-.12-.68-.22-1.01-.36-.44-.19-.87-.38-1.31-.57-.41-.18-.82-.36-1.23-.54-.62-.27-1.23-.56-1.84-.84-.61-.28-1.21-.56-1.82-.85-.62-.29-1.24-.57-1.85-.85-.6-.28-1.2-.56-1.8-.84-.62-.29-1.25-.57-1.87-.86-.6-.28-1.19-.55-1.79-.83-.61-.28-1.22-.56-1.82-.84-.61-.28-1.21-.57-1.82-.85-.61-.28-1.23-.56-1.84-.84-.62-.28-1.23-.57-1.85-.86-.48-.22-.95-.44-1.43-.65-.36-.16-.73-.3-1.09-.44-.29-.11-.58-.21-.88-.31-.26-.09-.51-.19-.78-.27-.56-.16-1.13-.32-1.7-.45-.45-.11-.9-.19-1.35-.28-.37-.07-.75-.15-1.12-.21-.28-.05-.57-.07-.85-.11-.31-.04-.63-.09-.94-.11-.46-.04-.93-.06-1.39-.08-.34-.02-.68-.02-1.02-.03-.18,0-.36,0-.54,0-.38,0-.75-.01-1.13,0-.61.03-1.22.07-1.83.14-.63.07-1.25.18-1.88.27-.2.03-.4.07-.6.12-.3.06-.6.13-.89.2-.33.07-.65.14-.98.23-.59.16-1.17.35-1.75.51-.27.08-.52-.04-.63-.27-.12-.24-.06-.5.17-.67.29-.21.59-.42.89-.63.34-.24.68-.47,1.01-.7.47-.33.93-.66,1.4-.99.34-.24.68-.47,1.01-.7.55-.39,1.1-.78,1.65-1.17.55-.38,1.09-.76,1.64-1.15.55-.38,1.09-.77,1.63-1.16.55-.39,1.1-.78,1.65-1.16.65-.44,1.29-.88,1.96-1.29.65-.39,1.32-.75,1.99-1.09.55-.28,1.1-.55,1.67-.79,1.36-.56,2.74-1.05,4.16-1.41.55-.14,1.09-.29,1.64-.38,1.04-.18,2.09-.39,3.19-.43.38-.03.81-.1,1.24-.11.79-.01,1.59-.06,2.39,0,.46.03.93.03,1.4.08.64.06,1.27.12,1.9.22.89.14,1.78.29,2.65.53.57.15,1.15.29,1.71.47.75.24,1.49.51,2.23.79.39.15.77.32,1.16.48.1.05.21.09.32.13.63.28,1.26.58,1.89.87.59.27,1.17.54,1.76.81.62.29,1.24.57,1.85.86.52.24,1.03.47,1.55.71.61.28,1.21.57,1.82.85.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.46.22.92.46,1.38.66.63.28,1.26.55,1.89.81.32.13.65.23.98.34.38.13.76.29,1.15.4.62.18,1.24.34,1.86.49.39.1.78.16,1.17.24.3.06.6.13.91.18.54.08,1.09.14,1.63.2.15.02.3.04.44.05.37.02.75.04,1.13.06.26.02.52.04.79.05.42,0,.85-.02,1.27-.01.6,0,1.21-.04,1.81-.09.49-.04.99-.1,1.48-.16.82-.11,1.64-.22,2.45-.43.37-.09.75-.15,1.12-.25.64-.17,1.28-.37,1.93-.55.04-.01.09-.02.14-.02.24.02.42.16.48.37.06.23-.01.45-.22.6Z";
const svgTextPath = "m119.67,8.06c-7.54,3.59-12.67,7.32-27.44,8.01-16.45.77-25.71-4.5-32.34-7.85-7.56-3.55-12.7-7.29-27.47-7.91C15.97-.38,6.73,4.93.11,8.31";
const svgTextPathInverted = "m119.67,8.31c-6.61-3.38-15.85-8.69-32.31-8-14.77.62-19.91,4.36-27.47,7.91-6.63,3.35-15.89,8.62-32.34,7.85C12.78,15.39,7.65,11.65.11,8.06";

const bigLabels = ['P6', 'D10'];

const BigWave = ({ mode, onDragStop, resetState, pdfComponents, stopTextAreaFocus }) => {
  const {
    colors,
    isExplanationPage,
    allComponents,
    opacityCounter,
  } = useContext(StateContext);
  
  // Dictionary with all information
  let componentsData = getGetStartedData();

  const principles = getComponentsPositions(componentsData['Principle'], 'Principle');
  const perspectives = getComponentsPositions(componentsData['Perspective'], 'Perspective');
  const dimensions = getComponentsPositions(componentsData['Dimension'], 'Dimension');
  const initialComponents = principles.concat(perspectives, dimensions);
 
  const [components, setComponents] = useState(pdfComponents || initialComponents);
  
  let pdfSelectedComponents;
  if(pdfComponents)
    pdfSelectedComponents = pdfComponents.map((component) => component.code);
  // Determine which components and setter to use based on mode
  const [selectedComponents, setSelectedComponents] = useState(pdfSelectedComponents || []);

  const [showSquare, setShowSquare] = useState(false);
  const [activeId, setActiveId] = useState(null); // Track the active clicked component ID

  const selectedComponentsRef = useRef(selectedComponents);
  const activeIdRef = useRef(activeId);
  const nodeRef = useRef(null);
  const initialComponentsRef = useRef(initialComponents);
  const textareaRefs = useRef({}); // Store refs dynamically for all textareas
  const waveRefs = useRef({});   // Store refs dynamically for all circles
  const compassRef = useRef({});

  useEffect(() => {
      activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    selectedComponentsRef.current = selectedComponents;
  }, [selectedComponents]);

  useEffect(() => {
    if (!isExplanationPage) {
        setShowSquare(true);
    }
  }, [isExplanationPage]);

   // Update the ref whenever originalComponents changes
   useEffect(() => {
    initialComponentsRef.current = initialComponents;
  }, [initialComponents]);

  useEffect(() => {
    setComponents((prevComponents) =>
        prevComponents.map((component) => ({
          ...component,
          initialX: isExplanationPage ? component.x : component.x-window.innerWidth/2.94+window.innerWidth/11.1,
          x: isExplanationPage ? component.x : component.x-window.innerWidth/2.94+window.innerWidth/11.1,
        }))
      );
  }, [isExplanationPage]);

  const handleDragStart = (id) => {
    let newAngle;

    if(components[id].type === "Principle") {
        if(isFlipped(components[id].code))
            newAngle = -0.0273*Math.PI;
        else
            newAngle = -Math.PI-0.0273*Math.PI;
    } else {
        if(isFlipped(components[id].code))
            newAngle = 0.0273*Math.PI;
        else
            newAngle = -Math.PI+0.0273*Math.PI;
    }

    setComponents((prevComponents) => {
        const updatedComponents = [...prevComponents];
        updatedComponents[id].angle = newAngle;

        return updatedComponents;
    });
  };

  const handleDragStop = (id, data) => {
    let textAreaX, textAreaY, arrowX1, arrowY1, arrowX2, arrowY2, topTip, rightTip;
    let waveRect = waveRefs.current[id].getBoundingClientRect();
   
    setComponents((prevComponents) => {
        const updatedComponents = [...prevComponents];
        updatedComponents[id].x = data.x;
        updatedComponents[id].y = data.y;

        return updatedComponents;
    });
    // Initialization if doesn't exist already
    if(!selectedComponentsRef.current.includes(components[id].code)) {
        topTip = components[id].topTip;
        rightTip = components[id].rightTip;
        setComponents((prevComponents) => {
            const updatedComponents = [...prevComponents];
            textAreaX = data.x + 100;
            textAreaY = data.y + 175;
            arrowX1 = waveRect.left + waveRect.width / 2 + waveWidth / 3;

            if(components[id].type === 'Principle')
              arrowY1 = waveRect.top + waveRect.height / 2 - waveHeight * 0.02;
            else
              arrowY1 = waveRect.top + waveRect.height / 2 + waveHeight * 0.02;

            arrowX2 = data.x + 130;
            arrowY2 = data.y + 207 + updatedComponents[id].textGapY2;

            updatedComponents[id].textAreaX = textAreaX;
            updatedComponents[id].textAreaY = textAreaY;
            updatedComponents[id].arrowX1 = arrowX1;
            updatedComponents[id].arrowY1 = arrowY1;
            updatedComponents[id].arrowX2 = arrowX2;
            updatedComponents[id].arrowY2 = arrowY2;

            return updatedComponents;
        });
        
        setSelectedComponents(prevComponents => {
              const newComponents = [...prevComponents, components[id].code]; // Add the component if it doesn't already exist
              selectedComponentsRef.current = newComponents;
              return newComponents; // Return updated state
        });    
    } else if (selectedComponentsRef.current.includes(components[id].code) && textareaRefs.current[id]) {

      // Get the compass circle dimensions and center
      const compass = compassRef.current.getBoundingClientRect();
      const compassCenterX = compass.left + compass.width / 2;
      const compassCenterY = compass.top + compass.height / 2;
      const compassRadius = compass.width / 2; // Assumes it's a perfect circle

      // Calculate the distance from the center of the compass to the component's final position
      const componentCenterX = waveRect.left + waveRect.width / 2;
      const componentCenterY = waveRect.top + waveRect.height / 2;
      const distance = Math.sqrt(
        Math.pow(componentCenterX - compassCenterX, 2) + Math.pow(componentCenterY - compassCenterY, 2)
      );
      // If we want to remove the component
      if (distance <= compassRadius) {
        // Remove the component from selectedComponents
        setSelectedComponents((prevComponents) => {
          const updatedComponents = prevComponents.filter(
            (componentCode) => componentCode !== components[id].code
          );
          selectedComponentsRef.current = updatedComponents; // Update the ref
          return updatedComponents;
        });

        // Go back to initial positions
        setComponents((prevComponents) => {
          const updatedComponents = [...prevComponents];
          updatedComponents[id].x = updatedComponents[id].initialX;
          updatedComponents[id].y = updatedComponents[id].initialY;
          updatedComponents[id].angle = updatedComponents[id].initialAngle;
  
          return updatedComponents;
        });

        if (onDragStop) 
          onDragStop(
            components[id].code,
            null
          ); // send null code to Analyse to remove it there too
        return; // Exit early as the component is removed
      } else {
        const textAreaRect = textareaRefs.current[id].getBoundingClientRect();
  
        if(waveRect.left + waveRect.width / 2 > textAreaRect.left + textAreaRect.width / 2) 
          rightTip = false;
        else 
          rightTip = true;

        if(waveRect.top + waveRect.height / 2 <= textAreaRect.top + textAreaRect.height / 2) 
          topTip = false;
        else 
          topTip = true;

          setComponents((prevComponents) => {
            const updatedComponents = [...prevComponents];
            textAreaX = components[id].textAreaX;
            textAreaY = components[id].textAreaY;
            
            if(rightTip) { 
              arrowX1 = waveRect.left + waveRect.width / 2 + waveWidth / 3;
              if(components[id].type === 'Principle') 
                arrowY1 = waveRect.top + waveRect.height / 2 - waveHeight * 0.02;
              else 
                arrowY1 = waveRect.top + waveRect.height / 2 + waveHeight * 0.02;
            } else {
              arrowX1 = waveRect.left + waveRect.width / 2 - waveWidth / 3;
              if(components[id].type === 'Principle') 
                arrowY1 = waveRect.top + waveRect.height / 2 + waveHeight * 0.02;
              else 
                arrowY1 = waveRect.top + waveRect.height / 2 - waveHeight * 0.02;
            }

            arrowX2 = textAreaRect.left + textAreaRect.width / 2 - 42;

            if(topTip)
              arrowY2 = textAreaRect.top + textAreaRect.height / 2 + updatedComponents[id].textGapY2;
            else
              arrowY2 = textAreaRect.top + textAreaRect.height / 2 - 34;

            updatedComponents[id].arrowX1 = arrowX1;
            updatedComponents[id].arrowY1 = arrowY1;
            updatedComponents[id].arrowX2 = arrowX2;
            updatedComponents[id].arrowY2 = arrowY2;
            updatedComponents[id].topTip = topTip;
            updatedComponents[id].rightTip = rightTip;

            return updatedComponents;
        });
      }
    }

    setActiveRef(id);

    if (onDragStop) {
        const title = `${components[id].code} - ${components[id].label}`;

        onDragStop(
          components[id].code,
          title,
          components[id].label,
          components[id].headline,
          components[id].type,
          components[id].angle,
          data.x,
          data.y,
          textAreaX,
          textAreaY,
          components[id].textAreaData,
          arrowX1,
          arrowY1,
          arrowX2,
          arrowY2,
          components[id].textGapY2,
          topTip,
          rightTip
          );
      }
  };

  // Memoize handleKeyDown to avoid creating a new reference on each render
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
        setComponents(initialComponentsRef.current)
        setSelectedComponents([]);
        selectedComponentsRef.current = [];
        setShowSquare(false);
        setActiveId(null);
      if(resetState)
        resetState();
    }
  }, [resetState]);
    
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Dependency array includes handleKeyDown

  let containerStyle = {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 'transparent',
      position: 'relative',  
    };

  const buttonStyle = {
    position: 'absolute',
    cursor: 'pointer',
    pointerEvents: 'none', // Ensure buttons are clickable
  };

  // Other states
  const handleTextAreaDragStop = (id, data) => {
    let arrowX1, arrowY1, arrowX2, arrowY2, topTip, rightTip;
    let waveRect = waveRefs.current[id].getBoundingClientRect();

    const textAreaRect = textareaRefs.current[id].getBoundingClientRect();

    if(waveRect.left + waveRect.width / 2 > textAreaRect.left + textAreaRect.width / 2) 
      rightTip = false;
    else 
      rightTip = true;

    if(waveRect.top + waveRect.height / 2 <= textAreaRect.top + textAreaRect.height / 2) 
      topTip = false;
    else 
      topTip = true;

    setComponents((prevComponents) => {
        const updatedComponents = [...prevComponents];

        updatedComponents[id].textAreaX = data.x;
        updatedComponents[id].textAreaY = data.y;

        if(rightTip) { 
          arrowX1 = waveRect.left + waveRect.width / 2 + waveWidth / 3;
          if(components[id].type === 'Principle') 
            arrowY1 = waveRect.top + waveRect.height / 2 - waveHeight * 0.02;
          else 
            arrowY1 = waveRect.top + waveRect.height / 2 + waveHeight * 0.02;
        } else {
          arrowX1 = waveRect.left + waveRect.width / 2 - waveWidth / 3;
          if(components[id].type === 'Principle') 
            arrowY1 = waveRect.top + waveRect.height / 2 + waveHeight * 0.02;
          else 
            arrowY1 = waveRect.top + waveRect.height / 2 - waveHeight * 0.02;
        }

        arrowX2 = textAreaRect.left + textAreaRect.width / 2 - 42;

        if(topTip)
          arrowY2 = textAreaRect.top + textAreaRect.height / 2 + updatedComponents[id].textGapY2;
        else
          arrowY2 = textAreaRect.top + textAreaRect.height / 2 - 34;

        updatedComponents[id].arrowX1 = arrowX1;
        updatedComponents[id].arrowY1 = arrowY1;
        updatedComponents[id].arrowX2 = arrowX2;
        updatedComponents[id].arrowY2 = arrowY2;
        updatedComponents[id].topTip = topTip;
        updatedComponents[id].rightTip = rightTip;

        return updatedComponents;
    });

    if (onDragStop) {
        const title = `${components[id].code} - ${components[id].label}`;

        onDragStop(
          components[id].code,
          title,
          components[id].label,
          components[id].headline,
          components[id].type,
          components[id].angle,
          components[id].x,
          components[id].y,
          data.x,
          data.y,
          components[id].textAreaData,
          arrowX1, 
          arrowY1,
          arrowX2,
          arrowY2,
          components[id].textGapY2,
          topTip,
          rightTip      
        );
      }
  };

  const setActiveRef = (id) => {
    setActiveId(id);
    activeIdRef.current = id;
  }
  
  const TextArea = ({ id, position, value }) => {
    // Focus the textarea when the activeId changes
    useEffect(() => {
      if (textareaRefs.current[id] && id === activeIdRef.current) {
        textareaRefs.current[id].focus();
      }
    }, [id]); // Only re-focus when the activeId changes

    useEffect(() => {
      if (stopTextAreaFocus) {
        setActiveId(null);
        activeIdRef.current = null;
      }
    }, [id]); // Only re-focus when the activeId changes

    useEffect(() => {
      if (
        textareaRefs.current[id] &&
        value.cursorStart !== undefined &&
        value.cursorEnd !== undefined
      ) {
        textareaRefs.current[id].setSelectionRange(value.cursorStart, value.cursorEnd);
      }
    }, [id, value.cursorStart, value.cursorEnd]);
  
    function getTextWidth(text, font) {
      // Create a canvas element (it won't be visible)
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
  
      // Set the font style (matching the textarea's style)
      context.font = font;
  
      // Measure the text width
      var textWidth = context.measureText(text).width;
      return textWidth;
  }
  
  function getTextWidthFromTextarea(id) {
      // Access the textarea element using its ref
      const textarea = textareaRefs.current[id];
  
      if (textarea) {
          // Get the current value of the textarea (the text the user has typed)
          const text = textarea.value;
          // Get the computed font style of the textarea
          const font = getComputedStyle(textarea).font; // This will include fontFamily, fontSize, etc.
          // Measure the width of the text
          const textWidth = getTextWidth(text, font);
  
          return textWidth;
      } 
  }

    const handleInputChange = (e) => {
      const { value, selectionStart, selectionEnd } = e.target;
      const textareaWidth = getTextWidthFromTextarea(id);
      const textAreaRect = textareaRefs.current[id].getBoundingClientRect();
      let arrowY2, textGapY2;

      if(textareaWidth < 130)
        textGapY2 = -2
      else if(textareaWidth >= 130 && textareaWidth < 260)
        textGapY2 = 13;
      else if(textareaWidth >= 260 && textareaWidth < 381)
        textGapY2 = 34;
      else if(textareaWidth >= 381)
        return;

      // Update the text and cursor position
      setComponents((prevComponents) => {
        const updatedComponents = [...prevComponents];
        updatedComponents[id].textAreaData = {
            text: value,
            cursorStart: selectionStart,
            cursorEnd: selectionEnd,
        }
        if(updatedComponents[id].topTip) {
          arrowY2 = textAreaRect.top + textAreaRect.height / 2 + textGapY2;
          updatedComponents[id].arrowY2 = arrowY2;
          updatedComponents[id].textGapY2 = textGapY2;
        }
        return updatedComponents;
      });

      if (onDragStop) {
        const title = `${components[id].code} - ${components[id].label}`;

        onDragStop(
            components[id].code,
            title,
            components[id].label,
            components[id].headline,
            components[id].type,
            components[id].angle,
            components[id].x,
            components[id].y,
            components[id].textAreaX,
            components[id].textAreaY,
            {
                text: value,
                cursorStart: selectionStart,
                cursorEnd: selectionEnd,
            }, 
            components[id].arrowX1,
            components[id].arrowY1,
            components[id].arrowX2,
            arrowY2,
            textGapY2,
            components[id].topTip,
            components[id].rightTip
        );
        }
    };

    return (
        <div>
        <style type="text/css">
            {`
                @font-face {
                    font-family: 'Handlee-Regular';
                    src: url(data:font/ttf;base64,${encodedFonts['Handlee-Regular']}) format('truetype');
                }
            `}
        </style>
        <Draggable
            nodeRef={nodeRef}
            position={position} // Controlled position from parent state
            onStart={() => setActiveRef(id)} // Set this textarea as active on drag
            onStop={(e, data) => handleTextAreaDragStop(id, data)} // Update position after drag
        >
        <div
          style={{
            position: "absolute", // Ensure absolute positioning within container
            zIndex: 100,
          }}
        >
          {!pdfSelectedComponents && 
          <textarea
            ref={(el) => (textareaRefs.current[id] = el)}
            name={id}
            value={value.text}
            onChange={handleInputChange}
            placeholder="Enter your notes here"
            spellCheck="false"
            className="a-compass-textarea"
            style={{
              width: "130px",
              height: "50px",
              fontFamily: "Handlee-Regular, sans-serif",
              fontSize: "14px",
              padding: "8px",
              borderRadius: "4px",
              color: "#72716f",
              background: "transparent",
              border: "0px solid transparent",
              resize: "none",
              whiteSpace: "pre-wrap", // Preserve line breaks and whitespace
              overflowWrap: "break-word", // Wrap long words onto the next line
              overflow: "hidden",
              lineHeight: "normal",
            }}
          />
          }

          {pdfSelectedComponents && 
          <div
            style={{
              width: "130px",
              height: "50px",
              fontFamily: "Handlee-Regular, sans-serif",
              fontSize: "14px",
              padding: "8px",
              borderRadius: "4px",
              border: "0px solid black",
              color: "#72716f",
              background: "transparent",
              position: "absolute",
              top: "0px",
              left: "0px",
              whiteSpace: "pre-wrap", // Preserve line breaks
              overflowWrap: "break-word", // Wrap long words
          }}>
            {value.text}
          </div>
          }
          
        </div>
      </Draggable>
      </div>
    );
  };

  return (
    <>       
      <div 
        style={{
          ...containerStyle, 
        }}
      >
      {(showSquare && !pdfSelectedComponents) && 
        <div 
            style={{
                position: 'absolute',
                top: '17vh',
                left: '47vw',
                width: '50vw',
                height: '67vh',
                border: '2px solid #cacbcb',
                borderRadius: '10px'
            }}
        ></div>
      }
      <div 
        ref={compassRef}
        style={{
          position: 'absolute',
          top: "50.8vh",
          left: "25vw",
          transform: "translate(-50%, -50%)",
          width: `${size+size/6}px`,
          height: `${size+size/6}px`,
          backgroundColor: "transparent",
          borderRadius: '50%'
        }}
      ></div>

        {components.map((c, i) => (
        <React.Fragment key={i}> 
        <Draggable key={i} 
            nodeRef={nodeRef} 
            position={{ x: c.x, y: c.y }} // Let Draggable manage the position if no positions are defined
            disabled={isExplanationPage}
            onStart={() => handleDragStart(i)} // Set this textarea as active on drag
            onStop={(e, data) => handleDragStop(i, data)} // Set this textarea as active on drag
        >
          <div key={i} ref={nodeRef}>
            {/* Shape */}
            <div
             style={{
                ...buttonStyle,
                transform: `rotate(${c.angle}rad) ${c.type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
                zIndex: 1 // Layer filled shapes at the base
              }}
            >
              <svg viewBox="-5 0 100 20" width={waveWidth} height={waveHeight} style={{ pointerEvents: 'none' }}>
                <path 
                  ref={(el) => (waveRefs.current[i] = el)}
                  d={svgPath} 
                  fill={getWaveFill(mode, colors, selectedComponents, c)}  // Use the gradient fill
                  stroke="none" 
                  style={{ pointerEvents: 'all' }}
                  transition="opacity 1s ease"
                  opacity={getWaveOpacity(mode, selectedComponents, c, opacityCounter, allComponents)} // Change opacity on hover
                />
              </svg>
            </div>

            {/* Outline Shape */}
            <div
              style={{
                ...buttonStyle,
                transform: `rotate(${c.angle}rad) ${c.type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
                position: 'absolute', // Consistent positioning
                zIndex: 30 // Ensures outlines are rendered on top of filled shapes
              }}
            >
              <svg viewBox="-5 0 100 20" width={waveWidth} height={waveHeight} style={{ pointerEvents: 'none' }}>
                <path 
                  d={svgPath} 
                  fill="none"
                  opacity={getStrokeOpacity()} // Change opacity on hover
                  stroke={getStroke(mode, colors, selectedComponents, c)}
                  strokeWidth={getStrokeWidth(mode)}
                  style={{ pointerEvents: 'all' }} 
                />
              </svg>
            </div>
  
            {/* Text */}
            <div
              style={{
                position: 'absolute',
                left: `${0.35*waveWidth/4}px`, // Adjust position for button size
                transform: isFlipped(c.code) ? `rotate(${c.angle + Math.PI}rad)` : `rotate(${c.angle}rad)`,
                opacity: getWaveOpacity(mode, selectedComponents, c, opacityCounter, allComponents), // Change opacity on hover
                zIndex: 10,
                pointerEvents: 'none', // Disable pointer events for the inner div
                userSelect: 'none'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  left: isFlipped(c.code) 
                    ? (c.type === 'Principle' ? '6.5px' : '7.5px') 
                    : (c.type === 'Principle' ? '-6.5px' : '-6.5px'), 
                  top: isFlipped(c.code) 
                    ? (c.type === 'Principle' ? '6px' : '-2px') 
                    : (c.type === 'Principle' ? '-2px' : '6px'),
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              >
                <svg viewBox="0 0 119.78 16.4" width={waveWidth * 0.83} height={waveHeight} style={{ pointerEvents: 'none' }}>
                  {/* <path 
                    d={c.type === "Principle" ? svgTextPathInverted : svgTextPath } 
                    fill={'none'} 
                    stroke='black' 
                  />  */}
                  <defs>
                    <style type="text/css">
                      {`
                        @font-face {
                          font-family: 'Manrope';
                          src: url(data:font/ttf;base64,${encodedFonts['Manrope-Medium']}) format('truetype');
                        }
                      `}
                    </style>
                    
                    <path 
                      id={`text-path-${i}`} 
                      d={c.type === "Principle" ? svgTextPathInverted : svgTextPath } 
                      style={{ 
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }} 
                    />
                  </defs>
  
                  {/* Text on Path */}
                  <text
                    fill={getTextFill(mode, colors, selectedComponents, c)}
                    fontSize="8px"
                    letterSpacing={getLabelWidth(c.label) > 10 ? "0.5px" : "0.9px"}
                    dy={bigLabels.includes(c.code) ? '-0.11em' : '0.35em'} // Adjust this to center the text vertically on the path
                    style={{ pointerEvents: 'none' }} // Ensure text doesn't interfere
                    >
                    <textPath
                      href={`#text-path-${i}`}
                      startOffset="50%" // Center text along the path
                      textAnchor="middle" // Ensure the text centers based on its length
                      style={{ 
                        pointerEvents: 'none',  
                        userSelect: 'none'
                      }} // Ensure textPath doesn't interfere
                    >
                      {getText(mode, c.type, c.label, c.code, 0)}
                    </textPath>
                  </text>
  
                  {/* Second Line (if it has one) */}
                  {bigLabels.includes(c.code) &&
                    <text
                      fill={getTextFill(mode, colors, selectedComponents, c)}
                      fontSize="8px"
                      letterSpacing={getLabelWidth(c.label) > 10 ? "0.5px" : "0.9px"}
                      dy="0.84em" // Adjust this to center the text vertically on the path
                      style={{ 
                        pointerEvents: 'none', 
                        userSelect: 'none'
                      }} // Ensure text doesn't interfere
                    >
                      <textPath
                        href={`#text-path-${i}`}
                        startOffset="50%" // Center text along the path
                        textAnchor="middle" // Ensure the text centers based on its length
                        style={{ 
                          pointerEvents: 'none', 
                          userSelect: 'none'
                        }} // Ensure textPath doesn't interfere
                      >
                        {getText(mode, c.type, c.label, c.code, 1)}
                      </textPath>
                    </text>
                  }
                </svg>
              </div>
            </div>
          </div>
        </Draggable>
        
        {selectedComponentsRef.current.includes(c.code) && ((pdfSelectedComponents && c.textAreaData.length !== 0) || !pdfSelectedComponents) &&
        <div
          style={{
            opacity: getWaveOpacity(mode, selectedComponents, c, opacityCounter, allComponents)
          }}
        >
        {/* Text Box */}
        <TextArea
            id={i}
            position={{x: c.textAreaX, y: c.textAreaY }}
            value={c.textAreaData}
            onDragStop={handleDragStop}
        />
        {/* Arrow */}
        <svg 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none', // Ensure the line is not interactive
                zIndex: 50,
            }}
        >
            {/* Line */}
            <line 
                x1={c.arrowX1}
                y1={c.arrowY1}
                x2={c.arrowX2}
                y2={c.arrowY2}
                stroke="#72716f"
                strokeWidth="1"
            />
            
            {/* Circle */}
            <circle 
                cx={c.arrowX1} // Center X position
                cy={c.arrowY1} // Center Y position
                r="2"          // Radius of the circle
                fill="#72716f" // Circle color
            />
        </svg>
        </div>
        }
        </React.Fragment>
        ))}
      </div>  
    </>
  );
} 

function getComponentsPositions(componentsData, type) {
  const centerX = window.innerWidth * 0.1599;
  const centerY = window.innerHeight * 0.359;
  let radius, numberOfComponents;

  if(type === 'Principle') {
    radius = size/6.9;
    numberOfComponents = 7;
  } else if(type === 'Perspective') {
    radius = size/2.93;
    numberOfComponents = 7;
  } else if(type === 'Dimension') {
    radius = size/2;
    numberOfComponents = 10;
  }

  const angleStep = (2 * Math.PI) / numberOfComponents;
  let startAngle

  if(type === 'Principle')
    startAngle = -Math.PI/1.55;
  else
    startAngle = -Math.PI/2;

  for (let i = 0; i < numberOfComponents; i++) {
    let angle = i * angleStep + startAngle;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    if(type === 'Principle')
      angle = angle + 2*Math.PI / 2 + Math.PI*0.02;
    else if(type === 'Perspective')
      angle = angle + Math.PI / 2 - Math.PI*0.01;
    else if(type === 'Dimension')
      angle = angle + Math.PI / 2 - Math.PI*0.005;

    componentsData[i]["initialX"] = x - waveWidth/2 + window.innerWidth/2.94;
    componentsData[i]["initialY"] = y - waveHeight/2 + window.innerHeight/6.85;
    componentsData[i]["initialAngle"] = angle;
    componentsData[i]["x"] = componentsData[i]["initialX"];
    componentsData[i]["y"] = componentsData[i]["initialY"];
    componentsData[i]["angle"] = componentsData[i]["initialAngle"];
    componentsData[i]["textAreaX"] = x;
    componentsData[i]["textAreaY"] = y;
    componentsData[i]["textAreaData"] = "";
    componentsData[i]["arrowX1"] = x;
    componentsData[i]["arrowY1"] = y;
    componentsData[i]["arrowX2"] = x;
    componentsData[i]["arrowY2"] = y+150;
    componentsData[i]["textGapY2"] = -2;
    componentsData[i]["topTip"] = true;
    componentsData[i]["rightTip"] = true;

  }
  return componentsData;
};

const getWaveFill = (mode, colors, selectedComponents, component) => {
    return colors['Wave'][component.type];
}

const getTextFill = (mode, colors, selectedComponents, component) => {
    return colors['Label'][component.type];
}

const getStroke = (mode, colors, selectedComponents, component) => {
    return 'none';
};

const getStrokeWidth = (mode) => {
    return "0.6px";
};

const getWaveOpacity = (mode, selectedComponents, component, allComponents) => {
  // Analyse    
  if(mode === "analyse" || mode === "analyse-a-all") {
    if (selectedComponents.includes(component.code)) 
      return 1;
    return 1;
  }
  if(mode === "analyse-a-p") {
    if(component.type === "Principle")
      return 1;
    else
      return 0.3;
  }
  if(mode === "analyse-a-pe") {
    if(component.type === "Perspective")
      return 1;
    else
      return 0.3;
  }
  if(mode === "analyse-a-d") {
    if(component.type === "Dimension")
      return 1;
    else
      return 0.3;
  }
};

const getStrokeOpacity = () => {
  return 1;
};

const isFlipped = (label) => {
  const flippedTexts = ['P2', 'P3', 'P4', 'P5', 'Pe3', 'Pe4', 'Pe5', 'D4', 'D5', 'D6', 'D7'];

  if(flippedTexts.includes(label)) 
    return false;
  return true;
};

const getText = (mode, type, label, code, index) => {
  if(bigLabels.includes(code)) {
    let firstIndex = label.indexOf(' ');
    let secondIndex = label.indexOf(' ', firstIndex + 1);
    let firstPart, secondPart;

    firstPart = label.substring(0, firstIndex); // "a"

    if (firstPart.length > 6) {
        // Case 1: Only one space ("a b")
        firstPart = label.substring(0, firstIndex); // "a"
        secondPart = label.substring(firstIndex + 1); // "b"
    } else {
        // Case 2: Two spaces ("a b c")
        firstPart = label.substring(0, secondIndex); // "a b"
        secondPart = label.substring(secondIndex + 1); // "c"
    }

    if(index === 0)
      return firstPart;
    else
      return secondPart;
  }
  return label;
};

function getLabelWidth(label) {
   // Count the number of "I" characters in the label
   const countI = label.split('I').length - 1;
   const remainingLetters = label.length-countI;

   return remainingLetters*1 + countI*0.5;
}

export default BigWave;
