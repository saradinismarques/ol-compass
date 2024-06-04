// src/WaveButtonCanvas.js
import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Shape } from 'react-konva';

const WaveButton = ({ id, width, height, cornerRadius, color, all_principles }) => {

  const handleClick = (e) => {
    const id = e.target.id();
    console.log(all_principles[id]);
    alert(all_principles[id]['infoText'])
  }

  // function drawWaveButton(x, y, width, height, cornerRadius, color, context, shape) {
  //   const halfWidth = width / 2;
  //   const halfHeight = height / 2;
          
  //   const top = { x: x, y: y - halfHeight };
  //   const right = { x: x + halfWidth, y: y };
  //   const bottom = { x: x, y: y + halfHeight };
  //   const left = { x: x - halfWidth, y: y };

  //   context.beginPath();
  //   context.moveTo(right.x, right.y);
  //   context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
  //   context.lineTo(left.x, left.y);
  //   context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
  //   context.closePath();
  //   context.fillStrokeShape(shape);
  // }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      {all_principles.map((p) => (
      <Layer>
        <Shape
          sceneFunc={(context, shape) => {
            //drawWaveButton(p['x'], p['y'])
            const halfWidth = width / 2;
            const halfHeight = height / 2;
          
            const top = { x: p['x'], y: p['y'] - halfHeight };
            const right = { x: p['x'] + halfWidth, y: p['y'] };
            const bottom = { x: p['x'], y: p['y'] + halfHeight };
            const left = { x: p['x'] - halfWidth, y: p['y'] };

            context.beginPath();
            context.moveTo(right.x, right.y);
            context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
            context.lineTo(left.x, left.y);
            context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          key={p['id']}
          id={p['id']}
          fill={color}
          onClick={handleClick}
          //disabled={isDisabled}
        />
        <Text fontSize={20} text={p['mainText']} align="center" x={p['x']} y={p['y']}/>
      </Layer>
      ))}   
    </Stage>
  );
};

export default WaveButton;

//transform this code to detect witch star was clicked and not dragged and separate into 3 file: 1 that has the code to draw a start, one that draws a group of starts and the App.js that calls the second one to render the group of stars.
