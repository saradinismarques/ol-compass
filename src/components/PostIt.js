// PostIt.js

import React, { useState } from 'react';
import '../styles/PostIt.css'; 
import Draggable from 'react-draggable';

const PostIt = () => {
  const [text, setText] = useState(''); // State to manage the text content

  // Handle change in text input
  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <Draggable>
        <div className="postit">
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
