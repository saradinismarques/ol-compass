import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/Menu.css';
import { ReactComponent as HomeIcon } from '../assets/icons/home-icon.svg'; // Adjust the path as necessary

const Menu = ({isExplanationPage}) => {
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
      case '/home':
        return 'home';
      case '/get-started':
        return 'get-started';
      case '/learn':
        return 'learn';
      case '/get-inspired':
        return 'get-inspired';
      case '/analyse':
        return 'analyse';
      case '/contribute':
        return 'contribute';
      case '/contextualize':
        return 'contextualize';
      case '/ideate':
        return 'ideate';
      case '/compare':
        return 'compare';
      default:
        return null;
    }
  };
  
  const activeButton = getActiveButton(currentPath);
  const menuExpanded = (activeButton === 'home' || isExplanationPage);

  return (
    <>
      <Link
        to="/home"
        className={`home-button ${activeButton === 'home' ? 'active' : ''}`}
      >
        <HomeIcon 
          className="home-icon" 
        />
      </Link>
      <div className="left-menu">
        {menuExpanded && 
          <p className='i-want-to-text'>I want to</p>
        }
        {(menuExpanded || activeButton === 'get-started') && 
          <Link
            to="/get-started"
            className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'get-started' ? 'active' : ''}`}
          >
            GET STARTED
          </Link>
        }
        {(menuExpanded || activeButton === 'learn') && 
          <Link
            to="/learn"
            className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'learn' ? 'active' : ''}`}
          >
            LEARN
          </Link>
        }
        {(menuExpanded || activeButton === 'get-inspired') && 
          <Link
            to="/get-inspired"
            className={`menu-button ${menuExpanded ? '' : 'solo'}  ${activeButton === 'get-inspired' ? 'active' : ''}`}
          >
            GET INSPIRED
          </Link>
        }
        {(menuExpanded || activeButton === 'analyse') && 
          <Link
            to="/analyse"
            className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'analyse' ? 'active' : ''}`}
          >
            ANALYSE
          </Link>
        }
        {(menuExpanded || activeButton === 'contribute') && 
          <Link
            to="/contribute"
            className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'contribute' ? 'active' : ''}`}
          >
            CONTRIBUTE
          </Link>
        }
        {showMore && (
          <>
            {(menuExpanded || activeButton === 'contextualize') && 
              <Link
                to="/contextualize"
                className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'contextualize' ? 'active' : 'disabled'}`}
              >
                CONTEXTUALIZE
              </Link>
            }
            {(menuExpanded || activeButton === 'ideate') && 
              <Link
                to="/ideate"
                className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'ideate' ? 'active' : 'disabled'}`}
              >
                IDEATE
              </Link>
            }
            {(menuExpanded || activeButton === 'compare') && 
              <Link
                to="/compare"
                className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'compare' ? 'active' : 'disabled'}`}
              >
                COMPARE
              </Link>
            }
          </>
        )}
        {(menuExpanded) && 
          <button onClick={toggleShowMore} className="menu-button show-more">
            {showMore ? '-' : '+'}
          </button>
        }
      </div>
    </>
  );
};

export default Menu;
