// src/WaveButtonCanvas.js
import React from 'react';
import { Stage, Layer, Group, Shape } from 'react-konva';

const OLDiagram = () => {
    let waveButtonDims = {
        "Principles": { Width: 130, Height: 90, CornerRadius: 20, Color: "#99f6be" },
        "Perspectives": { Width: 165, Height: 70, CornerRadius: 60, Color: "#85d68d" },
        "Dimensions": { Width: 155, Height: 75, CornerRadius: 60, Color: "#77bcd4" }
    };

    function drawWaveButton(x, y, angle, mainText, idText, context, shape, width, height, cornerRadius) { 

        // Save the current state of the canvas
        context.save();
        // Translate to the position where you want to draw the button
        context.translate(x, y);
        // Rotate the canvas context to the calculated angle (in radians)
        context.rotate(angle);

        const halfWidth = width / 2;
        const halfHeight = height / 2; 

        const top = { x: 0, y: -halfHeight };
        const right = { x: halfWidth, y: 0 };
        const bottom = { x: 0, y: halfHeight };
        const left = { x: -halfWidth, y: 0 };

        context.beginPath();
        context.moveTo(right.x, right.y);
        context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
        context.lineTo(left.x, left.y);
        context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
        context.closePath();
        context.fillStrokeShape(shape); 

        // Draw main text
        context.fillStyle = 'white';
        context.font = '500 14px Calibri';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const lines = mainText.split('\n');
        if(lines.length === 1)
            context.fillText(mainText, 0, 0);
        else{
            context.fillText(lines[0], 0, 0 - 8);
            context.fillText(lines[1], 0, 0 + 8);
        }
    
         // Draw identifier
        context.fillStyle = 'white';
        context.font = '100 13px Calibri';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(idText, 0, - height / 4);
    }

    const handleClick = (e) => {
        const id = e.target.id();
        alert(principles[id].infoText)
      }

    function getPrinciples() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
    
        const width = waveButtonDims.Principles['Width'];
        const height = waveButtonDims.Principles['Height'];
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const margin = 4;
    
        const p1 = { x: x, y: y };
        const p2 = { x: x - halfWidth - margin, y: y - halfHeight - margin };
        const p3 = { x: x + halfWidth + margin, y: y - halfHeight - margin };
        const p4 = { x: x, y: y - height - 2 * margin };
        const p5 = { x: x - halfWidth - margin, y: y + halfHeight + margin };
        const p6 = { x: x + halfWidth + margin, y: y + halfHeight + margin };
        const p7 = { x: x, y: y + height + 2 * margin };

        const angle = 0;

        return [  
            { IdText: 'P1', XRefPoint: p1['x'], YRefPoint: p1['y'], Angle: angle, MainText: 'ONE', infoText: 'The Earth has one big ocean with many features' },
            { IdText: 'P2', XRefPoint: p2['x'], YRefPoint: p2['y'], Angle: angle, MainText: 'EARTH\nSHAPER', infoText: 'The ocean and life in the ocean shape the features of the Earth' },
            { IdText: 'P3', XRefPoint: p3['x'], YRefPoint: p3['y'], Angle: angle, MainText: 'CLIMATE\nREGULATOR', infoText: 'The ocean is a major influence on weather and climate' },
            { IdText: 'P4', XRefPoint: p4['x'], YRefPoint: p4['y'], Angle: angle, MainText: 'LIFE-ENABLER', infoText: 'The ocean makes the Earth habitable' },
            { IdText: 'P5', XRefPoint: p5['x'], YRefPoint: p5['y'], Angle: angle, MainText: 'GREATLY\nDIVERSE', infoText: 'The ocean supports a great diversity of life and ecosystems' },
            { IdText: 'P6', XRefPoint: p6['x'], YRefPoint: p6['y'], Angle: angle, MainText: 'INTERLINKED\nWITH HUMANS', infoText: 'The ocean and humans are inextricably interconnected' },
            { IdText: 'P7', XRefPoint: p7['x'], YRefPoint: p7['y'], Angle: angle, MainText: 'LARGELY\nUNKNOWN', infoText: 'The ocean is largely unexplored' },
        ]
    }

    const calculateButtonPositions = (centerX, centerY, radius, numberOfButtons) => {
        const positions = [];
        const angleStep = (2 * Math.PI) / numberOfButtons;
    
        for (let i = 0; i < numberOfButtons; i++) {
          const angle = i * angleStep;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const rotation = angle + Math.PI / 2;
          console.log(i, rotation * 180 / Math.PI)
          positions.push({ x, y, rotation});
        }
    
        return positions;
      };

    function getPerspectives() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const radius = 180;
        const numButtons = 7;
        
        const pos = calculateButtonPositions(x, y, radius, numButtons);
        
        return [  
            { IdText: 'Pe1', XRefPoint: pos[0].x, YRefPoint: pos[0].y, Angle: pos[0].rotation, MainText: 'SCIENTIFIC', infoText: 'The Earth has one big ocean with many features' },
            { IdText: 'Pe2', XRefPoint: pos[1].x, YRefPoint: pos[1].y, Angle: pos[1].rotation, MainText: 'HISTORICAL', infoText: 'The ocean and life in the ocean shape the features of the Earth' },
            { IdText: 'Pe3', XRefPoint: pos[2].x, YRefPoint: pos[2].y, Angle: pos[2].rotation, MainText: 'GEOGRAPHICAL', infoText: 'The ocean is a major influence on weather and climate' },
            { IdText: 'Pe4', XRefPoint: pos[3].x, YRefPoint: pos[3].y, Angle: pos[3].rotation, MainText: 'GENDER EQUALITY', infoText: 'The ocean makes the Earth habitable' },
            { IdText: 'Pe5', XRefPoint: pos[4].x, YRefPoint: pos[4].y, Angle: pos[4].rotation, MainText: 'VALUE', infoText: 'The ocean supports a great diversity of life and ecosystems' },
            { IdText: 'Pe6', XRefPoint: pos[5].x, YRefPoint: pos[5].y, Angle: pos[5].rotation, MainText: 'CULTURAL', infoText: 'The ocean and humans are inextricably interconnected' },
            { IdText: 'Pe7', XRefPoint: pos[6].x, YRefPoint: pos[6].y, Angle: pos[6].rotation, MainText: 'ECOLOGICAL', infoText: 'The ocean is largely unexplored' },
        ]
    }

    function getDimensions() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const radius = 255;
        const numButtons = 10;
        
        const pos = calculateButtonPositions(x, y, radius, numButtons);
        
        return [  
            { IdText: 'D1', XRefPoint: pos[0].x, YRefPoint: pos[0].y, Angle: pos[0].rotation, MainText: 'KNOWLEDGE', infoText: 'The Earth has one big ocean with many features' },
            { IdText: 'D2', XRefPoint: pos[1].x, YRefPoint: pos[1].y, Angle: pos[1].rotation, MainText: 'COMMUNICATION', infoText: 'The ocean and life in the ocean shape the features of the Earth' },
            { IdText: 'D3', XRefPoint: pos[2].x, YRefPoint: pos[2].y, Angle: pos[2].rotation, MainText: 'BEHAVIOUR', infoText: 'The ocean is a major influence on weather and climate' },
            { IdText: 'D4', XRefPoint: pos[3].x, YRefPoint: pos[3].y, Angle: pos[3].rotation, MainText: 'ATTITUDE', infoText: 'The ocean makes the Earth habitable' },
            { IdText: 'D5', XRefPoint: pos[4].x, YRefPoint: pos[4].y, Angle: pos[4].rotation, MainText: 'AWARENESS', infoText: 'The ocean supports a great diversity of life and ecosystems' },
            { IdText: 'D6', XRefPoint: pos[5].x, YRefPoint: pos[5].y, Angle: pos[5].rotation, MainText: 'ACTIVISM', infoText: 'The ocean and humans are inextricably interconnected' },
            { IdText: 'D7', XRefPoint: pos[6].x, YRefPoint: pos[6].y, Angle: pos[6].rotation, MainText: 'EMOCEANS', infoText: 'The ocean is largely unexplored' },
            { IdText: 'D8', XRefPoint: pos[7].x, YRefPoint: pos[7].y, Angle: pos[7].rotation, MainText: 'EXPERIENCE', infoText: 'The ocean is largely unexplored' },
            { IdText: 'D9', XRefPoint: pos[8].x, YRefPoint: pos[8].y, Angle: pos[8].rotation, MainText: 'ADAPTIVE CAPACITY', infoText: 'The ocean is largely unexplored' },
            { IdText: 'D10', XRefPoint: pos[9].x, YRefPoint: pos[9].y, Angle: pos[9].rotation, MainText: 'TRANSPARENCY', infoText: 'The ocean is largely unexplored' },
        ]
    }

    let principles = getPrinciples();
    let perspectives = getPerspectives();
    let dimensions = getDimensions();

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            {principles.map((p, i) => (
            <Group key={p.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(p.XRefPoint, p.YRefPoint, p.Angle, p.MainText, p.IdText, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={i.toString()}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick}
                />
            </Group>
            ))}

            {perspectives.map((p, i) => (
            <Group key={p.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(p.XRefPoint, p.YRefPoint, p.Angle, p.MainText, p.IdText, context, shape, 
                            waveButtonDims.Perspectives['Width'], 
                            waveButtonDims.Perspectives['Height'], 
                            waveButtonDims.Perspectives['CornerRadius'])
                    }}
                    id={i.toString()}
                    fill={waveButtonDims.Perspectives['Color']}
                    onClick={handleClick}
                />
            </Group>
            ))}

            {dimensions.map((d, i) => (
            <Group key={d.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(d.XRefPoint, d.YRefPoint, d.Angle, d.MainText, d.IdText, context, shape, 
                            waveButtonDims.Dimensions['Width'], 
                            waveButtonDims.Dimensions['Height'], 
                            waveButtonDims.Dimensions['CornerRadius'])
                    }}
                    id={i.toString()}
                    fill={waveButtonDims.Dimensions['Color']}
                    onClick={handleClick}
                />
            </Group>
            ))}

            </Layer>   
    </Stage>
    );
};

export default OLDiagram;
