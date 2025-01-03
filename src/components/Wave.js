import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { StateContext } from "../State";
import { encodedFonts } from '../assets/fonts/Fonts.js';

// SVG Path for button shape
const svgPath = "m82.54,14.01c-.44.31-.88.61-1.32.92-.54.38-1.09.77-1.63,1.16-.34.24-.69.48-1.03.72-.55.39-1.1.78-1.65,1.17-.55.38-1.09.76-1.64,1.15-.47.33-.93.66-1.4.99-.43.3-.86.6-1.29.9-.44.31-.89.62-1.34.93-.26.18-.51.35-.77.52-.29.19-.58.38-.88.56-.26.15-.52.29-.78.43-.36.19-.71.4-1.07.58-.62.3-1.24.59-1.87.86-.59.25-1.19.49-1.79.69-.95.31-1.91.63-2.9.83-.37.08-.74.18-1.12.25-.28.06-.57.09-.85.14-.38.06-.77.14-1.15.18-1.17.13-2.35.21-3.53.21-.19,0-.38,0-.57,0-.3,0-.6-.03-.9-.04-.37-.02-.74-.02-1.11-.05-.59-.06-1.18-.13-1.76-.22-.9-.14-1.79-.29-2.67-.52-.55-.14-1.1-.28-1.64-.44-.4-.12-.79-.26-1.19-.4-.34-.12-.68-.22-1.01-.36-.44-.19-.87-.38-1.31-.57-.41-.18-.82-.36-1.23-.54-.62-.27-1.23-.56-1.84-.84-.61-.28-1.21-.56-1.82-.85-.62-.29-1.24-.57-1.85-.85-.6-.28-1.2-.56-1.8-.84-.62-.29-1.25-.57-1.87-.86-.6-.28-1.19-.55-1.79-.83-.61-.28-1.22-.56-1.82-.84-.61-.28-1.21-.57-1.82-.85-.61-.28-1.23-.56-1.84-.84-.62-.28-1.23-.57-1.85-.86-.48-.22-.95-.44-1.43-.65-.36-.16-.73-.3-1.09-.44-.29-.11-.58-.21-.88-.31-.26-.09-.51-.19-.78-.27-.56-.16-1.13-.32-1.7-.45-.45-.11-.9-.19-1.35-.28-.37-.07-.75-.15-1.12-.21-.28-.05-.57-.07-.85-.11-.31-.04-.63-.09-.94-.11-.46-.04-.93-.06-1.39-.08-.34-.02-.68-.02-1.02-.03-.18,0-.36,0-.54,0-.38,0-.75-.01-1.13,0-.61.03-1.22.07-1.83.14-.63.07-1.25.18-1.88.27-.2.03-.4.07-.6.12-.3.06-.6.13-.89.2-.33.07-.65.14-.98.23-.59.16-1.17.35-1.75.51-.27.08-.52-.04-.63-.27-.12-.24-.06-.5.17-.67.29-.21.59-.42.89-.63.34-.24.68-.47,1.01-.7.47-.33.93-.66,1.4-.99.34-.24.68-.47,1.01-.7.55-.39,1.1-.78,1.65-1.17.55-.38,1.09-.76,1.64-1.15.55-.38,1.09-.77,1.63-1.16.55-.39,1.1-.78,1.65-1.16.65-.44,1.29-.88,1.96-1.29.65-.39,1.32-.75,1.99-1.09.55-.28,1.1-.55,1.67-.79,1.36-.56,2.74-1.05,4.16-1.41.55-.14,1.09-.29,1.64-.38,1.04-.18,2.09-.39,3.19-.43.38-.03.81-.1,1.24-.11.79-.01,1.59-.06,2.39,0,.46.03.93.03,1.4.08.64.06,1.27.12,1.9.22.89.14,1.78.29,2.65.53.57.15,1.15.29,1.71.47.75.24,1.49.51,2.23.79.39.15.77.32,1.16.48.1.05.21.09.32.13.63.28,1.26.58,1.89.87.59.27,1.17.54,1.76.81.62.29,1.24.57,1.85.86.52.24,1.03.47,1.55.71.61.28,1.21.57,1.82.85.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.46.22.92.46,1.38.66.63.28,1.26.55,1.89.81.32.13.65.23.98.34.38.13.76.29,1.15.4.62.18,1.24.34,1.86.49.39.1.78.16,1.17.24.3.06.6.13.91.18.54.08,1.09.14,1.63.2.15.02.3.04.44.05.37.02.75.04,1.13.06.26.02.52.04.79.05.42,0,.85-.02,1.27-.01.6,0,1.21-.04,1.81-.09.49-.04.99-.1,1.48-.16.82-.11,1.64-.22,2.45-.43.37-.09.75-.15,1.12-.25.64-.17,1.28-.37,1.93-.55.04-.01.09-.02.14-.02.24.02.42.16.48.37.06.23-.01.45-.22.6Z";
const svgTextPath = "m119.67,8.06c-7.54,3.59-12.67,7.32-27.44,8.01-16.45.77-25.71-4.5-32.34-7.85-7.56-3.55-12.7-7.29-27.47-7.91C15.97-.38,6.73,4.93.11,8.31";
const svgTextPathInverted = "m119.67,8.31c-6.61-3.38-15.85-8.69-32.31-8-14.77.62-19.91,4.36-27.47,7.91-6.63,3.35-15.89,8.62-32.34,7.85C12.78,15.39,7.65,11.65.11,8.06";

const bigLabels = ['P6', 'D10'];

const Wave = ({ index, resetState, mode, styles, handlers, refs }) => {
    const {
        colors,
        isExplanationPage,
        savedComponents,
        allComponents,
        opacityCounter,
    } = useContext(StateContext);
      
    const handleClick = (index) => {
        // Common click logic here
    };

    const handleMouseEnter = (e, index) => {
        // Common mouse enter logic here
    };

    const handleMouseLeave = (index) => {
        // Common mouse leave logic here
    };

    // Memoize handleKeyDown to avoid creating a new reference on each render
    const handleKeyDown = useCallback((e) => {
      if (e.key === 'Escape') {
        setHoveredId(null);
        setSelectedComponents([]);
        setTooltipPos({ x: 0, y: 0 });
        setTooltipVisible(false);
        setTooltipText('');

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

    /*
    specificStyles = {
        shapeLeft: null,
        shapeTop: null,
        pathRef: null,
        textLeft: null,
        textTop: null,
    };
    specificHandlers = {
        handleClick
        handleMouseEnter
        handleMouseLeave
        handleDragStart
        handleDragStop
    };

    refs = {
        shapeRef
    }

    */

    return (
        <>
            {/* Shape */}
            <div
              style={{
                ...buttonStyle,
                left: `${styles.shapeLeft}px`, // Adjust position for button size
                top: `${styles.shapeTop}px`,
                transform: `rotate(${c.angle}rad) ${c.type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
                zIndex: 1 // Layer filled shapes at the base
              }}
              onClick={() => handlers.handleClick()}
              onMouseEnter={(e) => handlers.handleMouseEnter(e)}
              onMouseLeave={() => handlers.handleMouseLeave()}
            >
              <svg viewBox="-5 0 100 20" width={waveWidth} height={waveHeight} style={{ pointerEvents: 'none' }}>
                <path 
                    ref={refs.shapeRef}
                    d={svgPath} 
                    fill={getWaveFill(mode, colors, c)}  // Use the gradient fill
                    stroke="none" 
                    style={{ pointerEvents: 'all' }}
                    transition="opacity 1s ease"
                    opacity={getWaveOpacity(mode, selectedComponents, currentComponent, hoveredId, c, opacityCounter, allComponents)} // Change opacity on hover
                />
              </svg>
            </div>
  
            {/* Outline Shape */}
            <div
              style={{
                ...buttonStyle,
                left: `${styles.shapeLeft}px`,
                top: `${styles.shapeTop}px`,
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
                left: `${styles.textLeft}px`, // Adjust position for button size
                top: `${styles.textTop}px`,
                transform: isFlipped(c.code) ? `rotate(${c.angle + Math.PI}rad)` : `rotate(${c.angle}rad)`,
                opacity: getWaveOpacity(mode, selectedComponents, currentComponent, hoveredId, c, opacityCounter, allComponents), // Change opacity on hover
                zIndex: 10,
                pointerEvents: 'none', // Disable pointer events for the inner div
                userSelect: 'none'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  left: isFlipped(c.code) 
                    ? (c.type === 'Principle' ? '6.5px' : '6.5px') 
                    : (c.type === 'Principle' ? '-6.5px' : '-6.5px'), 
                  top: isFlipped(c.code) 
                    ? (c.type === 'Principle' ? '6px' : '-2px') 
                    : (c.type === 'Principle' ? '-2px' : '6px'),
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              >
                <svg viewBox="0 0 119.78 16.4" width={waveWidth * 0.83} height={waveHeight} style={{ pointerEvents: 'none' }}>
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
                      id={`text-path-${index}`} 
                      d={c.type === "Principle" ? svgTextPathInverted : svgTextPath } 
                      style={{ 
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }} 
                    />
                  </defs>
  
                  {/* Text on Path */}
                  <text
                    fill={getTextFill(mode, colors, c)}
                    fontSize="8px"
                    letterSpacing={getLabelWidth(c.label) > 10 ? "0.5px" : "0.9px"}
                    dy={bigLabels.includes(c.code) ? '-0.11em' : '0.35em'} // Adjust this to center the text vertically on the path
                    style={{ pointerEvents: 'none' }} // Ensure text doesn't interfere
                    >
                    <textPath
                      href={`#text-path-${index}`}
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
                      fill={getTextFill(mode, colors, c)}
                      fontSize="8px"
                      letterSpacing={getLabelWidth(c.label) > 10 ? "0.5px" : "0.9px"}
                      dy="0.84em" // Adjust this to center the text vertically on the path
                      style={{ 
                        pointerEvents: 'none', 
                        userSelect: 'none'
                      }} // Ensure text doesn't interfere
                    >
                      <textPath
                        href={`#text-path-${index}`}
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
        </>
    );
};

const getWaveFill = (mode, colors, component) => {
  // Analyse
  if(mode.startsWith("analyse"))
      return "transparent";
  return colors['Wave'][component.type];
}

const getTextFill = (mode, colors, component) => {
  // Analyse
  if(mode.startsWith("analyse")) 
        return colors['Wave'][component.type];
  return colors['Label'][component.type];
}

const getStroke = (mode, colors, selectedComponents, component) => {
  // Get Started
  if(mode === "get-inspired" || mode === "get-inspired-search" || mode.startsWith("get-started"))
    if(selectedComponents.includes(component.code)) 
      return colors['Selection'];

  // Analyse
  if(mode.startsWith("analyse"))
    return colors['Wave'][component.type];
  return 'none';
};

const getStrokeWidth = (mode) => {
  if(mode.startsWith("analyse"))
    return "0.6px";
  return "1.5px";
};

const getWaveOpacity = (mode, selectedComponents, currentComponent, hoveredId, component, opacityCounter, allComponents) => {
  // Intro
  if (mode === "intro-0")
    return 0.3;
  else if (mode === "intro-1" || mode === "intro-2" || mode === "intro-3") 
    return 0.15;
  else if (mode === "intro-4" || mode === "intro-5") 
    if(component.type === "Principle") 
      if(allComponents.indexOf(component.code) <= opacityCounter['Principle'])
        return 1;
      else
        return 0.15;
    else 
      return 0.15;
  else if (mode === "intro-6" || mode === "intro-7") 
    if(component.type === "Principle")
      return 0.55;
    else if(component.type === "Perspective")
      if(allComponents.indexOf(component.code) <= opacityCounter['Perspective']+7)
        return 1;
      else
        return 0.15;
    else
      return 0.15;
  else if (mode === "intro-8" || mode === "intro-9") 
    if(component.type === "Principle")
      return 0.55;
    else if(component.type === "Perspective")
      return 0.55;
    else 
      if(allComponents.indexOf(component.code) <= opacityCounter['Dimension']+14)
        return 1;
      else
        return 0.15;
 
  // Learn
  if(mode === "learn") {
    if(selectedComponents.length === 0)
      return 1;
    if(selectedComponents === component.code)
      return 1;
    else if(hoveredId === component.code) 
      return 0.8;
    else
      return 0.3;
  }
  // Get Started
  if(mode === "get-started") {
    if(selectedComponents.length === 0) 
      return 1;
    if (selectedComponents.includes(component.code)) 
      return 1;
    if (hoveredId === component.code) 
        return 0.8;
    return 0.3;
  }
  if(mode === "get-started-search") {
    if(currentComponent === component.code)
      return 1;
    else if(hoveredId === component.code) 
      return 0.8;
    else
      return 0.2;
  }

  // Get Inspired
  if(mode === "get-inspired") {
    if(selectedComponents.length === 0) 
      return 1;
    if (selectedComponents.includes(component.code)) 
      return 1;
    if (hoveredId === component.code) 
        return 0.8;
    return 0.3;
  }
  if(mode === "get-inspired-carousel" || mode === "get-inspired-search") {
    if(currentComponent.includes(component.code))
      return 1;
    else if(hoveredId === component.code) 
      return 0.8;
    else
      return 0.2;
  }

  // Contribute
  if(mode === "contribute") {
    if(selectedComponents.length === 0) 
      return 1;
    if (selectedComponents.includes(component.code)) 
      return 1;
    if (hoveredId === component.code) 
        return 0.8;
    return 0.3;
  }

  // Analyse    
  if(mode.startsWith("analyse")) 
      return 1;
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
  // Intro
  if (mode === "intro-0" || mode === "intro-1" || mode === "intro-2" || mode === "intro-3") 
    return "";
  else if (mode === "intro-4" || mode === "intro-5") {
    if(type !== "Principle")
        return "";
  }
  else if (mode === "intro-6" || mode === "intro-7") {
    if(type === "Dimension") {
      return "";
    }
  }
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

export default Wave;
