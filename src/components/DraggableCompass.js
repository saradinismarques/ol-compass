import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { getGetStartedData } from '../utils/Data.js'; 
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { StateContext } from "../State";
import Draggable from "react-draggable";
import Wave, { getComponentsPositions } from "./Wave.js"

// Sizes and positions 
let size;

if(window.innerHeight > 700) 
  size = 490;
else
  size = 460;

const waveWidth = size/2.6;
const waveHeight = waveWidth*3;

const DraggableCompass = ({ mode, currentType, onDragStop, resetState, pdfComponents, stopTextareaFocus }) => {
  // Compass Type
  const compassType = "draggable";

  // Global Variables
  const {
    isExplanationPage,
  } = useContext(StateContext);
  
  // Dictionary with all information
  let componentsData = getGetStartedData();

  const principles = getComponentsPositions(compassType, componentsData['Principle'], 'Principle', size);
  const perspectives = getComponentsPositions(compassType, componentsData['Perspective'], 'Perspective', size);
  const dimensions = getComponentsPositions(compassType, componentsData['Dimension'], 'Dimension', size);
  const initialComponents = principles.concat(perspectives, dimensions);
 
  const [components, setComponents] = useState(pdfComponents || initialComponents);
  
  let pdfSelectedComponents;
  if(pdfComponents)
    pdfSelectedComponents = pdfComponents.map((component) => component.code);
  
  // Determine which components and setter to use based on mode
  const [selectedComponents, setSelectedComponents] = useState(pdfSelectedComponents || []);
  const [showSquare, setShowSquare] = useState(false);

  const selectedComponentsRef = useRef(selectedComponents);
  const activeIdRef = useRef(null);
  const nodeRef = useRef(null);
  const initialComponentsRef = useRef(initialComponents);
  const textareaRefs = useRef({}); // Store refs dynamically for all textareas
  const waveRefs = useRef({});   // Store refs dynamically for all circles
  const compassRef = useRef({});

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

  // Handlers
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
    let init = true;

    if (selectedComponentsRef.current.includes(components[id].code)) {
      init = false;
      // If we want to remove the component
      if (isInsideCompassArea(id)) {
        // Go back to initial positions
        setComponents((prevComponents) => {
          const updatedComponents = [...prevComponents];
          updatedComponents[id].x = updatedComponents[id].initialX;
          updatedComponents[id].y = updatedComponents[id].initialY;
          updatedComponents[id].angle = updatedComponents[id].initialAngle;
  
          return updatedComponents;
        });

        // Remove the component from selectedComponents
        setSelectedComponents((prevComponents) => {
          const updatedComponents = prevComponents.filter(
            (componentCode) => componentCode !== components[id].code
          );
          selectedComponentsRef.current = updatedComponents; // Update the ref
          
          return updatedComponents;
        });

        if (onDragStop) 
          onDragStop(
            components[id].code,
            null
          ); // send null code to Analyse to remove it there too
        
        activeIdRef.current = null;

        return; // Exit early as the component is removed
      } 
    }
    
    const tip = getPositions(id, init, data.x, data.y, null, null);

    setComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];   

      updatedComponents[id].x = tip.x;
      updatedComponents[id].y = tip.y;
      updatedComponents[id].textareaX = tip.textareaX;
      updatedComponents[id].textareaY = tip.textareaY;
      updatedComponents[id].arrowX1 = tip.arrowX1;
      updatedComponents[id].arrowY1 = tip.arrowY1;
      updatedComponents[id].arrowX2 = tip.arrowX2;
      updatedComponents[id].arrowY2 = tip.arrowY2;
      updatedComponents[id].topTip = tip.topTip;
      updatedComponents[id].rightTip = tip.rightTip;

      return updatedComponents;
    });

    setSelectedComponents(prevComponents => {
      const newComponents = [...prevComponents, components[id].code]; // Add the component if it doesn't already exist
      selectedComponentsRef.current = newComponents;
      return newComponents; // Return updated state
    });   

    if (onDragStop) 
      sendNewData(id, data.x, data.y, tip.textareaX, tip.textareaY, components[id].textareaData, tip.arrowX1, tip.arrowY1, tip.arrowX2, tip.arrowY2, components[id].textGapY2, tip.topTip, tip.rightTip)

    activeIdRef.current = id;
  };

  const handleTextareaDragStop = (id, data) => {
    const positions = getPositions(id, false, null, null, data.x, data.y);

    setComponents((prevComponents) => {
        const updatedComponents = [...prevComponents];

        updatedComponents[id].textareaX = positions.textareaX;
        updatedComponents[id].textareaY = positions.textareaY;
        updatedComponents[id].arrowX1 = positions.arrowX1;
        updatedComponents[id].arrowY1 = positions.arrowY1;
        updatedComponents[id].arrowX2 = positions.arrowX2;
        updatedComponents[id].arrowY2 = positions.arrowY2;
        updatedComponents[id].topTip = positions.topTip;
        updatedComponents[id].rightTip = positions.rightTip;

        return updatedComponents;
    });

    if (onDragStop) 
      sendNewData(id, components[id].x, components[id].y, positions.textareaX, positions.textareaY, components[id].textareaData, positions.arrowX1, positions.arrowY1, positions.arrowX2, positions.arrowY2, components[id].textGapY2, positions.topTip, positions.rightTip)
  };

  // Memoize handleKeyDown to avoid creating a new reference on each render
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setComponents(initialComponentsRef.current)
      setSelectedComponents([]);
      selectedComponentsRef.current = [];
      setShowSquare(false);
      activeIdRef.current = null;
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
  
  // Functions
  const getPositions = (id, init, dataX, dataY, dataTextareaX, dataTextareaY) => {
    let x, y, textareaX, textareaY, arrowX1, arrowY1, arrowX2, arrowY2, topTip, rightTip;
    let waveRect = waveRefs.current[id].getBoundingClientRect();

    // Initialization if doesn't exist already
    if(init) {
      x = dataX;
      y = dataY;
      textareaX = dataX + 100;
      textareaY = dataY + 175;
      topTip = components[id].topTip;
      rightTip = components[id].rightTip;

      arrowX1 = waveRect.left + waveRect.width / 2 + waveWidth / 3;

      if(components[id].type === 'Principle')
        arrowY1 = waveRect.top + waveRect.height / 2 - waveHeight * 0.02;
      else
        arrowY1 = waveRect.top + waveRect.height / 2 + waveHeight * 0.02;

      arrowX2 = dataX + 130;
      arrowY2 = dataY + 207 + components[id].textGapY2;
    } else {
      x = (dataX || components[id].x);
      y = (dataY || components[id].y);
      textareaX = (dataTextareaX || components[id].texareaX);
      textareaY = (dataTextareaY || components[id].textareaY);

      const textareaRect = textareaRefs.current[id].getBoundingClientRect();

      if(waveRect.left + waveRect.width / 2 > textareaRect.left + textareaRect.width / 2) 
        rightTip = false;
      else 
        rightTip = true;

      if(waveRect.top + waveRect.height / 2 <= textareaRect.top + textareaRect.height / 2) 
        topTip = false;
      else 
        topTip = true;

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

      arrowX2 = textareaRect.left + textareaRect.width / 2 - 42;

      if(topTip)
        arrowY2 = textareaRect.top + textareaRect.height / 2 + components[id].textGapY2;
      else
        arrowY2 = textareaRect.top + textareaRect.height / 2 - 34;
    }
    
    return {
      x: x,
      y: y,
      textareaX: textareaX,
      textareaY: textareaY,
      arrowX1: arrowX1,
      arrowY1: arrowY1,
      arrowX2: arrowX2,
      arrowY2: arrowY2,
      topTip: topTip,
      rightTip: rightTip
    }
  };

  const isInsideCompassArea = (id) => {
    let waveRect = waveRefs.current[id].getBoundingClientRect();
    
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

    if (distance <= compassRadius) 
      return true;
    else
      return false;
  }

  const sendNewData = (id, x, y, textareaX, textareaY, textareaData, arrowX1, arrowY1, arrowX2, arrowY2, textGapY2, topTip, rightTip) => {
    const title = `${components[id].code} - ${components[id].label}`;

    onDragStop(
      components[id].code,
      title,
      components[id].label,
      components[id].headline,
      components[id].type,
      components[id].angle,
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
      rightTip      
    );
  }

  const isFlipped = (label) => {
    const flippedTexts = ['P2', 'P3', 'P4', 'P5', 'Pe3', 'Pe4', 'Pe5', 'D4', 'D5', 'D6', 'D7'];
  
    if(flippedTexts.includes(label)) 
      return false;
    return true;
  };

  // Styles
  let containerStyle = {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 'transparent',
    position: 'relative',  
  };
  
  const getTextareaOpacity = (component) => {
    if(mode === "analyse-a" && (currentType === 'All' || !currentType)) 
      return 1;
    else if(component.type === currentType)
      return 1;
    else
      return 0.3;
  } 

  // Other Components
  const Textarea = ({ id, position, value = { text: "", cursorStart: 0, cursorEnd: 0 } }) => {
    // Focus the textarea when the activeId changes
    useEffect(() => {
      if (textareaRefs.current[id] && id === activeIdRef.current) {
        textareaRefs.current[id].focus();
      }
    }, [id]); // Only re-focus when the activeId changes

    useEffect(() => {
      if (stopTextareaFocus) 
        activeIdRef.current = null;
    }, [id]); // Only re-focus when the activeId changes

    useEffect(() => {
      if (textareaRefs.current[id] && value.cursorStart !== undefined && value.cursorEnd !== undefined)
        textareaRefs.current[id].setSelectionRange(value.cursorStart, value.cursorEnd);
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
      const textareaRect = textareaRefs.current[id].getBoundingClientRect();
      let arrowY2, textGapY2;

      if(textareaWidth < 130)
        textGapY2 = -2
      else if(textareaWidth >= 130 && textareaWidth < 260)
        textGapY2 = 13;
      else if(textareaWidth >= 260 && textareaWidth < 381)
        textGapY2 = 34;
      else if(textareaWidth >= 381)
        return;

      const textareaData = {
        text: value,
        cursorStart: selectionStart,
        cursorEnd: selectionEnd,
      };

      // Update the text and cursor position
      setComponents((prevComponents) => {
        const updatedComponents = [...prevComponents];
        updatedComponents[id].textareaData = textareaData;
        if(updatedComponents[id].topTip) {
          arrowY2 = textareaRect.top + textareaRect.height / 2 + textGapY2;
          updatedComponents[id].arrowY2 = arrowY2;
          updatedComponents[id].textGapY2 = textGapY2;
        }
        return updatedComponents;
      });

      if (onDragStop)
        sendNewData(id, components[id].x, components[id].y, components[id].textareaX, components[id].textareaY, textareaData, components[id].arrowX1, components[id].arrowY1, components[id].arrowX2, arrowY2, textGapY2, components[id].topTip, components[id].rightTip)
    }
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
          onStart={() => activeIdRef.current = id} // Set this textarea as active on drag
          onStop={(e, data) => handleTextareaDragStop(id, data)} // Update position after drag
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

      {components.map((component, id) => (
        <React.Fragment key={id}> 
          <Draggable key={id} 
            nodeRef={nodeRef} 
            position={{ x: component.x, y: component.y }} // Let Draggable manage the position if no positions are defined
            disabled={isExplanationPage}
            onStart={() => handleDragStart(id)} // Set this textarea as active on drag
            onStop={(e, data) => handleDragStop(id, data)} // Set this textarea as active on drag
          >
            <div key={id} ref={nodeRef}>
              <Wave 
                compassType={compassType}
                component={component}
                currentType={currentType}
                size={size}
                mode={mode}
                selectedComponents={selectedComponents}
                waveRef={(el) => (waveRefs.current[id] = el)}
              />
            </div>
          </Draggable>
          
          {selectedComponents.includes(component.code) && ((pdfSelectedComponents && component.textareaData.length !== 0) || !pdfSelectedComponents) &&
            <div
              style={{
                opacity: getTextareaOpacity(component)
              }}
            >
              {/* Text Box */}
              <Textarea
                  id={id}
                  position={{x: component.textareaX, y: component.textareaY }}
                  value={component.textareaData}
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
                  x1={component.arrowX1}
                  y1={component.arrowY1}
                  x2={component.arrowX2}
                  y2={component.arrowY2}
                  stroke="#72716f"
                  strokeWidth="1"
                />
                  
                {/* Circle */}
                <circle 
                  cx={component.arrowX1} // Center X position
                  cy={component.arrowY1} // Center Y position
                  r="2"          // Radius of the circle
                  fill="#72716f" // Circle color
                />
              </svg>
            </div>
          }
        </React.Fragment>
      ))}
    </div>  
  );
} 

export default DraggableCompass;
