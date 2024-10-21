import React, { useState, useEffect, act } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Menu.css';
import { ReactComponent as HomeIcon } from '../assets/home-icon.svg'; // Adjust the path as necessary

const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  // Load the initial state from localStorage or set default to false
  const [showMore, setShowMore] = useState(() => {
    const storedShowMore = localStorage.getItem('showMore');
    return storedShowMore === 'true'; // Convert string to boolean
  });

  // Update localStorage whenever showMore changes
  useEffect(() => {
    localStorage.setItem('showMore', showMore.toString());
  }, [showMore]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Determine the active button based on the current path
  const getActiveButton = (path) => {
    switch (path) {
      case '/ol-compass/home':
        return 'home';
      case '/ol-compass/learn':
        return 'learn';
      case '/ol-compass/get-inspired':
        return 'get-inspired';
      case '/ol-compass/contribute':
        return 'contribute';
      case '/ol-compass/contextualize':
        return 'contextualize';
      case '/ol-compass/ideate':
        return 'ideate';
      case '/ol-compass/compare':
        return 'compare';
      default:
        return null;
    }
  };

  const activeButton = getActiveButton(currentPath);

  return (
    <div>
      <Link
        to="/ol-compass/home"
        className={`menu-button home ${activeButton === 'home' ? 'active' : ''}`}
      >
        <HomeIcon 
          className="home-icon" 
        />
      </Link>
      <div className="bottom-menu">

      {activeButton === 'home' && 
        <>
        <p className='i-want-to-text'>I want to</p>
        </>
      }
      {(activeButton === 'home' || activeButton === 'learn') && 
        <>
        <Link
          to="/ol-compass/learn"
          className={`menu-button ${activeButton !== 'home' ? 'solo' : ''} ${activeButton === 'learn' ? 'active' : ''}`}
        >
          LEARN
        </Link>
        </>
      }
      {(activeButton === 'home' || activeButton === 'get-inspired') && 
        <>
        <Link
          to="/ol-compass/get-inspired"
          className={`menu-button ${activeButton !== 'home' ? 'solo' : ''}  ${activeButton === 'get-inspired' ? 'active' : ''}`}
        >
          GET INSPIRED
        </Link>
        </>
      }
      {(activeButton === 'home' || activeButton === 'contribute') && 
        <>
        <Link
          to="/ol-compass/contribute"
          className={`menu-button ${activeButton !== 'home' ? 'solo' : ''} ${activeButton === 'contribute' ? 'active' : ''}`}
        >
          CONTRIBUTE
        </Link>
        </>
      }
      {showMore && (
        <>
          {(activeButton === 'home' || activeButton === 'contextualize') && 
          <>
          <Link
            to="/ol-compass/contextualize"
            className={`menu-button ${activeButton !== 'home' ? 'solo' : ''} ${activeButton === 'contextualize' ? 'active' : 'disabled'}`}
          >
            CONTEXTUALIZE
          </Link>
          </>
          }
          {(activeButton === 'home' || activeButton === 'ideate') && 
          <>
           <Link
            to="/ol-compass/ideate"
            className={`menu-button ${activeButton !== 'home' ? 'solo' : ''} ${activeButton === 'ideate' ? 'active' : 'disabled'}`}
          >
            IDEATE
          </Link>
          </>
          }
          {(activeButton === 'home' || activeButton === 'compare') && 
          <>
          <Link
            to="/ol-compass/compare"
            className={`menu-button ${activeButton !== 'home' ? 'solo' : ''} ${activeButton === 'compare' ? 'active' : 'disabled'}`}
          >
            COMPARE
          </Link>
          </>
          }
        </>
      )}
      {activeButton === 'home' && 
        <>
        <button onClick={toggleShowMore} className="menu-button show-more">
          {showMore ? '-' : '+'}
        </button>
        </>
      }
      </div>
    </div>
  );
};

export default Menu;
