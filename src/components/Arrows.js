import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Arrows = () => {
    
    const drawLines = (arr, index, color) => {
        const pointX = arr[index].x;
        const pointY = arr[index].y;

        setCurrentLine(prevCurrentLine => {
            const newLine = [...prevCurrentLine, pointX, pointY];
            return newLine;
        });

        if (!lineColors.includes(color)) {
            setLineColors([...lineColors, color]);
        }
    };

    const handleRightClick = (event) => {
        event.preventDefault();

        if (currentLine.length > 0) {
            setLines(prevLines => [...prevLines, currentLine]);
            setCurrentLine([]);
        }
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onContextMenu={handleRightClick}>
            <Layer>
                {lines.map((line, index) => (
                    <Line
                        key={index}
                        points={line}
                        stroke={lineColors[index] || 'black'}  // Use corresponding color or default to black
                        strokeWidth={1}
                        dash={[2, 2]}  // This makes the line dotted
                    />
                ))}
                {currentLine.length > 0 && (
                    <Line
                        points={currentLine}
                        stroke={lineColors[lineColors.length - 1] || 'black'}  // Use the last color in the array
                        strokeWidth={1}
                        dash={[2, 2]}  // This makes the line dotted
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default Arrows;
