// src/components/OLDiagram.js
import React, { useState } from 'react';
import { Stage, Layer, Group, Shape } from 'react-konva';
import { getPrinciplesData, getPerspectivesData, getDimensionsData } from '../Data.js'; 
import '../styles/OLDiagram.css'; 

const OLDiagram = ({size, position, onButtonClick}) => {
    const waveDims = {
        "Principles": { Width: size/3.9, Height: size/5.7, CornerRadius: size/25.5, Color: "#99f6be" },
        "Perspectives": { Width: size/3.0, Height: size/7.3, CornerRadius: size/8.5, Color: "#85d68d" },
        "Dimensions": { Width: size/3.3, Height: size/6.8, CornerRadius: size/8.5, Color: "#77bcd4" }
    };

    
    const perspectivesData = getPerspectivesData();

    const perspectives = getPerspectives(perspectivesData, size);
;
    const handleClick = (arr) => (e) => {
        
        const id = e.target.id();
        const match = id.match(/\d+/); // This regex matches one or more digits in the string
        const code = parseInt(match[0], 10) - 1;  

        console.log(code);
        const title = convertLabel(arr[code].Code);
        if (onButtonClick) {
            onButtonClick(title, arr[code].Headline, arr[code].Paragraph);
        }
    }
      
    const [hoveredId, setHoveredId] = useState(null);

        // Memoized handleMouseEnter
        const handleMouseEnter = (e) => {
            const stage = e.target.getStage();
            stage.container().style.cursor = 'pointer';

            const id = e.target.id();
            console.log(`Mouse Enter ID: ${id}`); // Debugging
            setHoveredId(id);
        };



    // Determine class names based on props
    const classNames = ['diagram'];
    if (position === 'left') classNames.push('left');

    return (
        <div className={classNames.join(' ')}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            {perspectives.map((p, i) => (
            <Shape
                key={p.Code + (p.isHovered ? 'hovered' : 'normal')}
                sceneFunc={(context, shape) => {
                drawWaveButton(p, size, waveDims.Perspectives, context, shape);
                }}
                id={p.Code}
                fill={waveDims.Perspectives['Color']}
                stroke="white" // Add border for debugging
                onClick={handleClick(perspectives)}
                onMouseEnter={handleMouseEnter}
                opacity={hoveredId === p.Code ? 0.5 : 1} // Set opacity based on hovered state

                />
            ))} 

            </Layer>   
    </Stage>
    </div>
    );
};

function drawWaveButton(component, size, componentDims, context, shape) { 
    const x = component.x;
    const y = component.y;
    const angle = component.angle;

    const width = componentDims.Width;
    const height = componentDims.Height;
    const cornerRadius = componentDims.CornerRadius;

    // Save the current state of the canvas
    context.save();
    // Translate to the position where you want to draw the button
    context.translate(x, y);
    // Rotate the canvas context to the calculated angle (in radians)
    context.rotate(angle);

    const halfWidth =  width / 2;
    const halfHeight =  height / 2;

    const top = { x: 0, y: -halfHeight };
    const right = { x: halfWidth, y: 0 };
    const bottom = { x: 0, y: halfHeight };
    const left = { x: -halfWidth, y: 0 };

    context.beginPath();
    context.moveTo(left.x, left.y);
    context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
    context.lineTo(right.x, right.y);
    context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
    context.closePath();
    context.fillStrokeShape(shape);

    // Draw main text
    // Calculate font size based on dimension
    const fontSize = size / 41; // Adjust as needed
    context.fillStyle = 'white';
    context.font = `500 ${fontSize}px Calibri`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Find the index of the first space
    const firstIndex = component.Label.indexOf(' ');
    // Split the string into two parts based on the first space
    const firstPart = component.Label.substring(0, firstIndex);
    const secondPart = component.Label.substring(firstIndex + 1);

    if(firstPart.length < 5)
        context.fillText(component.Label, 0, 0);
    else{
        context.fillText(firstPart, 0, -height/11);
        context.fillText(secondPart, 0, height/11);
    }

    // Draw identifier
    const LabelFontSize = size / 45; // Adjust as needed
    context.fillStyle = 'white';
    context.font = `500 ${LabelFontSize}px Calibri`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(component.Code, 0, - height / 4);
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

function calculateAroundCirclePositions(arr, centerX, centerY, radius, numberOfComponents) {
    const angleStep = (2 * Math.PI) / numberOfComponents;
    const StartAngle = -Math.PI/2;
    
    for (let i = 0; i < numberOfComponents; i++) {
      let angle = i * angleStep + StartAngle;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      angle = angle + Math.PI / 2;

      arr[i]["x"] = x;
      arr[i]["y"] = y;
      arr[i]["angle"] = angle;
      arr[i]["isHovered"] = false;
    }

    return arr;
};

function getPerspectives(perspectivesData, size) {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const radius = size/2.8;
    const numComponents = 7;

    const perspectives = calculateAroundCirclePositions(perspectivesData, x, y, radius, numComponents);
    
    return perspectives;
}

export default OLDiagram;
