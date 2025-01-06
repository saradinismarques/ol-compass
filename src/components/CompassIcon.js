import React, { useContext } from 'react';
import { StateContext } from "../State.js";
import { encodedFonts } from '../assets/fonts/Fonts.js';
import Wave, { getComponentsPositions } from "./Wave.js"

// Sizes and positions 
let size = 90;

const CompassIcon = ({ mode, currentType }) => {
  // Compass Type
  const compassType = "icon";
  
  // Global Variables
  const {colors} = useContext(StateContext);
  
  // Dictionary with all information
  const principles = getComponentsPositions(compassType, [], 'Principle', size);
  const perspectives = getComponentsPositions(compassType,[], 'Perspective', size);
  const dimensions = getComponentsPositions(compassType, [], 'Dimension', size);
  const components = principles.concat(perspectives, dimensions);

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
        left: '16.5vw', 
        top: '21vh', 
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
                fontSize: "11px",
                textTransform: "uppercase", // Converts text to uppercase
                letterSpacing: "2px", // Increases the spacing between letters
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