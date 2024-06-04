// src/WaveButtonCanvas.js
import React, { useRef, useEffect } from 'react';

const WaveButton = ({ id, x, y, width, height, cornerRadius, mainText, idText, color, infoText }) => {
  const canvasRef = useRef(null);
  const paths = [];

  useEffect(() => {
    
    const canvas = canvasRef.current;

    console.log(`Initializing canvas with id: ${id}`);
    const context = canvas.getContext('2d');
    
    // Clear canvas
    console.log(`Clearing canvas with id: ${id}`);
    context.clearRect(0, 0, canvas.width, canvas.height);

    console.log(`Canvas dimensions - x: ${x}, y: ${y}`);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
   
    const top = { x: x, y: y - halfHeight };
    const right = { x: x + halfWidth, y: y };
    const bottom = { x: x, y: y + halfHeight };
    const left = { x: x - halfWidth, y: y };

    let path = new Path2D();

    console.log(`Drawing shape on canvas with id: ${id}`);
    context.beginPath();
    // Move to the top point
    //context.moveTo(top.x+cornerRadius, top.y+cornerRadius);
    // Draw line to the right point
    path.moveTo(right.x, right.y);
    // Draw line to the bottom with rounded corner
    path.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
    // Draw line to the left point
    path.lineTo(left.x, left.y);
    // Draw line to the top with rounded corner
    path.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
    
    context.closePath();

    paths.push(path);

    // Fill and stroke
    context.fillStyle = color;
    context.fill(path);

    console.log(path); 
    // Rotate Button
    // context.save();
    // context.translate(1, 1);
    // context.rotate(Math.PI / 180 * 90);

    const circleRadius = 3;
    
    // Draw circle at position (x, y)
    context.beginPath();
    context.arc(x, y, circleRadius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    // Draw circle at position (x, y)
    context.beginPath();
    context.arc(top['x'], top['y'], circleRadius, 0, Math.PI * 2);
    context.fillStyle = 'blue';
    context.fill();
    // Draw circle at position (x, y)
    context.beginPath();
    context.arc(right['x'], right['y'], circleRadius, 0, Math.PI * 2);
    context.fillStyle = 'green';
    context.fill();  
    // Draw circle at position (x, y)
    context.beginPath();
    context.arc(left['x'], left['y'], circleRadius, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    // Draw circle at position (x, y)
    context.beginPath();
    context.arc(bottom['x'], bottom['y'], circleRadius, 0, Math.PI * 2);
    context.fillStyle = 'brown';
    context.fill();


    // Draw main text
    context.fillStyle = 'white';
    context.font = '500 16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    //context.fillText(mainText, x + width / 2, y + height / 2);
    context.fillText(mainText, x, y );

    // Draw identifier
    context.fillStyle = 'white';
    
    context.font = '100 16px Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    //context.fillText(idText, x + width / 2, y + height / 2 - height / 4);
    context.fillText(idText, x, y - height / 4);

  
    // canvas.addEventListener('click', function(e) {
    //   console.log(e.target.mainText);
    // });
    // // Add event listener
    // console.log(`CONTEXT ${context} clicked`);

    //canvas.addEventListener('click', handleClick);

    // // Cleanup function to remove event listener
    // return () => {
    //   console.log(`Cleaning up canvas with id: ${id}`);
    //   canvas.removeEventListener('click', handleClick);
    // };

    // canvas.addEventListener('click', (event) => { 
    //   console.log(`Adding event listener to canvas with id: ${id}`);
    //   if (context.isPointInPath(path, event.offsetX, event.offsetY)) 
    //     alert(infoText); 
    // });

    // const handleClick = (event) => {
    //   console.log(`Canvas with id: ${id} clicked at position: (${event.offsetX}, ${event.offsetY})`);
    //   if (context.isPointInPath(path, event.offsetX, event.offsetY)) {
    //     alert(infoText);
    //   }
    // };

    // console.log(`Adding event listener to canvas with id: ${id}`);
    // canvas.addEventListener('click', handleClick);

    //     // Cleanup function to remove event listener
    //     return () => {
    //       console.log(`Removing event listener from canvas with id: ${id}`);
    //       canvas.removeEventListener('click', handleClick);
    //     };

  //context.save();
  }, [id, x, y, width, height, cornerRadius, mainText, idText, color, infoText]);

  function handleClick(id) {
    console.log(id); // logs the button element that was clicked
  }

  //canvas.addEventListener('click', function() => { }, false);

  return (
    <canvas id={id} ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ position: 'absolute', left: 0, top: 0 }}/>
  );
};

export default WaveButton;
