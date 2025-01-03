import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { getGetStartedData, getLearnData, getConceptsData } from '../utils/Data.js'; 
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import Wave from "./Wave.js"
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
            <Wave 
                component={c}
                index={i}
                resetState={resetState}
                mode={mode}
                styles={{
                    shapeLeft: c.x - waveWidth / 2,
                    shapeTop: c.y - waveHeight / 2 - 2,
                    pathRef: null,
                    textLeft: c.x - (waveWidth * 0.83) / 2,
                    textTop: c.y - waveHeight / 2 - 2,
                }}
            />
  
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
