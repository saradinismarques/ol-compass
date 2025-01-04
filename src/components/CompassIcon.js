import React, { useContext } from 'react';
import { StateContext } from "../State.js";
import { encodedFonts } from '../assets/fonts/Fonts.js';
import Wave from "./Wave.js"

// Sizes and positions 
let size = 90;

const CompassIcon = ({ mode, currentType }) => {
  const {colors} = useContext(StateContext);
  
  // Dictionary with all information
  const principles = getComponentsPositions('Principle');
  const perspectives = getComponentsPositions('Perspective');
  const dimensions = getComponentsPositions('Dimension');
  const components = principles.concat(perspectives, dimensions);

  // Container styles for the circle menu
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

function getComponentsPositions(type) {
  const centerX = size/2;
  const centerY = size/2;
  let radius, numberOfComponents;
  let componentsData = [];

  if(type === 'Principle') {
    radius = size/6.9;
    numberOfComponents = 7;
  } else if(type === 'Perspective') {
    radius = size/3.1;
    numberOfComponents = 7;
  } else if(type === 'Dimension') {
    radius = size/2.075;
    numberOfComponents = 10;
  }

  const angleStep = (2 * Math.PI) / numberOfComponents;
  let startAngle
  if(type === 'Principle')
    startAngle = -Math.PI/1.6;
  else
    startAngle = -Math.PI/2;

  for (let i = 0; i < numberOfComponents; i++) {
    let angle = i * angleStep + startAngle;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    if(type === 'Principle')
      angle = angle + 2*Math.PI / 2 - Math.PI*0.03;
    else if(type === 'Perspective')
      angle = angle + Math.PI / 2 - Math.PI*0.01;
    else if(type === 'Dimension')
      angle = angle + Math.PI / 2 - Math.PI*0.005;
    
     // Add an object to the array
     componentsData.push({
        type: type,
        x: x,
        y: y,
        angle: angle
      });
  }
  return componentsData;
};

export default CompassIcon;