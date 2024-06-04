// src/WaveButtonCanvas.js
import React from 'react';
import WaveButton from './WaveButton';

const Principles = () => {
    // const handleClick = (event) => {
    //     const canvasId = event.currentTarget.id;
    //     console.log(canvasId)
    //     if (canvasId.startsWith('canvas-')) {
    //       const canvasIndex = parseInt(canvasId.split('-')[1]);
    //       // Handle click event for the canvas with index canvasIndex
    //       console.log(`Canvas ${canvasIndex} clicked`);
    //     }
    // };

    // Add event listener to handle clicks on all canvases
    //document.addEventListener('click', handleClick);

    const handleButtonCLick = (e) => {
        console.log(e.target.id);
    };

    document.addEventListener('click', handleButtonCLick);


    const x = 200;
    const y = 200;
    const width = 170;
    const height = 110;
    const cornerRadius = 40;
    const color = '#99f6be'

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const margin = 3;

    const p1 = { x: x, y: y };
    const p2 = { x: x - halfWidth - margin, y: y - halfHeight - margin };
    const p3 = { x: x + halfWidth + margin, y: y - halfHeight - margin };
    const p4 = { x: x, y: y - height - 2 * margin };
    const p5 = { x: x - halfWidth - margin, y: y + halfHeight + margin };
    const p6 = { x: x + halfWidth + margin, y: y + halfHeight + margin };
    const p7 = { x: x, y: y + height + 2 * margin };

    const arr = [0, 1, 2, 3, 4, 5, 6];
    const refPoints = [p1, p2, p3, p4, p5, p6, p7];
    const mainTexts = ['A', 'B', 'C'];
    const idTexts = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
    const infoTexts = ['a', 'b', 'c'];

    const principles = arr.map((i) => 
        <WaveButton 
            key={i.toString()} 
            id={`canvas-${i}`}
            x={refPoints[i]['x']}
            y={refPoints[i]['y']}
            width={width}
            height={height}
            cornerRadius={cornerRadius} 
            mainText={mainTexts[i]}
            idText={idTexts[i]}
            color = {color}
            infoText={infoTexts[i]}
            onClick={(e) => handleButtonCLick(e)}
        />);

    return (
        <div>
        {principles}
        </div>
    );
};

export default Principles;
