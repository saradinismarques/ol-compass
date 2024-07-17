// src/components/Principles.js
import React from 'react';
import { Stage, Layer, Group, Shape } from 'react-konva';

const OLDiagram = () => {
    let waveButtonDims = {
        "Principles": { Width: 130, Height: 90, CornerRadius: 20, Color: "#99f6be" },
        "Perspectives": { Width: 165, Height: 70, CornerRadius: 60, Color: "#85d68d" },
        "Dimensions": { Width: 155, Height: 75, CornerRadius: 60, Color: "#77bcd4" }
    };

    function drawCircle(x, y, numConcepts, number, context, shape, width, height, cornerRadius) {    
              // Save the current state of the canvas
              context.save();
              // Translate to the position where you want to draw the button
              context.translate(x, y);
              const innerHeight = height / numConcepts;
        const centerConcept = (numConcepts + 1)/2;
        const centerDistance = Math.round(Math.abs(number-centerConcept));
        let topAngle, bottomAngle;
        topAngle = cornerRadius + Math.abs((centerDistance-Math.floor(numConcepts/2))) * innerHeight;

        context.beginPath();
        context.arc(0, 0, topAngle, 0, 2 * Math.PI); // Radius of 5, adjust as needed
        context.fillStyle = 'blue'; // Color of the circle, adjust as needed
        context.fill();
        context.closePath();
        context.fillStrokeShape(shape); 

    }

    

    function drawWaveButton(x, y, numConcepts, number, context, shape, width, height, cornerRadius) { 

        // Save the current state of the canvas
        context.save();
        // Translate to the position where you want to draw the button
        context.translate(x, y);

        const halfWidth = width / 2;
        const halfHeight = height / 2; 
        const innerHeight = height / numConcepts;
        const centerConcept = (numConcepts + 1)/2;
        const centerDistance = Math.round(Math.abs(number-centerConcept));
        let topAngle, bottomAngle;
        
        const top = { x: 0, y: -halfHeight };
        const right = { x: halfWidth, y: 0 };
        const bottom = { x: 0, y: halfHeight };
        const left = { x: -halfWidth, y: 0 };

        context.beginPath();
        context.moveTo(left.x, left.y);

        if(numConcepts % 2 !== 0 && number == centerConcept){
            topAngle = bottomAngle = cornerRadius+(numConcepts/2)*innerHeight;
            // draw middle part
            console.log("MIDDLE")
            context.arcTo(top.x, top.y+innerHeight, right.x, right.y, topAngle);
            context.lineTo(right.x, right.y);
            context.arcTo(bottom.x, bottom.y-innerHeight, left.x, left.y, bottomAngle);
        }

        else if(numConcepts % 2 == 0 && centerConcept-number == 0.5){
            topAngle = cornerRadius+(numConcepts/2-1)*innerHeight;
            // draw middle part
            console.log("MIDDLE 2")
            context.arcTo(top.x, top.y+innerHeight, right.x, right.y, topAngle);
            context.lineTo(right.x, right.y);
        }
        else if(numConcepts % 2 == 0 && centerConcept-number == -0.5){
            console.log("MIDDLE 3")
            bottomAngle = cornerRadius+(numConcepts/2-1)*innerHeight;
            // draw middle part
            console.log("MIDDLE 2")
            context.arcTo(bottom.x, bottom.y-innerHeight, right.x, right.y, bottomAngle);
            context.lineTo(right.x, right.y)
        }

        else if(number <= numConcepts / 2) {
            topAngle = cornerRadius + Math.abs((centerDistance-Math.floor(numConcepts/2))) * innerHeight;
            bottomAngle = cornerRadius +  (Math.abs(centerDistance-Math.floor(numConcepts/2))+1) * innerHeight;
            // draw top part
            console.log("TOP")
            console.log(Math.abs((centerDistance-Math.floor(numConcepts/2))))
            console.log((Math.abs(centerDistance-Math.floor(numConcepts/2))+1))

            context.arcTo(top.x, top.y, right.x, right.y, 0);
            context.lineTo(right.x, right.y);
            context.arcTo(top.x, top.y+innerHeight, left.x, left.y, 0);
        }
        else if(number > numConcepts / 2) {
            topAngle = cornerRadius + Math.abs((centerDistance-Math.floor(numConcepts/2))+1) * innerHeight;
            bottomAngle = cornerRadius + Math.abs((centerDistance-Math.floor(numConcepts/2))) * innerHeight;
            // draw bottom part
            console.log("BOTTOM")
            context.arcTo(bottom.x, bottom.y-innerHeight, right.x, right.y, topAngle);
            context.lineTo(right.x, right.y);
            context.arcTo(bottom.x, bottom.y, left.x, left.y, bottomAngle);
        }
        context.closePath();
        context.fillStrokeShape(shape); 

        context.beginPath();
        context.arc(top.x, top.y, 1, 0, 2 * Math.PI); // Radius of 5, adjust as needed
        context.fillStyle = 'red'; // Color of the circle, adjust as needed
        context.fill();
        context.closePath();

        context.beginPath();
        context.arc(top.x, top.y+innerHeight, 1, 0, 2 * Math.PI); // Radius of 5, adjust as needed
        context.fillStyle = 'red'; // Color of the circle, adjust as needed
        context.fill();
        context.closePath();

        // DEVE SER SUBTRAIR A ALTURA NOS PRIMEIROS CONTROL POINTS
        // //Set the stroke style and stroke the shape
        // context.strokeStyle = 'white';
        // context.lineWidth = 0.8; // Set the line width as needed
        // context.stroke();
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
    const numConcepts = 5;
    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                {/* <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, numConcepts, 1, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape> */}
                {/* <Shape  
                    sceneFunc={(context, shape) => {
                        drawCircle(principles[0].XRefPoint, principles[0].YRefPoint, numConcepts, 2, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    onClick={handleClick(principles)}
                ></Shape> */}

                <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, numConcepts, 2, context, shape, 
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
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, numConcepts, 3, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape>

                <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, numConcepts, 4, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape>

                <Shape  
                    sceneFunc={(context, shape) => {
                        drawWaveButton(principles[0].XRefPoint, principles[0].YRefPoint, numConcepts, 5, context, shape, 
                            waveButtonDims.Principles['Width'], 
                            waveButtonDims.Principles['Height'], 
                            waveButtonDims.Principles['CornerRadius'])
                    }}
                    id={principles[0].IdText}
                    fill={waveButtonDims.Principles['Color']}
                    onClick={handleClick(principles)}
                ></Shape> */}
                
            </Layer>
        </Stage>
    );
};

export default OLDiagram;
