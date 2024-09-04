import React, { useRef, useState } from 'react';
import '../styles/PostIt.css'; 
import Draggable from 'react-draggable';

const PostIt = ({ position, isInitialPostIt, onDragStart, id, onDrop }) => {
  const [text, setText] = useState(''); // State to manage the text content
  const [isDragging, setIsDragging] = useState(false); // State to manage dragging status
  const [isHovered, setIsHovered] = useState(false); // State to manage hover status
  const nodeRef = useRef(null); // Create a ref to attach to the draggable element

  // Handle change in text input
  const handleChange = (event) => {
    setText(event.target.value);
  };

  // Event handlers for dragging
  const handleStart = () => {
    setIsDragging(true);
    if (onDragStart) {
      onDragStart();
    }
  };

  const handleStop = (e) => {
    const x = e.clientX+5;
    const y = e.clientY+5;
    
    if (onDrop) {
        onDrop({ x, y });
    }
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
      nodeRef={nodeRef} // Pass ref to Draggable
      position={isInitialPostIt ? undefined : { x: position.x, y: position.y }}
      onStart={handleStart}
      onStop={handleStop} 
      animation={false}
    >
      <div
        ref={nodeRef} // Attach ref to the draggable element
        className={`postit ${isInitialPostIt ? 'postit-initial' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{ opacity }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Write your idea here..."
          className="postit-textarea"
        />
      </div>
    </Draggable>
  );
};

export default PostIt;
