import React from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="bottom-menu">
      <Link to="/" className="menu-button">HOME</Link>
      <Link to="/learn" className="menu-button">LEARN</Link>
      <button className="menu-button">GET INSPIRED</button>
      <button className="menu-button">CONTEXTUALIZE</button>
      <button className="menu-button">ANALYZE</button>
      <button className="menu-button">IDEATE</button>
      <button className="menu-button">COMPARE</button>
      <button className="menu-button">+</button>
    </div>
  );
};

export default Menu;