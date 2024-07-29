// src/components/OLDiagram.js
import React, { useState, useEffect } from 'react';
import { Stage, Layer, Shape } from 'react-konva';
import { getPrinciplesData, getPerspectivesData, getDimensionsData } from '../Data.js'; 
import '../styles/OLDiagram.css'; 

const OLDiagram = ({size, position, buttonsActive=true, onButtonClick}) => {
    const waveDims = {
        "Principles": { Width: size/3.9, Height: size/5.7, CornerRadius: size/25, Color: "#41ffc9" },
        "Perspectives": { Width: size/3.0, Height: size/7.3, CornerRadius: size/8.5, Color: "#41e092" },
        "Dimensions": { Width: size/3.3, Height: size/6.8, CornerRadius: size/8.5, Color: "#41c4e0" }
    };

    const principles = getPrinciples(getPrinciplesData(), waveDims.Principles);
    const perspectives = getPerspectives(getPerspectivesData(), size);
    const dimensions = getDimensions(getDimensionsData(), size);

    const [hoveredId, setHoveredId] = useState(null);
    const [clickedId, setClickedId] = useState(null);

    const handleClick = (arr, index, gradientColor) => (e) => {
        if (!buttonsActive) return;

        const id = e.target.id();
        setClickedId(id);

        const title = convertLabel(arr[index].Code);
        if (onButtonClick) {
            onButtonClick(title, arr[index].Headline, arr[index].Paragraph, arr[index].ShowMoreText, gradientColor);
        }
    }
      
    const handleMouseEnter = (e) => {
        if (!buttonsActive) return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'pointer';

        const id = e.target.id();
        setHoveredId(id);
    };

    const handleMouseLeave = (e) => {
        if (!buttonsActive) return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'default';

        setHoveredId(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setClickedId(null);
            setHoveredId(null);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Determine class names based on props
    const classNames = ['diagram'];
    if (position === 'left') classNames.push('left');

    return (
        <div className={classNames.join(' ')}>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {principles.map((p, i) => (
                        <Shape
                            key={p.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(p, size, waveDims.Principles, context, shape);
                            }}
                            id={p.Code}
                            fill={waveDims.Principles['Color']}
                            stroke={waveDims.Principles['Color']}
                            strokeWidth={0.01}
                            onClick={handleClick(principles, i, waveDims.Principles['Color'])}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={calculateOpacity(clickedId, hoveredId, p.Code)}
                        />
                    ))} 

                    {perspectives.map((p, i) => (
                        <Shape
                            key={p.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(p, size, waveDims.Perspectives, context, shape);
                            }}
                            id={p.Code}
                            fill={waveDims.Perspectives['Color']}
                            stroke={waveDims.Perspectives['Color']} 
                            strokeWidth={0.01}
                            onClick={handleClick(perspectives, i, waveDims.Perspectives['Color'])}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={calculateOpacity(clickedId, hoveredId, p.Code)}
                        />
                    ))} 

                    {dimensions.map((d, i) => (
                        <Shape
                            key={d.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(d, size, waveDims.Dimensions, context, shape);
                            }}
                            id={d.Code}
                            fill={waveDims.Dimensions['Color']}
                            stroke={waveDims.Dimensions['Color']} 
                            strokeWidth={0.01}
                            onClick={handleClick(dimensions, i, waveDims.Dimensions['Color'])}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={calculateOpacity(clickedId, hoveredId, d.Code)}
                        />
                    ))} 

                </Layer>   
        </Stage>
    </div>
    );
};

function getPrinciples(principlesData, dims) {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    const width = dims['Width'];
    const height = dims['Height'];
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const margin = 0.7;
    const angle = 0;

    principlesData[0] = { ...principlesData[0], x: x, y: y, angle: angle };
    principlesData[1] = { ...principlesData[1], x: x - halfWidth - margin, y: y - halfHeight - margin, angle: angle };
    principlesData[2] = { ...principlesData[2], x: x + halfWidth + margin, y: y - halfHeight - margin, angle: angle };
    principlesData[3] = { ...principlesData[3], x: x, y: y - height - 2 * margin, angle: angle };
    principlesData[4] = { ...principlesData[4], x: x - halfWidth - margin, y: y + halfHeight + margin, angle: angle };
    principlesData[5] = { ...principlesData[5], x: x + halfWidth + margin, y: y + halfHeight + margin, angle: angle };
    principlesData[6] = { ...principlesData[6], x: x, y: y + height + 2 * margin, angle: angle };

    return principlesData;
}

function getPerspectives(perspectivesData, size) {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const radius = size/2.8;
    const numComponents = 7;

    const perspectives = calculateAroundCirclePositions(perspectivesData, x, y, radius, numComponents);
    
    return perspectives;
}

function getDimensions(dimensionsData, size) {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const radius = size/2;
    const numComponents = 10;

    const positions = calculateAroundCirclePositions(dimensionsData, x, y, radius, numComponents);
       
    return positions;
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
    }

    return arr;
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

const calculateOpacity = (clickedId, hoveredId, currentId) => {
    if (clickedId === currentId) {
        return 1;
    }
    if (hoveredId === currentId) {
        return 0.8;
    }
    if (clickedId === null) {
        return 1;
    }
    return 0.5;
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

export default OLDiagram;
