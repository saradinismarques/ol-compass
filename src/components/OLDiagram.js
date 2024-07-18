// src/components/OLDiagram.js

import React from 'react';
import { Stage, Layer, Group, Shape } from 'react-konva';
import { getPrinciples, getPerspectives } from '../Data.js'; 

const OLDiagram = () => {
    const waveDims = {
        "Principles": { Width: 130, Height: 90, CornerRadius: 20, Color: "#99f6be" },
        "Perspectives": { Width: 165, Height: 70, CornerRadius: 60, Color: "#85d68d" },
        "Dimensions": { Width: 155, Height: 75, CornerRadius: 60, Color: "#77bcd4" }
    };

    function drawWave(component, componentPosition, componentDims, context, shape) { 

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
        context.fillStyle = 'blue';  // Change fill color here
        context.fillStrokeShape(shape);

        // Draw main text
        context.fillStyle = 'white';
        context.font = '500 12.5px Calibri';
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
            context.fillText(firstPart, 0, -8);
            context.fillText(secondPart, 0, 8);
        }
    
         // Draw identifier
        context.fillStyle = 'white';
        context.font = '100 11px Calibri';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(component.Code, 0, - height / 4);
    }

    const handleClick = (arr) => (e) => {
        const id = e.target.id();
        alert(arr[id].Headline)
      }

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
            "P1": { x: x, y: y, angle: angle },
            "P2": { x: x - halfWidth - margin, y: y - halfHeight - margin, angle: angle },
            "P3": { x: x + halfWidth + margin, y: y - halfHeight - margin, angle: angle },
            "P4": { x: x, y: y - height - 2 * margin, angle: angle },
            "P5": { x: x - halfWidth - margin, y: y + halfHeight + margin, angle: angle },
            "P6": { x: x + halfWidth + margin, y: y + halfHeight + margin, angle: angle },
            "P7": { x: x, y: y + height + 2 * margin, angle: angle }
        };

        return positions[principle.Code];
    };

    function calculateAroundCirclePositions(centerX, centerY, radius, numberOfButtons) {
        const positions = [];
        const angleStep = (2 * Math.PI) / numberOfButtons;
        const randomStartAngle = Math.random() * 2 * Math.PI;
        
        for (let i = 0; i < numberOfButtons; i++) {
          let angle = i * angleStep + randomStartAngle;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          angle = angle + Math.PI / 2;

          const code = `Pe${i + 1}`;
          positions[code] = { x, y, angle };
        }
    
        return positions;
    };

    function getPerspectivePositions() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const radius = 180;
        const numButtons = 7;
        const positions = calculateAroundCirclePositions(x, y, radius, numButtons);
        
        return positions;
    }

    // function getDimensions() {
    //     const x = window.innerWidth / 2;
    //     const y = window.innerHeight / 2;
    //     const radius = 255;
    //     const numButtons = 10;
        
    //     const pos = calculateButtonPositions(x, y, radius, numButtons);
        
    //     return [  
    //         { IdText: 'D1', XRefPoint: pos[0].x, YRefPoint: pos[0].y, Angle: pos[0].rotation, MainText: 'KNOWLEDGE', infoText: 'The Earth has one big ocean with many features' },
    //         { IdText: 'D2', XRefPoint: pos[1].x, YRefPoint: pos[1].y, Angle: pos[1].rotation, MainText: 'COMMUNICATION', infoText: 'The ocean and life in the ocean shape the features of the Earth' },
    //         { IdText: 'D3', XRefPoint: pos[2].x, YRefPoint: pos[2].y, Angle: pos[2].rotation, MainText: 'BEHAVIOUR', infoText: 'The ocean is a major influence on weather and climate' },
    //         { IdText: 'D4', XRefPoint: pos[3].x, YRefPoint: pos[3].y, Angle: pos[3].rotation, MainText: 'ATTITUDE', infoText: 'The ocean makes the Earth habitable' },
    //         { IdText: 'D5', XRefPoint: pos[4].x, YRefPoint: pos[4].y, Angle: pos[4].rotation, MainText: 'AWARENESS', infoText: 'The ocean supports a great diversity of life and ecosystems' },
    //         { IdText: 'D6', XRefPoint: pos[5].x, YRefPoint: pos[5].y, Angle: pos[5].rotation, MainText: 'ACTIVISM', infoText: 'The ocean and humans are inextricably interconnected' },
    //         { IdText: 'D7', XRefPoint: pos[6].x, YRefPoint: pos[6].y, Angle: pos[6].rotation, MainText: 'EMOCEANS', infoText: 'The ocean is largely unexplored' },
    //         { IdText: 'D8', XRefPoint: pos[7].x, YRefPoint: pos[7].y, Angle: pos[7].rotation, MainText: 'EXPERIENCE', infoText: 'The ocean is largely unexplored' },
    //         { IdText: 'D9', XRefPoint: pos[8].x, YRefPoint: pos[8].y, Angle: pos[8].rotation, MainText: 'ADAPTIVE\nCAPACITY', infoText: 'The ocean is largely unexplored' },
    //         { IdText: 'D10', XRefPoint: pos[9].x, YRefPoint: pos[9].y, Angle: pos[9].rotation, MainText: 'TRANSPARENCY', infoText: 'The ocean is largely unexplored' },
    //     ]
    // }

    const principles = getPrinciples();
    const perspectives = getPerspectives();
    //const dimensions = getDimensions();

    const perspectivesPositions = getPerspectivePositions();


    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            {principles.map((p, i) => (
            <Group key={p.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWave(p, getPrinciplePosition(p), waveDims.Principles, context, shape)
                    }}
                    id={i.toString()}
                    fill={waveDims.Principles['Color']}
                    onClick={handleClick(principles)}
                />
            </Group>
            ))}

            {perspectives.map((p, i) => (
            <Group key={p.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWave(p, perspectivesPositions[p.Code], waveDims.Perspectives, context, shape) 
                    }}
                    id={i.toString()}
                    fill={waveDims.Perspectives['Color']}
                    onClick={handleClick(perspectives)}
                />
            </Group>
            ))}

            {/* {dimensions.map((d, i) => (
            <Group key={d.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWave(d.XRefPoint, d.YRefPoint, d.Angle, d.MainText, d.IdText, context, shape, 
                            waveDims.Dimensions['Width'], 
                            waveDims.Dimensions['Height'], 
                            waveDims.Dimensions['CornerRadius'])
                    }}
                    id={i.toString()}
                    fill={waveDims.Dimensions['Color']}
                    onClick={handleClick(dimensions)}
                />
            </Group>
            ))}  */}

            </Layer>   
    </Stage>
    );
};

export default OLDiagram;
