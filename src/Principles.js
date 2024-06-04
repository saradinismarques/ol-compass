// src/WaveButtonCanvas.js
import React from 'react';
import WaveButton from './WaveButton';

const Principles = () => {
    const x = 200;
    const y = 200;
    const width = 170;
    const height = 110;
    const cornerRadius = 40;
    const color = '#99f6be';

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
    const mainTexts = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const idTexts = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
    const infoTexts = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    const  all_principles = arr.map((i) => ({
        id: i.toString(),
        x: refPoints[i].x,
        y: refPoints[i].y,
        mainText: mainTexts[i],
        idText: idTexts[i],
        infoText: infoTexts[i],
        clicked: false
    }));

    console.log(all_principles);
    const principles = arr.map((i) => 
        <WaveButton 
            width={width}
            height={height}
            cornerRadius={cornerRadius} 
            color={color}
            all_principles = {all_principles}
        />

    //     <WaveButton 
    //     id={i}
    //     x={refPoints[i].x}
    //     y={refPoints[i].y}
    //     width={width}
    //     height={height}
    //     cornerRadius={cornerRadius} 
    //     mainText={mainTexts[i]}
    //     idText={idTexts[i]}
    //     color={color}
    //     infoText={infoTexts[i]}
    //     all_principles = {all_principles}
    // />
    );


    return (
        <div>
            {principles}
        </div>
    );
};

export default Principles;
