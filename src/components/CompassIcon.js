import React, { useContext, useState, useEffect } from 'react';
import { StateContext } from "../State.js";
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { getTypeTooltip } from '../utils/DataExtraction.js';
import Wave, { getComponents } from "./Wave.js"

const CompassIcon = ({ mode, currentType }) => {
  // Global Variables  
  const {
    colors,
    language
  } = useContext(StateContext);
      
  // Size and screen resize handler
  const initialSize = mode === "map" ? 90 : window.innerHeight / 8.11;
  const [size, setSize] = useState(initialSize);
  const typeTooltips = getTypeTooltip(language);
  
  // Tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  
  useEffect(() => {
    // Function to update height on window resize
    const handleResize = () => {
      if(mode === "map")
        setSize(initialSize);
    };
    // Add event listener for resize
    window.addEventListener('resize', handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialSize, mode]);
  
  // Compass Type
  const compassType = "icon";
  
  const components = getComponents(language, mode, compassType, size);
  
  const handleMouseEnter = () => {
    if (mode === "map") 
      return;
    if(currentType === null)
      return
    setTooltipText(typeTooltips[currentType]);
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    if(mode === "map")
      return;
    if(currentType === null)
      return
    // Set the cancellation flag to prevent tooltip from showing
    setTooltipVisible(false);
    setTooltipText(""); // Clear the tooltip text
  };

  // Function to determine the center 
  const getCenter = () => {
    if(mode === "map")
      return { x: 730 * 0.165 , y: 1536 * 0.121 };
    else if(mode === "get-started")
      return { x: window.innerWidth * 0.125 + window.innerHeight * 0.216/2, y: window.innerHeight * 0.21 };
    else if(mode === "get-started-search")
      return { x: window.innerWidth * 0.105 + window.innerHeight * 0.049/2, y: window.innerHeight * 0.21 };
    else if(mode === "learn-2")
      return { x: window.innerWidth * 0.11 + window.innerHeight * 0.195/2, y: window.innerHeight * 0.205 };
  };

  const center = getCenter();

  // Styles
  let containerStyle;
  if(mode === "map") {
    // Container styles for the circle menu
    containerStyle = {
      height: 200,
      width: 200,
    };
  } else {
    containerStyle = {
      position: 'fixed',   // Fixed position to stay in the specified location
      top: '0',            // Reset top for positioning
      left: '0',           // Reset left for positioning
      transform: `translate(-50%, -50%)`, // Centered offset
      borderRadius: '50%', // To make it a circular background if desired
      width: `${size}px`,
      height: `${size}px`,
    };
  }

  // Other Components
  const Tooltip = ({ text }) => (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: colors['Gray Hover'], // Tooltip background color
        color: 'white', // Tooltip text color
        padding: '1vh', // Padding inside the tooltip
        borderRadius: '0.5vh', // Rounded corners
        fontFamily: 'Manrope',
        fontWeight: '500',
        fontSize: '1.8vh',
        width: '25vh', // Dynamic width based on text length
        pointerEvents: 'none', // Prevents tooltip from interfering with hover
        opacity: 0.95,
        textAlign: 'center'
      }}
    >
      {text}
    </div>
  );

  const getCurrentType = () => {
    if(currentType === "Principle")
      return language === "pt" ? "Princípios" : "Principles";
    else if(currentType === "Perspective")
      return language === "pt" ? "Perspectivas" : "Perspectives";
    else if(currentType === "Dimension")
      return language === "pt" ? "Dimensões" : "Dimensions";
  }

  return (
    <div 
      style={{
        ...containerStyle, 
        left: `${center.x}px`, 
        top: `${center.y}px`,
      }}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      {components.map((component, id) => (
        <div key={id}>
          <Wave 
              compassType={'icon'}
              component={component}
              currentType={currentType}
              size={size}
              mode={mode}
              waveRef={null}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',            // Reset top for positioning
              left: '50%',            // Reset top for positioning
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: '10',
            }}
          >
            <style>
              {`
                @font-face {
                  font-family: 'Manrope';
                  src: url(data:font/ttf;base64,${encodedFonts['Manrope-400']}) format('truetype');
                }
              `}
            </style>
            <p
              style={{
                color: `${colors['Label'][currentType]}`,
                fontFamily: "Manrope", // Use Manrope font
                fontWeight: 400, // Medium weight for this text
                fontSize: `${mode === "map" ? "11px" : "1.6vh"}`,
                textTransform: "uppercase", // Converts text to uppercase
                letterSpacing: `${mode === "map" ? "1.5px" : "0.3vh"}`, // Increases the spacing between letters
              }}
            >
              {getCurrentType()}
            </p>
          </div>
        </div>
      ))}
      {mode !== "map" && tooltipVisible &&
        <Tooltip 
          text={tooltipText} 
        />
      }
    </div>
  ); 
};

export default CompassIcon;