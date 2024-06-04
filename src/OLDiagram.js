// src/WaveButtonCanvas.js
import React from 'react';
import { Stage, Layer, Text, Group, Shape, Circle } from 'react-konva';

const OLDiagram = () => {
    const waveButtonDims = {
        "Principles": { Width: 170, Height: 110, CornerRadius: 30, Color: "#99f6be" },
        "Dimensions": { Width: 170, Height: 110, CornerRadius: 40, Color: "99f6be" },
        "Perspectives": { Width: 170, Height: 110, CornerRadius: 40, Color: "99f6be" }
    };

    function drawWaveButton(x, y, mainText, idText, context, shape, width, height, cornerRadius) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
            
        const top = { x: x, y: y - halfHeight };
        const right = { x: x + halfWidth, y: y };
        const bottom = { x: x, y: y + halfHeight };
        const left = { x: x - halfWidth, y: y };

        context.beginPath();
        context.moveTo(right.x, right.y);
        context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
        context.lineTo(left.x, left.y);
        context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
        context.closePath();
        context.fillStrokeShape(shape); 

        // Draw main text
        context.fillStyle = 'white';
        context.font = '500 18px Calibri';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(mainText, x, y);
    
         // Draw identifier
        context.fillStyle = 'white';
        
        context.font = '100 16px Calibri';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(idText, x, y - height / 4);
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

        return [  
            { IdText: 'P1', XRefPoint: p1['x'], YRefPoint: p1['y'], MainText: 'ONE BIG', infoText: 'The Earth has one big ocean with many features' },
            { IdText: 'P2', XRefPoint: p2['x'], YRefPoint: p2['y'], MainText: 'EARTH-SHAPER', infoText: 'The ocean and life in the ocean shape the features of the Earth' },
            { IdText: 'P3', XRefPoint: p3['x'], YRefPoint: p3['y'], MainText: 'CLI-WEA INFLUENCER', infoText: 'The ocean is a major influence on weather and climate' },
            { IdText: 'P4', XRefPoint: p4['x'], YRefPoint: p4['y'], MainText: 'LIFE-ENABLER', infoText: 'The ocean makes the Earth habitable' },
            { IdText: 'P5', XRefPoint: p5['x'], YRefPoint: p5['y'], MainText: 'GREATLY DIVERSE', infoText: 'The ocean supports a great diversity of life and ecosystems' },
            { IdText: 'P6', XRefPoint: p6['x'], YRefPoint: p6['y'], MainText: 'INTERCONNECTED WITH HUMANS', infoText: 'The ocean and humans are inextricably interconnected' },
            { IdText: 'P7', XRefPoint: p7['x'], YRefPoint: p7['y'], MainText: 'LARGELY UNEXPLORED', infoText: 'The ocean is largely unexplored' },
        ]
    }

    let principles = getPrinciples();

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            {principles.map((p, i) => (
            <Group key={p.IdText}>
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(p.XRefPoint, p.YRefPoint, p.MainText, p.IdText, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={i.toString()}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick}
                />
                {/* <Text 
                    fontSize={20} 
                    text={p.MainText} 
                    text-align="center"
                    x={p.XRefPoint} 
                    y={p.YRefPoint}
                /> */}
            </Group>
            ))}
            </Layer>   
    </Stage>
    );
};

export default OLDiagram;
