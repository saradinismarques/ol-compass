// src/components/OLDiagram.js
import React, { useState, useCallback } from 'react';
import { Stage, Layer, Group, Shape } from 'react-konva';
import { getPrinciples, getPerspectives, getDimensions } from '../Data.js'; 
import '../styles/OLDiagram.css'; 

const OLDiagram = ({size, position, onButtonClick}) => {
    const waveDims = {
        "Principles": { Width: size/3.9, Height: size/5.7, CornerRadius: size/25.5, Color: "#99f6be" },
        "Perspectives": { Width: size/3.0, Height: size/7.3, CornerRadius: size/8.5, Color: "#85d68d" },
        "Dimensions": { Width: size/3.3, Height: size/6.8, CornerRadius: size/8.5, Color: "#77bcd4" }
    };

    
    const principles = getPrinciples();
    const perspectivesContent = getPerspectives();
    const dimensions = getDimensions();

    const [perspectivesPositions, setPerspectivesPositions] = React.useState(getPerspectivePositions());
    const dimensionsPositions = getDimensionPositions();

    // Memoized handleClick
    const handleClick = useCallback((arr) => (e) => {
        console.log("CLICKED");
        const id = e.target.id();
        const title = convertLabel(arr[id].Code);
        if (onButtonClick) {
            onButtonClick(title, arr[id].Headline, arr[id].Paragraph);
        }
    }, [onButtonClick]);

    // const handleMouseEnter = useCallback((e) => {
    //     const stage = e.target.getStage();
    //     stage.container().style.cursor = 'pointer';
    
    //     const id = parseInt(e.target.id());
    //     console.log(id);
    //     setPerspectivesPositions((prevPositions) =>
    //       prevPositions.map((pos, i) =>
    //         i === id ? { ...pos, isHovered: true } : pos
    //       )
    //     );
    // }, [setPerspectivesPositions]);
    
    //   const handleMouseLeave = () => (e) => {
    //     console.log("AAAAAAAAAAAAAAAAAAAA");
    //     const id = parseInt(e.target.id());
    //     console.log(id);
    //     setPerspectivesPositions((prevPositions) =>
    //       prevPositions.map((pos, i) =>
    //         i === id ? { ...pos, isHovered: true } : pos
    //       )
    //     );
    //   };
    const [hoveredId, setHoveredId] = useState(null);

        // Memoized handleMouseEnter
        const handleMouseEnter = useCallback((e) => {
            const stage = e.target.getStage();
             stage.container().style.cursor = 'pointer';

            const id = parseInt(e.target.id(), 10);
            console.log(`Mouse Enter ID: ${id}`); // Debugging
            setHoveredId(id);
        }, []);
    
        // Memoized handleMouseLeave
        const handleMouseLeave = useCallback(() => {
            console.log(`Mouse Leave ID: ${hoveredId}`); // Debugging
            setHoveredId(null);
        }, [hoveredId]);
      
    function getPrinciplePosition(principle) {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
    
        const width = waveDims.Principles['Width'];
        const height = waveDims.Principles['Height'];
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const margin = 4;
        const angle = 0;
    
        // Define positions for each principle
        const positions = {
            "P1": { x: x, y: y, angle: angle, isHovered: false },
            "P2": { x: x - halfWidth - margin, y: y - halfHeight - margin, angle: angle, isHovered: false },
            "P3": { x: x + halfWidth + margin, y: y - halfHeight - margin, angle: angle, isHovered: false },
            "P4": { x: x, y: y - height - 2 * margin, angle: angle, isHovered: false },
            "P5": { x: x - halfWidth - margin, y: y + halfHeight + margin, angle: angle, isHovered: false },
            "P6": { x: x + halfWidth + margin, y: y + halfHeight + margin, angle: angle, isHovered: false },
            "P7": { x: x, y: y + height + 2 * margin, angle: angle, isHovered: false }
        };

        return positions[principle.Code];
    };

    function calculateAroundCirclePositions(centerX, centerY, radius, numberOfComponents, codeId) {
        const positions = [];
        const angleStep = (2 * Math.PI) / numberOfComponents;
        const StartAngle = -Math.PI/2;
        const isHovered = false;
        
        for (let i = 0; i < numberOfComponents; i++) {
          let angle = i * angleStep + StartAngle;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          angle = angle + Math.PI / 2;

          const code = codeId+`${i + 1}`;
          positions.push({ code, x, y, angle, isHovered });
        }
    
        return positions;
    };

    function getPerspectivePositions() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const radius = size/2.8;
        const numComponents = 7;
        const codeId = "Pe"

        const positions = calculateAroundCirclePositions(x, y, radius, numComponents, codeId);
        
        return positions;
    }

    function getDimensionPositions() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const radius = size/2;
        const numComponents = 10;
        const codeId = "D"

        const positions = calculateAroundCirclePositions(x, y, radius, numComponents, codeId);
        
        return positions;
    }


    React.useEffect(() => {
        console.log("Updated perspectivePositions:", perspectivesPositions);
      }, [perspectivesPositions]);
    
    // Determine class names based on props
    const classNames = ['diagram'];
    if (position === 'left') classNames.push('left');

    return (
        <div className={classNames.join(' ')}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            {/* {principles.map((p, i) => (
            <Group key={p.Code}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(p, getPrinciplePosition(p), waveDims.Principles, context, shape)
                    }}
                    id={i.toString()} // Assign a unique ID
                    fill={waveDims.Principles['Color']}
                    onClick={handleClick(principles)}
                />
            </Group>
            ))} */}



            {perspectivesPositions.map((p, i) => (
            <Group key={p.code + (p.isHovered ? 'hovered' : 'normal')}>
            <Shape
                key={p.code + (p.isHovered ? 'hovered' : 'normal')}
                sceneFunc={(context, shape) => {
                drawWaveButton(size, perspectivesContent[i], perspectivesPositions[i], waveDims.Perspectives, context, shape);
                }}
                id={i.toString()}
                fill={waveDims.Perspectives['Color']}
                onClick={handleClick(perspectivesContent)}
                onMouseEnter={handleMouseEnter}
                stroke="white" // Add border for debugging
                opacity={hoveredId === i ? 0.5 : 1} // Set opacity based on hovered state

                />
            </Group>
            ))} 
            
            {/* {dimensions.map((d, i) => (
            <Group key={d.Code}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(d, dimensionsPositions[d.Code], waveDims.Dimensions, context, shape) 
                    }}
                    id={i.toString()}
                    fill={waveDims.Dimensions['Color']}
                    onClick={handleClick(dimensions)}
                />
            </Group>
            ))}   */}

            </Layer>   
    </Stage>
    </div>
    );
};

function drawWaveButton(size, component, componentPosition, componentDims, context, shape) { 
    const x = componentPosition.x;
    const y = componentPosition.y;
    const angle = componentPosition.angle;

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
    // if(componentPosition.isHovered)
    //     context.globalAlpha = 0.5;
    // else
    //     context.globalAlpha = 1;

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


export default OLDiagram;
