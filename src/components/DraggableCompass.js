import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { getGetStartedData } from '../utils/DataExtraction.js'; 
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { StateContext } from "../State";
import Draggable from "react-draggable";
import Wave, { getComponentsPositions } from "./Wave.js"

const DraggableCompass = ({ mode, currentType, onDragStop, resetState, pdfComponents, stopTextareaFocus }) => {
  // Size and screen resize handler
  const [size, setSize] = useState(window.innerHeight/1.47);
  const [waveWidth, setWaveWidth] = useState((window.innerHeight/1.47)/2.6);
  const [waveHeight, setWaveHeight] = useState((window.innerHeight/1.47)*(3/2.6));
  
  useEffect(() => {
    // Function to update height on window resize
    const handleResize = () => {
      setSize(window.innerHeight/1.47);
      setWaveWidth((window.innerHeight/1.47)/2.6);
      setWaveHeight((window.innerHeight/1.47)*(3/2.6));
    };
    // Add event listener for resize
    window.addEventListener('resize', handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Compass Type
  const compassType = "draggable";

  // Global Variables
  const {
    isExplanationPage,
    ideateComponents,
    setIdeateComponents,
  } = useContext(StateContext);
  
  // Container Position
  const topPosition = 0.17 * window.innerHeight;
  const leftPosition = 0.472 * window.innerWidth;
  
  document.documentElement.style.setProperty('--top-position', `${topPosition}px`);
  document.documentElement.style.setProperty('--left-position', `${leftPosition}px`);
  
  // Dictionary with all information
  let componentsData = getGetStartedData();

  const principles = getComponentsPositions(compassType, componentsData['Principle'], 'Principle', size, [topPosition, leftPosition]);
  const perspectives = getComponentsPositions(compassType, componentsData['Perspective'], 'Perspective', size, [topPosition, leftPosition]);
  const dimensions = getComponentsPositions(compassType, componentsData['Dimension'], 'Dimension', size, [topPosition, leftPosition]);
  const initialComponents = principles.concat(perspectives, dimensions);
 
  let startingComponents = initialComponents;

  if(pdfComponents)
    startingComponents = pdfComponents;

  console.log(startingComponents);
  const [components, setComponents] = useState(startingComponents);
  
  let pdfSelectedComponents;
  if(pdfComponents)
    pdfSelectedComponents = pdfComponents.map((component) => component.code);
  
  // Determine which components and setter to use based on mode
  const [selectedComponents, setSelectedComponents] = useState(pdfSelectedComponents || []);

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

   // Update the ref whenever originalComponents changes
   useEffect(() => {
    initialComponentsRef.current = initialComponents;
  }, [initialComponents]);

  useEffect(() => {
    setComponents((prevComponents) =>
        prevComponents.map((component) => ({
          ...component,
          initialX: isExplanationPage ? component.x : component.x - window.innerWidth/4,
          x: isExplanationPage ? component.x : component.x - window.innerWidth/4,
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
          ); // send null code to Ideate to remove it there too
        
        activeIdRef.current = null;

        return; // Exit early as the component is removed
      } 
    }
    
    const positions = getPositions(id, init, data.x, data.y, null, null);

    setComponents((prevComponents) => {
      const updatedComponents = [...prevComponents];   

      updatedComponents[id].x = positions.x;
      updatedComponents[id].y = positions.y;
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

    setSelectedComponents(prevComponents => {
      const newComponents = [...prevComponents, components[id].code]; // Add the component if it doesn't already exist
      selectedComponentsRef.current = newComponents;
      return newComponents; // Return updated state
    });   

    if (onDragStop) 
      sendNewData(id, data.x, data.y, positions.textareaX, positions.textareaY, components[id].textareaData, positions.arrowX1, positions.arrowY1, positions.arrowX2, positions.arrowY2, components[id].textGapY2, positions.topTip, positions.rightTip)

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

    const waveX = waveRect.left + waveRect.width / 2 - leftPosition;
    const waveY = waveRect.top + waveRect.height / 2 - topPosition;
    // Initialization if doesn't exist already
    if(init) {
      x = dataX;
      y = dataY;
      textareaX = dataX + window.innerHeight/7.4;
      textareaY = dataY + window.innerHeight/4.3;
      topTip = components[id].topTip;
      rightTip = components[id].rightTip;

      arrowX1 = waveX + waveWidth / 3;

      if(components[id].type === 'Principle')
        arrowY1 = waveY - waveHeight * 0.02;
      else
        arrowY1 = waveY + waveHeight * 0.02;

      arrowX2 = dataX + window.innerHeight/5.55;
      arrowY2 = dataY + window.innerHeight/3.5 + components[id].textGapY2;

    } else {
      x = (dataX || components[id].x);
      y = (dataY || components[id].y);
      textareaX = (dataTextareaX  || components[id].textareaX);
      textareaY = (dataTextareaY || components[id].textareaY);

      const textareaRect = textareaRefs.current[id].getBoundingClientRect();
      const textX = textareaRect.left + textareaRect.width / 2 - leftPosition;
      const textY = textareaRect.top + textareaRect.height / 2 - topPosition;

      if(waveRect.left + waveRect.width / 2 > textareaRect.left + textareaRect.width / 2) 
        rightTip = false;
      else 
        rightTip = true;

      if(waveRect.top + waveRect.height / 2 <= textareaRect.top + textareaRect.height / 2) 
        topTip = false;
      else 
        topTip = true;

      if(rightTip) { 
        arrowX1 = waveX + waveWidth / 3;
        if(components[id].type === 'Principle') 
          arrowY1 = waveY - waveHeight * 0.02;
        else 
          arrowY1 = waveY + waveHeight * 0.02;
      } else {
        arrowX1 = waveX - waveWidth / 3;
        if(components[id].type === 'Principle') 
          arrowY1 = waveY + waveHeight * 0.02;
        else 
          arrowY1 = waveY - waveHeight * 0.02;
      }

      arrowX2 = textX - window.innerHeight/17.38;

      if(topTip)
        arrowY2 = textY + components[id].textGapY2;
      else
        arrowY2 = textY - window.innerHeight/21.47;
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
    width: window.innerWidth/2.2,
    height: window.innerHeight/1.5,
    backgroundColor: 'transparent',
    border: pdfComponents || isExplanationPage ? '0.3vh solid transparent' : '0.3vh solid #cacbcb',
    borderRadius: '1.5vh'
  };
  
  const getTextareaOpacity = (component) => {
    if(currentType === 'All' || !currentType) 
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
      let arrowY2 = components[id].arrowY2;
      let textGapY2 = components[id].textGapY2;

      if(textareaWidth < 0.18*window.innerHeight)
        textGapY2 = window.innerHeight/365;
      else if(textareaWidth >= 0.18*window.innerHeight && textareaWidth < 0.36*window.innerHeight)
        textGapY2 = window.innerHeight/42.94;
      else if(textareaWidth >= 0.36*window.innerHeight && textareaWidth < 0.53*window.innerHeight)
        textGapY2 = window.innerHeight/21.47;
      else if(textareaWidth >= 0.53*window.innerHeight)
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
          arrowY2 = textareaRect.top + textareaRect.height / 2 + textGapY2 - topPosition;
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
                  width: "18vh",
                  height: "7.6vh",
                  fontFamily: "Handlee-Regular, sans-serif",
                  fontSize: "2vh",
                  padding: "1.2vh",
                  borderRadius: "0.6vh",
                  color: "#72716f",
                  background: "transparent",
                  border: "0 solid transparent",
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
                  width: "18vh",
                  height: "7.6vh",
                  fontFamily: "Handlee-Regular, sans-serif",
                  fontSize: "2vh",
                  padding: "1.2vh",
                  borderRadius: "0.6vh",
                  border: "0 solid black",
                  color: "#72716f",
                  background: "transparent",
                  position: "absolute",
                  top: "0",
                  left: "0",
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
      {/* Area of the Compass*/}
      {!pdfComponents && 
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none', // Ensure the line is not interactive
          }}
        >
          <svg 
            width={window.innerWidth} 
            height={window.innerHeight} 
            viewBox={`${0} ${0} ${window.innerWidth} ${window.innerHeight}`}
          >
            {/* Circle */}
            <circle 
              ref={compassRef}
              cx={window.innerWidth * 0.25} // Center X position
              cy={window.innerHeight * 0.508} // Center Y position
              r={size/1.6}          // Radius of the circle
              fill="transparent" // Circle color
            />
          </svg>
        </div>
      }
      {components.map((component, id) => (
        <div key={id}> 
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
          
          {selectedComponents.includes(component.code) && (((pdfSelectedComponents && component.textareaData.length !== 0) || !pdfSelectedComponents) && window.innerWidth > 1300) &&
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
        </div>
      ))}
    </div>  
  );
} 

export default DraggableCompass;
