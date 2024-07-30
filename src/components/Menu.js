import React from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="bottom-menu">
      <Link to="/" className="menu-button">HOME</Link>
      <Link to="/learn" className="menu-button">LEARN</Link>
      <Link to="/get-inspired" className="menu-button">GET INSPIRED</Link>
      <Link to="/" className="menu-button">CONTEXTUALIZE</Link>
      <Link to="/" className="menu-button">ANALYZE</Link>
      <Link to="/" className="menu-button">IDEATE</Link>
      <Link to="/" className="menu-button">COMPARE</Link>
      <Link to="/" className="menu-button">+</Link>
    </div>
  );
};

export default Menu;