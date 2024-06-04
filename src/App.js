// src/App.js
import React from 'react';
import WaveButton from './WaveButton';
import Principles from './Principles';

function App() {
  const handleClick = () => {
    alert('Diamond button clicked!');
  };

  return (
    <div>
      <Principles
      />
    </div>
  );
}

export default App;
