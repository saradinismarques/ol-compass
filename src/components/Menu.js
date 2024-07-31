import React, { useState } from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <div className="bottom-menu">
      <Link 
        to="/home" 
        className={`menu-button ${activeButton === 'home' ? 'active' : ''}`} 
        onClick={() => handleClick('home')}
      >
        HOME
      </Link>
      <Link 
        to="/learn" 
        className={`menu-button ${activeButton === 'learn' ? 'active' : ''}`} 
        onClick={() => handleClick('learn')}
      >
        LEARN
      </Link>
      <Link 
        to="/get-inspired" 
        className={`menu-button ${activeButton === 'get-inspired' ? 'active' : ''}`} 
        onClick={() => handleClick('get-inspired')}
      >
        GET INSPIRED
      </Link>
      <Link 
        to="/" 
        className={`menu-button ${activeButton === 'contextualize' ? 'active' : ''}`} 
        onClick={() => handleClick('contextualize')}
      >
        CONTEXTUALIZE
      </Link>
      <Link 
        to="/" 
        className={`menu-button ${activeButton === 'analyze' ? 'active' : ''}`} 
        onClick={() => handleClick('analyze')}
      >
        ANALYZE
      </Link>
      <Link 
        to="/" 
        className={`menu-button ${activeButton === 'ideate' ? 'active' : ''}`} 
        onClick={() => handleClick('ideate')}
      >
        IDEATE
      </Link>
      <Link 
        to="/" 
        className={`menu-button ${activeButton === 'compare' ? 'active' : ''}`} 
        onClick={() => handleClick('compare')}
      >
        COMPARE
      </Link>
      <Link 
        to="/" 
        className={`menu-button ${activeButton === 'plus' ? 'active' : ''}`} 
        onClick={() => handleClick('plus')}
      >
        +
      </Link>
    </div>
  );
};

export default Menu;
