import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { getGetStartedData, getLearnData, getConceptsData } from '../utils/Data.js'; 
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";

// Sizes and positions 
let size, bookmarkSize, bookmarkLeftP, bookmarkLeftPe, bookmarkLeftD, bookmarkTopP, bookmarkTopPe, bookmarkTopD;

if(window.innerHeight > 700) {
  size = 490;
  bookmarkSize = '16px';
  bookmarkLeftP = '40px';
  bookmarkLeftPe = '-26px';
  bookmarkLeftD = '-26px';
  bookmarkTopP = '19px';
  bookmarkTopPe = '10px';
  bookmarkTopD = '10px';
} else {
  size = 460;
  bookmarkSize = '15px';
  bookmarkLeftP = '40px';
  bookmarkLeftPe = '-26px';
  bookmarkLeftD = '-26px';
  bookmarkTopP = '17.5px';
  bookmarkTopPe = '9.5px';
  bookmarkTopD = '9.5px';
}

const waveWidth = size/2.6;
const waveHeight = waveWidth*3;

// SVG Path for button shape
const svgPath = "m82.54,14.01c-.44.31-.88.61-1.32.92-.54.38-1.09.77-1.63,1.16-.34.24-.69.48-1.03.72-.55.39-1.1.78-1.65,1.17-.55.38-1.09.76-1.64,1.15-.47.33-.93.66-1.4.99-.43.3-.86.6-1.29.9-.44.31-.89.62-1.34.93-.26.18-.51.35-.77.52-.29.19-.58.38-.88.56-.26.15-.52.29-.78.43-.36.19-.71.4-1.07.58-.62.3-1.24.59-1.87.86-.59.25-1.19.49-1.79.69-.95.31-1.91.63-2.9.83-.37.08-.74.18-1.12.25-.28.06-.57.09-.85.14-.38.06-.77.14-1.15.18-1.17.13-2.35.21-3.53.21-.19,0-.38,0-.57,0-.3,0-.6-.03-.9-.04-.37-.02-.74-.02-1.11-.05-.59-.06-1.18-.13-1.76-.22-.9-.14-1.79-.29-2.67-.52-.55-.14-1.1-.28-1.64-.44-.4-.12-.79-.26-1.19-.4-.34-.12-.68-.22-1.01-.36-.44-.19-.87-.38-1.31-.57-.41-.18-.82-.36-1.23-.54-.62-.27-1.23-.56-1.84-.84-.61-.28-1.21-.56-1.82-.85-.62-.29-1.24-.57-1.85-.85-.6-.28-1.2-.56-1.8-.84-.62-.29-1.25-.57-1.87-.86-.6-.28-1.19-.55-1.79-.83-.61-.28-1.22-.56-1.82-.84-.61-.28-1.21-.57-1.82-.85-.61-.28-1.23-.56-1.84-.84-.62-.28-1.23-.57-1.85-.86-.48-.22-.95-.44-1.43-.65-.36-.16-.73-.3-1.09-.44-.29-.11-.58-.21-.88-.31-.26-.09-.51-.19-.78-.27-.56-.16-1.13-.32-1.7-.45-.45-.11-.9-.19-1.35-.28-.37-.07-.75-.15-1.12-.21-.28-.05-.57-.07-.85-.11-.31-.04-.63-.09-.94-.11-.46-.04-.93-.06-1.39-.08-.34-.02-.68-.02-1.02-.03-.18,0-.36,0-.54,0-.38,0-.75-.01-1.13,0-.61.03-1.22.07-1.83.14-.63.07-1.25.18-1.88.27-.2.03-.4.07-.6.12-.3.06-.6.13-.89.2-.33.07-.65.14-.98.23-.59.16-1.17.35-1.75.51-.27.08-.52-.04-.63-.27-.12-.24-.06-.5.17-.67.29-.21.59-.42.89-.63.34-.24.68-.47,1.01-.7.47-.33.93-.66,1.4-.99.34-.24.68-.47,1.01-.7.55-.39,1.1-.78,1.65-1.17.55-.38,1.09-.76,1.64-1.15.55-.38,1.09-.77,1.63-1.16.55-.39,1.1-.78,1.65-1.16.65-.44,1.29-.88,1.96-1.29.65-.39,1.32-.75,1.99-1.09.55-.28,1.1-.55,1.67-.79,1.36-.56,2.74-1.05,4.16-1.41.55-.14,1.09-.29,1.64-.38,1.04-.18,2.09-.39,3.19-.43.38-.03.81-.1,1.24-.11.79-.01,1.59-.06,2.39,0,.46.03.93.03,1.4.08.64.06,1.27.12,1.9.22.89.14,1.78.29,2.65.53.57.15,1.15.29,1.71.47.75.24,1.49.51,2.23.79.39.15.77.32,1.16.48.1.05.21.09.32.13.63.28,1.26.58,1.89.87.59.27,1.17.54,1.76.81.62.29,1.24.57,1.85.86.52.24,1.03.47,1.55.71.61.28,1.21.57,1.82.85.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.46.22.92.46,1.38.66.63.28,1.26.55,1.89.81.32.13.65.23.98.34.38.13.76.29,1.15.4.62.18,1.24.34,1.86.49.39.1.78.16,1.17.24.3.06.6.13.91.18.54.08,1.09.14,1.63.2.15.02.3.04.44.05.37.02.75.04,1.13.06.26.02.52.04.79.05.42,0,.85-.02,1.27-.01.6,0,1.21-.04,1.81-.09.49-.04.99-.1,1.48-.16.82-.11,1.64-.22,2.45-.43.37-.09.75-.15,1.12-.25.64-.17,1.28-.37,1.93-.55.04-.01.09-.02.14-.02.24.02.42.16.48.37.06.23-.01.45-.22.6Z";
const svgTextPath = "m119.67,8.06c-7.54,3.59-12.67,7.32-27.44,8.01-16.45.77-25.71-4.5-32.34-7.85-7.56-3.55-12.7-7.29-27.47-7.91C15.97-.38,6.73,4.93.11,8.31";
const svgTextPathInverted = "m119.67,8.31c-6.61-3.38-15.85-8.69-32.31-8-14.77.62-19.91,4.36-27.47,7.91-6.63,3.35-15.89,8.62-32.34,7.85C12.78,15.39,7.65,11.65.11,8.06";

const bigLabels = ['P6', 'D10'];

const OLCompass = ({ mode, position, onButtonClick, resetState, resetCompass, selected, current }) => {
  const {
    colors,
    isExplanationPage,
    savedComponents,
    allComponents,
    opacityCounter,
  } = useContext(StateContext);
  
  // Function to determine the center based on position
  const getCenter = (position) => {
    if (position === "center")
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.47 };
    else if (position === "center-2")
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.508 };
    else if (position === "left") 
      return { x: window.innerWidth * 0.4, y: window.innerHeight * 0.47 }; // Adjust y for better positioning
    else if (position === "left-2") 
      return { x: window.innerWidth * 0.25, y: window.innerHeight * 0.508 };
  };

  const center = getCenter(position);

  // Dictionary with all information
  let componentsData;

  if(mode.startsWith("get-started") || mode.startsWith("analyse")) 
    componentsData = getGetStartedData();
  else
    componentsData = getLearnData();

  const principles = getComponentsPositions(componentsData['Principle'], 'Principle');
  const perspectives = getComponentsPositions(componentsData['Perspective'], 'Perspective');
  const dimensions = getComponentsPositions(componentsData['Dimension'], 'Dimension');
  const components = principles.concat(perspectives, dimensions);
  const concepts = getConceptsData();

  // State of clicks and hovers
  const [hoveredId, setHoveredId] = useState(null);
   
  // Determine which components and setter to use based on mode
  const [selectedComponents, setSelectedComponents] = useState(selected || []);
  let currentComponent = current || null;

  // Tooltip
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  
  // Declare a timeout variable to store the reference to the timeout
  let tooltipTimeout = null;

  // Refs to update the state instantly
  const hoveredIdRef = useRef(hoveredId);
  
  useEffect(() => {
      hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  // Effect to handle reset
  useEffect(() => {
    if (resetCompass) {
      // Clear the selected buttons or reset the state
      setHoveredId(null);
      setSelectedComponents([]);
    }
  }, [resetCompass]);

  const handleClick = (id) => {
    if (mode.startsWith("intro") || mode === "default" || mode === "get-inspired-carousel" || mode.startsWith("analyse")) 
      return;
    
    if (mode === "learn") {
      // Check if the clicked ID is already in clickedIds
      if (selectedComponents === components[id].code) {
        // If it is, remove it and reset state
        setHoveredId(null);
        setSelectedComponents([]);

        if (onButtonClick) {
          onButtonClick(null);
        }

      } else {
        const title = convertLabel(components[id].code);
        let correspondingConcepts = null;
        
        if (components[id].type === "Principle") {
          correspondingConcepts = getCorrespondingConcepts(concepts, components[id].code);
        }
        setSelectedComponents(components[id].code);

        if (onButtonClick) {
          onButtonClick(
            components[id].code,
            title,
            components[id].headline,
            components[id].paragraph,
            components[id].type,
            correspondingConcepts
          );
        }

      }
    } else if(mode.startsWith("get-started")) {
      const title = convertLabel(components[id].code);

      setSelectedComponents(prevComponents =>
        prevComponents.includes(components[id].code)
          ? prevComponents.filter(buttonId => buttonId !== components[id].code) // Remove ID if already clicked
          : [...prevComponents, components[id].code] // Add ID if not already clicked
      );
      
      if (onButtonClick) {
        onButtonClick(
          components[id].code,
          title,
          components[id].headline,
          components[id].type,
        );
      }
    } else if(mode === "get-inspired" || mode === "get-inspired-search") {
      setSelectedComponents(prevComponents => {
        const newComponents = prevComponents.includes(components[id].code)
          ? prevComponents.filter(buttonId => buttonId !== components[id].code) // Remove ID if already clicked
          : [...prevComponents, components[id].code]; // Add ID if not already clicked
        
        // Return the updated state
        return newComponents;
      });
      
      if (onButtonClick) onButtonClick(components[id].code);
    } else if(mode === "contribute") {
      setSelectedComponents(prevComponents => {
        const newComponents = prevComponents.includes(components[id].code)
          ? prevComponents.filter(buttonId => buttonId !== components[id].code) // Remove ID if already clicked
          : [...prevComponents, components[id].code]; // Add ID if not already clicked
        
        // Return the updated state
        return newComponents;
      });
      
      if (onButtonClick) onButtonClick(components[id].code);
    } 
  };
  
  const handleMouseEnter = (e, id) => {
    if (mode.startsWith("intro") || mode === "default" || mode.startsWith("analyse")) 
      return;

    setHoveredId(components[id].code);
    hoveredIdRef.current = components[id].code; 

    if(mode.startsWith("get-started"))
      return;

    if(components[id].type === "Principle") {
      // Clear any existing timeout to avoid overlaps
      clearTimeout(tooltipTimeout);

      // Set a timeout to delay the appearance of the tooltip by 1 second
      tooltipTimeout = setTimeout(() => {
        if (hoveredIdRef.current === components[id].code) {  // Check if the tooltip was not cancelled
          setTooltipPos({ x: e.clientX, y: e.clientY });
          let cleanedText = components[id].tooltip.replace('<br>', '');
          setTooltipText(cleanedText);
          setTooltipVisible(true);
        }
      }, 500); // 1-second delay
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);

    if(mode.startsWith("get-started"))
      return;

    // Clear the tooltip timeout to prevent it from showing if mouse leaves
    clearTimeout(tooltipTimeout);

    if(mode === "learn" || mode === "contribute" || mode === "get-inspired" || mode === "get-started"  || mode === "get-started-search") {
      // Set the cancellation flag to prevent tooltip from showing
      setTooltipVisible(false);
      setTooltipText(""); // Clear the tooltip text
    }
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

  
  let containerStyle = {
      position: 'fixed',   // Fixed position to stay in the specified location
      top: '0',            // Reset top for positioning
      left: '0',           // Reset left for positioning
      transform: `translate(-50%, -50%)`, // Centered offset
      borderRadius: '50%', // To make it a circular background if desired
      width: `${size}px`,
      height: `${size}px`,
    };

  const buttonStyle = {
    position: 'absolute',
    cursor: (mode.startsWith("intro") || mode === "default" || mode.startsWith("analyse")) ? 'default' : 'pointer',
    pointerEvents: 'none', // Ensure buttons are clickable
  };

  const Tooltip = ({ text, position }) => (
    <div
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -110%)', // Adjusts the position above the button
        zIndex: 1000,
        backgroundColor: '#acaaaa', // Tooltip background color
        color: 'white', // Tooltip text color
        padding: '10px', // Padding inside the tooltip
        borderRadius: '5px', // Rounded corners
        fontFamily: 'Manrope',
        fontSize: '15px',
        width: `${text.length * 4.2}px`, // Dynamic width based on text length
        pointerEvents: 'none', // Prevents tooltip from interfering with hover
        opacity: 0.9
      }}
    >
      {text}
      {/* Tooltip pointer */}
      <div
        style={{
          position: 'fixed',
          top: '100%', // Positions pointer below the tooltip box
          left: '50%',
          marginLeft: '-5px', // Centers the pointer
          width: '0',
          height: '0',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '10px solid #acaaaa', // Matches tooltip background
          opacity: 0.9
        }}
      />
    </div>
  );

  const Bookmark = ({ component }) => (
    <div
      style={{
        position: 'absolute',
        left: `${component.x-8}px`, // Adjust position for button size
        top: `${component.y-8-2}px`,
        transform: `rotate(${component.angle + Math.PI}rad)`,
        zIndex: 20
      }}
    >
      <div
        style={{
          position: 'relative',
          left: `${component.type === "Principle" 
            ? bookmarkLeftP 
            : component.type === "Perspective" 
              ? bookmarkLeftPe  // Add your condition for 'dimension' here
              : bookmarkLeftD }`,
          top: `${component.type === "Principle" 
            ? bookmarkTopP 
            : component.type === "Perspective" 
              ? bookmarkTopPe  // Add your condition for 'dimension' here
              : bookmarkTopD }`,
          transform: `${component.type === "Principle" ? `rotate(${-Math.PI * 0.14}rad)` : `rotate(${-Math.PI * 0.11 + Math.PI/4}rad)` }`
        }}  
      >
        <BookmarkIcon
          style={{
            width: bookmarkSize ,
            height: bookmarkSize,
            fill: colors['Selection'],
            stroke: 'none'
          }}
        />
      </div>
    </div>
  );

  return (
    <>       
      <div 
        style={{
          ...containerStyle, 
          left: `${center.x / window.innerWidth * 100}vw`, 
          top: `${center.y / window.innerHeight * 100}vh`,
        }}
      >
        {components.map((c, i) => (
          <div key={i}>
            {/* Shape */}
            <div
              style={{
                ...buttonStyle,
                left: `${c.x - waveWidth / 2}px`, // Adjust position for button size
                top: `${c.y - waveHeight / 2 - 2}px`,
                transform: `rotate(${c.angle}rad) ${c.type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
                zIndex: 1 // Layer filled shapes at the base
              }}
              onClick={() => handleClick(i)}
              onMouseEnter={(e) => handleMouseEnter(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}

            >
              <svg viewBox="-5 0 100 20" width={waveWidth} height={waveHeight} style={{ pointerEvents: 'none' }}>
                <path 
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
                left: `${c.x - waveWidth / 2}px`,
                top: `${c.y - waveHeight / 2 - 2}px`,
                transform: `rotate(${c.angle}rad) ${c.type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
                position: 'absolute', // Consistent positioning
                zIndex: 30 // Ensures outlines are rendered on top of filled shapes
              }}
              onClick={() => handleClick(i)}
              onMouseEnter={(e) => handleMouseEnter(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
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
                left: `${c.x - (waveWidth * 0.83) / 2}px`, // Adjust position for button size
                top: `${c.y - waveHeight / 2 - 2}px`,
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
                    fill={getTextFill(mode, colors, c)}
                    fontFamily="Manrope"
                    fontWeight={500}
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
                      fill={getTextFill(mode, colors, c)}
                      fontFamily="Manrope"
                      fontWeight={500}
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
  
            {/* Bookmark */}
            {mode === "learn" && !isExplanationPage && savedComponents.includes(c.code) &&
              <Bookmark component={c} />
            }
          </div>
        ))}
      </div>
  
      {(mode === "learn" || mode === "contribute" || mode.startsWith("get-inspired")) && tooltipVisible && 
        <Tooltip 
          text={tooltipText} 
          position={tooltipPos} 
        />
      }
  
    </>
  );
} 

function getComponentsPositions(componentsData, type) {
  const centerX = size/2;
  const centerY = size/2;
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

    componentsData[i]["x"] = x;
    componentsData[i]["y"] = y;
    componentsData[i]["angle"] = angle;
  }
  return componentsData;
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

function convertLabel(label) {
  // Define a mapping of prefixes to their corresponding full names
  const prefixMap = {
      "D": "Dimension",
      "Pe": "Perspective",
      "P": "Principle"
  };  

  // Use a regular expression to capture the prefix and the number
  const regex = /^([A-Za-z]+)(\d+)$/;
  const match = label.match(regex);

  if (match) {
      const prefix = match[1];
      const number = match[2];

      // Find the corresponding full name for the prefix
      const fullName = prefixMap[prefix];

      if (fullName) {
          return `${fullName} ${number}`;
      }
  }

  // If the label doesn't match the expected pattern, return it unchanged
  return label;
}

function getCorrespondingConcepts(concepts, code) {
  // Extract the number from the given tag (e.g. P1 -> 1, P2 -> 2)
  const codeNumber = code.slice(1);

  // Filter the array by matching the number in the `#code` (e.g., C1.a, C1.b... for P1)
  return concepts.filter(c => c.code.startsWith(`C${codeNumber}.`));
}


export default OLCompass;
