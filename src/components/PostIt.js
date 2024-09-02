import React, { useState } from 'react';
import '../styles/PostIt.css'; 
import Draggable from 'react-draggable';

const PostIt = ({ position, isInitialPostIt }) => {
  const [text, setText] = useState(''); // State to manage the text content
  const [isDragging, setIsDragging] = useState(false); // State to manage dragging status
  const [isHovered, setIsHovered] = useState(false); // State to manage hover status

  // Handle change in text input
  const handleChange = (event) => {
    setText(event.target.value);
  };

  // Event handlers for dragging
  const handleStart = () => {
    setIsDragging(true);
  };

  // Event handlers for hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Determine opacity based on drag and hover status
  const opacity = isInitialPostIt ? (isHovered || isDragging ? 1 : 0.5) : 1;

  return (
    <Draggable
      position={isInitialPostIt ? undefined : { x: position.x, y: position.y }}
      onStart={handleStart}
    >
      <div
        className={`postit ${isInitialPostIt ? 'postit-initial' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{ opacity }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Write your note here..."
          className="postit-textarea"
        />
      </div>
    </Draggable>
  );
};

export default PostIt;
