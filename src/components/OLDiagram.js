// src/components/OLDiagram.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Shape } from 'react-konva';
import { getPrinciplesData, getPerspectivesData, getDimensionsData } from '../utils/Data.js'; 
import '../styles/OLDiagram.css'; 

const OLDiagram = ({size, colors, action, onButtonClick}) => {
    const waveDims = {
        "Principle": { Width: size/3.9, Height: size/5.7, CornerRadius: size/25 },
        "Perspective": { Width: size/3.0, Height: size/7.3, CornerRadius: size/8.5 },
        "Dimension": { Width: size/3.3, Height: size/6.8, CornerRadius: size/8.5 }
    };

    const principles = getPrinciples(getPrinciplesData(), waveDims.Principle);
    const perspectives = getPerspectives(getPerspectivesData(), size);
    const dimensions = getDimensions(getDimensionsData(), size);

    const [hoveredId, setHoveredId] = useState(null);
    const [clickedIds, setClickedIds] = useState([]);
    const clickedIdsRef = useRef(clickedIds);

    const handleClick = (arr, index) => (e) => {
        if (action === "initial" || action === "home")
            return;
        
        const id = e.target.id();

        if(action === "learn") {
            setClickedIds([id]);
            const title = convertLabel(arr[index].Code);

            if (onButtonClick) {
                onButtonClick(title, arr[index].Headline, arr[index].Paragraph, arr[index].ShowMoreText, arr[index].Type);
            }
        }

        if(action === "get-inspired" || action === "analyze") {
            setClickedIds(prevClickedIds => 
                prevClickedIds.includes(id)
                ? prevClickedIds.filter(buttonId => buttonId !== id) // Remove ID if already clicked
                : [...prevClickedIds, id] // Add ID if not already clicked
            );
        }
    }
      
    const handleMouseEnter = (e) => {
        const prefix = "initial";
        if (action.startsWith(prefix) || action === "home")
            return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'pointer';

        const id = e.target.id();
        setHoveredId(id);
    };

    const handleMouseLeave = (e) => {
        if (action === "initial" || action === "home")
            return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'default';

        setHoveredId(null);
    };

     // Memoize handleKeyDown to avoid creating a new reference on each render
     const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setClickedIds([]);
            setHoveredId(null);
        } 
        else if (action === "get-inspired" && e.key === 'Enter') {
            if (onButtonClick) {
                onButtonClick(clickedIdsRef.current);
            }
        }
    }, [action, onButtonClick]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Dependency array includes handleKeyDown

    // Update the ref whenever clickedIds changes
    useEffect(() => {
        clickedIdsRef.current = clickedIds;
    }, [clickedIds]);

    let position;
    const prefix = "initial"

    if(action.startsWith(prefix))
        position = "center";
    else if(action === "home")
        position = "center-top";
    else
        position = "left"

    return (
        <div className={position}>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {principles.map((p, i) => (
                        <Shape
                            key={p.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(p, size, waveDims.Principle, action, context, shape);
                            }}
                            id={p.Code}
                            fill={colors.Principle}
                            stroke={colors.Principle}
                            strokeWidth={0.01}
                            onClick={handleClick(principles, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={getOpacity(clickedIds, hoveredId, p.Code, p.Type, action)}
                        />
                    ))} 

                    {perspectives.map((p, i) => (
                        <Shape
                            key={p.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(p, size, waveDims.Perspective, action, context, shape);
                            }}
                            id={p.Code}
                            fillLinearGradientStartPoint={{ x: window.innerWidth / 2, y: -waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientEndPoint={{ x: window.innerWidth / 2, y: waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientColorStops={getGradientColor(p.Code, colors)}
                            stroke={colors.Perspective} 
                            strokeWidth={0.01}
                            onClick={handleClick(perspectives, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={getOpacity(clickedIds, hoveredId, p.Code, p.Type, action)}
                        />
                    ))} 

                    {dimensions.map((d, i) => (
                        <Shape
                            key={d.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(d, size, waveDims.Dimension, action, context, shape);
                            }}
                            id={d.Code}
                            fillLinearGradientStartPoint={{ x: window.innerWidth / 2, y: -waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientEndPoint={{ x: window.innerWidth / 2, y: waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientColorStops={getGradientColor(d.Code, colors)}
                            stroke={colors.Dimension} 
                            strokeWidth={0.01}
                            onClick={handleClick(dimensions, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={getOpacity(clickedIds, hoveredId, d.Code, d.Type, action)}
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

function drawWaveButton(component, size, componentDims, action, context, shape) { 
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

    if (action === "initial-0" || action === "initial-1") {
        return
    } else if (action === "initial-2" || action === "initial-3") {
        if(component.Type !== "Principle")
            return
    } else if (action === "initial-4") {
        if(component.Type === "Dimension")
            return 
    }

    let color;
    if(component.Type === "Principle")
        color = '#21b185';
    else
        color = 'white';

    const flippedTexts = ['Pe3', 'Pe4', 'Pe5', 'Pe6', 'D4', 'D5', 'D6', 'D7', 'D8'];
    
    if(flippedTexts.includes(component.Code))
        context.rotate(Math.PI);
    // Draw main text
    // Calculate font size based on dimension
    const fontSize = size / 41; // Adjust as needed
    context.font = `500 ${fontSize}px Calibri`;
    context.fillStyle = color;
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
    context.fillStyle = color;
    context.font = `400 ${LabelFontSize}px Calibri`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(component.Code, 0, - height / 4);
}

const getOpacity = (clickedIds, hoveredId, currentId, type, action) => {
    if (action === "initial-0" || action === "initial-1") {
        return 0.4
    } else if (action === "initial-2" || action === "initial-3") {
        if(type === "Principle")
            return 1
        else 
            return 0.4
    } else if (action === "initial-4") {
        if(type === "Dimension")
            return 0.4
        else
            return 1
    } else if (action === "initial-5")
        return 1

    if (clickedIds.includes(currentId)) 
        return 1;
    if (hoveredId === currentId) 
        return 0.8;
    if (clickedIds.length === 0) 
        return 1;  

    return 0.4;
};

const getGradientColor = (code, colors) => {
    if (code === 'Pe1')
        return [0, colors.Perspective, 1, colors.Principle];
    else if(code === 'D1')
        return [0, colors.Dimension, 1, colors.Perspective];
    else if (code[0] === 'P')
        return [0, colors.Perspective, 1, colors.Perspective];   
    else if (code[0] === 'D')
        return [0, colors.Dimension, 1, colors.Dimension];   
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

export default OLDiagram;
