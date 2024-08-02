import React from 'react';
import { Stage, Layer, Shape, Group, Line, Circle } from 'react-konva';
 // Assuming you're using react-konva

// Define the CircleComponent class
const CircleComponent = () => {
    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Circle
                    x={window.innerWidth*0.35}
                    y={window.innerHeight*0.45}
                    radius={450/2}
                    fill="transparent" // Make the circle fill transparent
                    stroke="red"    // Set the stroke color
                    strokeWidth={2} // Set the stroke width
                />
        </Layer>
    </Stage>
    );
};

export default CircleComponent;
