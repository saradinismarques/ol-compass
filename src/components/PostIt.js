import React, { useState } from 'react';
import '../styles/PostIt.css'; 
import Draggable from 'react-draggable';

const PostIt = () => {
  const [text, setText] = useState(''); // State to manage the text content
  const [isDragging, setIsDragging] = useState(false); // State to manage dragging status
  const [hasBeenDragged, setHasBeenDragged] = useState(false); // State to manage drag status

  // Handle change in text input
  const handleChange = (event) => {
    setText(event.target.value);
  };

  // Event handlers for dragging
  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    setIsDragging(false);
    setHasBeenDragged(true); // Mark as dragged
  };

  return (
    <Draggable onStart={handleStart} onStop={handleStop}>
      <div className={`postit ${isDragging || hasBeenDragged ? 'dragging' : ''}`}>
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
