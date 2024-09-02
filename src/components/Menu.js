import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Menu.css';

const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine the active button based on the current path
  const getActiveButton = (path) => {
    switch (path) {
      case '/home':
        return 'home';
      case '/learn':
        return 'learn';
      case '/get-inspired':
        return 'get-inspired';
      case '/contextualize':
        return 'contextualize';
      case '/analyze':
        return 'analyze';
      case '/ideate':
        return 'ideate';
      case '/compare':
        return 'compare';
      case '/evaluate':
        return 'evaluate';
      case '/make-yours':
        return 'make-yours';
      default:
        return null;
    }
  };

  const activeButton = getActiveButton(currentPath);

  return (
    <div className="bottom-menu">
      <Link
        to="/home"
        className={`menu-button ${activeButton === 'home' ? 'active' : ''}`}
      >
        HOME
      </Link>
      <Link
        to="/learn"
        className={`menu-button ${activeButton === 'learn' ? 'active' : ''}`}
      >
        LEARN
      </Link>
      <Link
        to="/get-inspired"
        className={`menu-button ${activeButton === 'get-inspired' ? 'active' : ''}`}
      >
        GET INSPIRED
      </Link>
      <Link
        to="/contextualize"
        className={`menu-button ${activeButton === 'contextualize' ? 'active' : ''}`}
      >
        CONTEXTUALIZE
      </Link>
      <Link
        to="/analyze"
        className={`menu-button ${activeButton === 'analyze' ? 'active' : ''}`}
      >
        ANALYZE
      </Link>
      <Link
        to="/ideate"
        className={`menu-button ${activeButton === 'ideate' ? 'active' : ''}`}
      >
        IDEATE
      </Link>
      <Link
        to="/compare"
        className={`menu-button ${activeButton === 'compare' ? 'active' : 'disabled'}`}
      >
        COMPARE
      </Link>
      <Link
        to="/evaluate"
        className={`menu-button ${activeButton === 'evaluate' ? 'active' : 'disabled'}`}
      >
        EVALUATE
      </Link>
      <Link
        to="/make-yours"
        className={`menu-button ${activeButton === 'make-yours' ? 'active' : 'disabled'}`}
      >
        MAKE YOURS
      </Link>
      <Link
        to="/some-other-path"
        className={`menu-button ${activeButton === 'plus' ? 'active' : 'disabled'}`}
      >
        +
      </Link>
    </div>
  );
};

export default Menu;
