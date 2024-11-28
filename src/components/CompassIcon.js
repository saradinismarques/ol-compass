import React from 'react';
import '../styles/App.css'

// Sizes and positions 
let size = 90;

const waveWidth = size/2.6;
const waveHeight = waveWidth*3;

// SVG Path for button shape
const svgPath = "m82.54,14.01c-.44.31-.88.61-1.32.92-.54.38-1.09.77-1.63,1.16-.34.24-.69.48-1.03.72-.55.39-1.1.78-1.65,1.17-.55.38-1.09.76-1.64,1.15-.47.33-.93.66-1.4.99-.43.3-.86.6-1.29.9-.44.31-.89.62-1.34.93-.26.18-.51.35-.77.52-.29.19-.58.38-.88.56-.26.15-.52.29-.78.43-.36.19-.71.4-1.07.58-.62.3-1.24.59-1.87.86-.59.25-1.19.49-1.79.69-.95.31-1.91.63-2.9.83-.37.08-.74.18-1.12.25-.28.06-.57.09-.85.14-.38.06-.77.14-1.15.18-1.17.13-2.35.21-3.53.21-.19,0-.38,0-.57,0-.3,0-.6-.03-.9-.04-.37-.02-.74-.02-1.11-.05-.59-.06-1.18-.13-1.76-.22-.9-.14-1.79-.29-2.67-.52-.55-.14-1.1-.28-1.64-.44-.4-.12-.79-.26-1.19-.4-.34-.12-.68-.22-1.01-.36-.44-.19-.87-.38-1.31-.57-.41-.18-.82-.36-1.23-.54-.62-.27-1.23-.56-1.84-.84-.61-.28-1.21-.56-1.82-.85-.62-.29-1.24-.57-1.85-.85-.6-.28-1.2-.56-1.8-.84-.62-.29-1.25-.57-1.87-.86-.6-.28-1.19-.55-1.79-.83-.61-.28-1.22-.56-1.82-.84-.61-.28-1.21-.57-1.82-.85-.61-.28-1.23-.56-1.84-.84-.62-.28-1.23-.57-1.85-.86-.48-.22-.95-.44-1.43-.65-.36-.16-.73-.3-1.09-.44-.29-.11-.58-.21-.88-.31-.26-.09-.51-.19-.78-.27-.56-.16-1.13-.32-1.7-.45-.45-.11-.9-.19-1.35-.28-.37-.07-.75-.15-1.12-.21-.28-.05-.57-.07-.85-.11-.31-.04-.63-.09-.94-.11-.46-.04-.93-.06-1.39-.08-.34-.02-.68-.02-1.02-.03-.18,0-.36,0-.54,0-.38,0-.75-.01-1.13,0-.61.03-1.22.07-1.83.14-.63.07-1.25.18-1.88.27-.2.03-.4.07-.6.12-.3.06-.6.13-.89.2-.33.07-.65.14-.98.23-.59.16-1.17.35-1.75.51-.27.08-.52-.04-.63-.27-.12-.24-.06-.5.17-.67.29-.21.59-.42.89-.63.34-.24.68-.47,1.01-.7.47-.33.93-.66,1.4-.99.34-.24.68-.47,1.01-.7.55-.39,1.1-.78,1.65-1.17.55-.38,1.09-.76,1.64-1.15.55-.38,1.09-.77,1.63-1.16.55-.39,1.1-.78,1.65-1.16.65-.44,1.29-.88,1.96-1.29.65-.39,1.32-.75,1.99-1.09.55-.28,1.1-.55,1.67-.79,1.36-.56,2.74-1.05,4.16-1.41.55-.14,1.09-.29,1.64-.38,1.04-.18,2.09-.39,3.19-.43.38-.03.81-.1,1.24-.11.79-.01,1.59-.06,2.39,0,.46.03.93.03,1.4.08.64.06,1.27.12,1.9.22.89.14,1.78.29,2.65.53.57.15,1.15.29,1.71.47.75.24,1.49.51,2.23.79.39.15.77.32,1.16.48.1.05.21.09.32.13.63.28,1.26.58,1.89.87.59.27,1.17.54,1.76.81.62.29,1.24.57,1.85.86.52.24,1.03.47,1.55.71.61.28,1.21.57,1.82.85.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.46.22.92.46,1.38.66.63.28,1.26.55,1.89.81.32.13.65.23.98.34.38.13.76.29,1.15.4.62.18,1.24.34,1.86.49.39.1.78.16,1.17.24.3.06.6.13.91.18.54.08,1.09.14,1.63.2.15.02.3.04.44.05.37.02.75.04,1.13.06.26.02.52.04.79.05.42,0,.85-.02,1.27-.01.6,0,1.21-.04,1.81-.09.49-.04.99-.1,1.48-.16.82-.11,1.64-.22,2.45-.43.37-.09.75-.15,1.12-.25.64-.17,1.28-.37,1.93-.55.04-.01.09-.02.14-.02.24.02.42.16.48.37.06.23-.01.45-.22.6Z";

const CompassIcon = ({ colors, type }) => {
  
  // Dictionary with all information
  const principles = getComponentsPositions('Principle');
  const perspectives = getComponentsPositions('Perspective');
  const dimensions = getComponentsPositions('Dimension');
  const components = principles.concat(perspectives, dimensions);


  // Container styles for the circle menu
  const containerStyle = {
    position: 'fixed',   // Fixed position to stay in the specified location
    top: '0',            // Reset top for positioning
    left: '0',           // Reset left for positioning
    transform: `translate(-50%, -50%)`, // Centered offset
    borderRadius: '50%', // To make it a circular background if desired
    width: `${size}px`,
    height: `${size}px`
  };

  const buttonStyle = {
    position: 'absolute',
    cursor: 'default',
    pointerEvents: 'none', // Ensure buttons are clickable
  };

  return (
    <div 
      style={{
        ...containerStyle, 
        left: `${16.5}vw`, 
        top: `${21}vh`, 
        transform: 'translate(-50%, -50%)',
      }}
    >
    {components.map((c, i) => (
    <div key={i}>
      {/* Shape */}
        <div
        style={{
          ...buttonStyle,
          left: `${c.x - waveWidth/2}px`, // Adjust position for button size
          top: `${c.y - waveHeight/2 - 2}px`,
          transform: `rotate(${c.angle}rad) ${c.Type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
          zIndex: 1 // Layer filled shapes at the base
        }}
      >
        <svg viewBox="-5 0 100 20" width={waveWidth} height={waveHeight} style={{ pointerEvents: 'none' }}>
          <path 
            d={svgPath} 
            fill={colors['Wave'][c.Type]}  // Use the gradient fill
            stroke="none" 
            style={{ pointerEvents: 'all' }}
            opacity={getOpacity(c.Type, type)}
          />
        </svg>
      </div>
    </div>
    ))}
    <div
        style={{
            position: 'absolute',
            left: '50%',
            top:'50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: '10',
           
          }}
        >
        <p
            style={{
                color: `${colors['Text'][type]}`,
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize:"11px",
                textTransform: "uppercase", // Converts text to uppercase
                letterSpacing: "2px", // Increases the spacing between letters
            }}
        >
             {`${type}s`}
        </p>
    </div>
    </div>
  );
};

function getComponentsPositions(type) {
  let componentsData = [];
  const centerX = size/2;
  const centerY = size/2;
  let radius, numberOfComponents;

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
        Type: type,
        x: x,
        y: y,
        angle: angle
      });
  }
  return componentsData;
};

const getOpacity = (cType, type) => {
    if(cType === type)
        return 0.9;
    return 0.3;
};

export default CompassIcon;
