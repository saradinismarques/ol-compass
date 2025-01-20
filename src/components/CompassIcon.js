import React, { useContext, useState, useEffect } from 'react';
import { StateContext } from "../State.js";
import { encodedFonts } from '../assets/fonts/Fonts.js';
import Wave, { getComponentsPositions } from "./Wave.js"

const CompassIcon = ({ mode, currentType }) => {
  // Size and screen resize handler
  const [size, setSize] = useState(window.innerHeight/8.11);
  
  useEffect(() => {
    // Function to update height on window resize
    const handleResize = () => {
      setSize(window.innerHeight/8.11);
    };
    // Add event listener for resize
    window.addEventListener('resize', handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Compass Type
  const compassType = "icon";
  
  // Global Variables
  const {colors} = useContext(StateContext);
  
  // Dictionary with all information
  const principles = getComponentsPositions(compassType, [], 'Principle', size);
  const perspectives = getComponentsPositions(compassType, [], 'Perspective', size);
  const dimensions = getComponentsPositions(compassType, [], 'Dimension', size);
  const components = principles.concat(perspectives, dimensions);

  // Function to determine the center 
  const getCenter = () => {
    return { x: window.innerWidth * 0.125 + window.innerHeight * 0.216/2, y: window.innerHeight * 0.21 };
  };

  const center = getCenter();

  // Styles
  let containerStyle;
  if(mode.startsWith('analyse')) {
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
        left: `${center.x / window.innerWidth * 100}vw`, 
        top: `${center.y / window.innerHeight * 100}vh`,
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
                  src: url(data:font/ttf;base64,${encodedFonts['Manrope-Regular']}) format('truetype');
                }
              `}
            </style>
            <p
              style={{
                color: `${colors['Label'][currentType]}`,
                fontFamily: "Manrope", // Use Manrope font
                fontWeight: 400, // Medium weight for this text
                fontSize: "1.6vh",
                textTransform: "uppercase", // Converts text to uppercase
                letterSpacing: "0.3vh", // Increases the spacing between letters
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