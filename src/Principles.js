// src/WaveButtonCanvas.js
import React from 'react';
import { Stage, Layer, Group, Shape } from 'react-konva';

const OLDiagram = () => {
    let waveButtonDims = {
        "Principles": { Width: 130, Height: 90, CornerRadius: 20, Color: "#99f6be" },
        "Perspectives": { Width: 165, Height: 70, CornerRadius: 60, Color: "#85d68d" },
        "Dimensions": { Width: 155, Height: 75, CornerRadius: 60, Color: "#77bcd4" }
    };

    function drawWaveButton(x, y, numConcepts, number, context, shape, width, height, cornerRadius) { 

        // Save the current state of the canvas
        context.save();
        // Translate to the position where you want to draw the button
        context.translate(x, y);

        const halfWidth = width / 2;
        const halfHeight = height / 2; 
        const innerHeight = height / numConcepts;
        const centerConcept = (numConcepts + 1)/2;
        const centerDistance = Math.floor(Math.abs(number-centerConcept));
        let topAngle, bottomAngle;
        
        const top = { x: 0, y: -halfHeight };
        const right = { x: halfWidth, y: 0 };
        const bottom = { x: 0, y: halfHeight };
        const left = { x: -halfWidth, y: 0 };

        context.beginPath();
        context.moveTo(left.x, left.y);

        if(numConcepts % 2 !== 0 && number == centerConcept){
            topAngle = bottomAngle = cornerRadius+innerHeight*(numConcepts/2);
            // draw middle part
            context.arcTo(top.x, top.y+innerHeight, right.x, right.y, topAngle);
            context.lineTo(right.x, right.y);
            context.arcTo(bottom.x, bottom.y-innerHeight, left.x, left.y, bottomAngle);
        }

        else if(number <= numConcepts / 2) {
            topAngle = cornerRadius + centerDistance * innerHeight;
            bottomAngle = cornerRadius + centerDistance * (innerHeight + 1);
            // draw top part
            context.arcTo(top.x, top.y, right.x, right.y, topAngle);
            context.lineTo(right.x, right.y);
            context.arcTo(top.x, top.y+innerHeight, left.x, left.y, bottomAngle);
        }
        else if(number > numConcepts / 2) {
            topAngle = cornerRadius + centerDistance * (innerHeight+1);
            bottomAngle = cornerRadius + centerDistance * innerHeight;
            // draw bottom part
            context.arcTo(bottom.x, bottom.y, right.x, right.y, topAngle);
            context.lineTo(left.x, left.y);
            context.arcTo(bottom.x, bottom.y-innerHeight, left.x, left.y, bottomAngle);
        }



        // LOWER PART
        // context.beginPath();
        // context.moveTo(right.x, right.y);
        // context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
        // context.lineTo(left.x, left.y);
        // context.arcTo(bottom.x, bottom.y-innerHeight, right.x, right.y, cornerRadius+innerHeight);

        // //context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
        // context.closePath();
        // context.fillStrokeShape(shape); 

        // MIDDLE PART
        // context.beginPath();
        // context.moveTo(right.x, right.y);
        // context.arcTo(bottom.x, bottom.y-innerHeight, left.x, left.y, cornerRadius+innerHeight);
        // context.lineTo(left.x, left.y);
        // context.arcTo(top.x, top.y+innerHeight, right.x, right.y, cornerRadius+innerHeight);

        // //context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
        // context.closePath();
        // context.fillStrokeShape(shape); 

        // TOP PART
        // context.beginPath();
        // context.moveTo(right.x, right.y);
        // context.arcTo(top.x, top.y, left.x, left.y, cornerRadius);
        // context.lineTo(left.x, left.y);
        // context.arcTo(top.x, top.y+innerHeight, right.x, right.y, cornerRadius+innerHeight);

        // //context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
        context.closePath();
        context.fillStrokeShape(shape); 


        // Draw a small circle at (right.x, right.y)
        // context.beginPath();
        // context.arc(right.x, right.y, 3, 0, 2 * Math.PI); // Radius of 5, adjust as needed
        // context.fillStyle = 'blue'; // Color of the circle, adjust as needed
        // context.fill();

        // context.beginPath();
        // context.arc(0, 0, cornerRadius, 0, 2 * Math.PI); // Radius of 5, adjust as needed
        // context.fillStyle = 'blue'; // Color of the circle, adjust as needed
        // context.fill();

        //Set the stroke style and stroke the shape
        context.strokeStyle = 'red';
        context.lineWidth = 2; // Set the line width as needed
        context.stroke();
    }

    const handleClick = (arr) => (e) => {
        const id = e.target.id();
        alert(arr[id].infoText)
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

    let principles = getPrinciples();

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, 3, 1, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape>

                {/* <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, 3, 2, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape> */}

                <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, 3, 3, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape>
            </Layer>
        </Stage>
    );
};

export default OLDiagram;
