// src/components/Circle.js

import React from 'react';

const Circle = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
    };

    const circleStyle = {
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: '#99f6be',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#99f6be',
        fontSize: '16px'
    };

  return (
    <div style={containerStyle}>
      <div style={circleStyle}>
        Circle
      </div>
    </div>
  );
};

export default Circle;
