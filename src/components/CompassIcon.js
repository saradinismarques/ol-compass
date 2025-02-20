import React, { useContext, useState, useEffect } from 'react';
import { StateContext } from "../State.js";
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { getComponentsData } from '../utils/DataExtraction.js'; 
import Wave, { getComponentsPositions } from "./Wave.js"

const CompassIcon = ({ mode, currentType }) => {
  // Size and screen resize handler
  const initialSize = mode === "map" ? 90 : window.innerHeight / 8.11;
  const [size, setSize] = useState(initialSize);
  
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
  
  // Global Variables  
  const {
    colors,
  } = useContext(StateContext);
      
  let componentsData = getComponentsData('default');

  // Dictionary with all information
  const principles = getComponentsPositions(compassType, componentsData, 'Principle', size);
  const perspectives = getComponentsPositions(compassType, componentsData, 'Perspective', size);
  const dimensions = getComponentsPositions(compassType, componentsData, 'Dimension', size);
  const components = principles.concat(perspectives, dimensions);
  
  // Function to determine the center 
  const getCenter = () => {
    if(mode === "map")
      return { x: 730 * 0.165 , y: 1536 * 0.121 };
    else if(mode === "get-started")
      return { x: window.innerWidth * 0.125 + window.innerHeight * 0.216/2, y: window.innerHeight * 0.21 };
    else if(mode === "get-started-search")
      return { x: window.innerWidth * 0.105 + window.innerHeight * 0.049/2, y: window.innerHeight * 0.21 };
    else if(mode === "learn-2")
      return { x: window.innerWidth * 0.125 + window.innerHeight * 0.216/2, y: window.innerHeight * 0.21 };
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
      height: `${size}px`
    };
  }

  return (
    <div 
      style={{
        ...containerStyle, 
        left: `${center.x}px`, 
        top: `${center.y}px`,
      }}
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
                  src: url(data:font/ttf;base64,${encodedFonts['Manrope-Light']}) format('truetype');
                }
              `}
            </style>
            <p
              style={{
                color: `${colors['Label'][currentType]}`,
                fontFamily: "Manrope", // Use Manrope font
                fontWeight: 300, // Medium weight for this text
                fontSize: `${mode === "map" ? "11px" : "1.6vh"}`,
                textTransform: "uppercase", // Converts text to uppercase
                letterSpacing: `${mode === "map" ? "2px" : "0.3vh"}`, // Increases the spacing between letters
              }}
            >
              {`${currentType}s`}
            </p>
          </div>
        </div>
      ))}
    </div>
  ); 
};

export default CompassIcon;