import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/icons/home-icon.svg'; // Adjust the path as necessary
import { ReactComponent as GoBackIcon } from '../assets/icons/go-back-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import '../styles/components/Menu.css';

const Menu = () => {
  const {
    colors,
    language,
    isExplanationPage
  } = useContext(StateContext);

  const location = useLocation();
  const currentPath = location.pathname;
  // Load the initial state from localStorage or set default to false
  // const [showMore, setShowMore] = useState(() => {
  //   const storedShowMore = localStorage.getItem('showMore');
  //   return storedShowMore === 'true'; // Convert string to boolean
  // });

  // Update localStorage whenever showMore changes
  // useEffect(() => {
  //   localStorage.setItem('showMore', showMore.toString());
  // }, [showMore]);

  // const toggleShowMore = () => {
  //   setShowMore(!showMore);
  // };

  document.documentElement.style.setProperty('--gray-color', colors['Gray']);

  // Determine the active button based on the current path
  const getActiveButton = (path) => {
    switch (path) {
      case '/':
        return 'intro-page';
      case '/home':
        return 'home';
      case '/get-started':
        return 'get-started';
      case '/learn':
        return 'learn';
      case '/learn2':
        return 'learn2';
      case '/get-inspired':
        return 'get-inspired';
      case '/map':
        return 'map';
      case '/map2':
        return 'map2';
      case '/contribute':
        return 'contribute';
      case '/contextualize':
        return 'contextualize';
      case '/compare':
        return 'compare';
      default:
        return null;
    }
  };
  
  const activeButton = getActiveButton(currentPath);
  const menuExpanded = (activeButton === 'home' || isExplanationPage);

  return (
    <div>
      <Link
        to="/home"
        className={`circle-button home ${activeButton === 'home' ? 'active' : ''}`}
      >
        <HomeIcon 
          className="home-icon" 
        />
      </Link>
      {menuExpanded &&
        <Link
          to="/"
          className={`circle-button go-back ${activeButton === 'intro-page' ? 'active' : ''}`}
        >
        <GoBackIcon 
          className="go-back-icon" 
        />
      </Link>
      }
      <div className="left-menu">
        {menuExpanded && 
          <p className='i-want-to-text'>
            {language === "pt" ? "Eu quero" : "I want to"}
          </p>
        }
        {(menuExpanded || activeButton === 'learn2') && 
          <Link
            to="/learn2"
            className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'learn2' ? 'active' : ''}`}
          >
            {language === "pt" ? "APRENDER" : "LEARN"}
          </Link>
        }
        {(menuExpanded || activeButton === 'get-inspired') && 
          <Link
            to="/get-inspired"
            className={`menu-button ${menuExpanded ? '' : 'solo'}  ${activeButton === 'get-inspired' ? 'active' : ''}`}
          >
            {language === "pt" ? "INSPIRAR-ME" : "GET INSPIRED"}
          </Link>
        }
        {(menuExpanded || activeButton === 'map2') && 
          <Link
            to="/contribute"
            className={`menu-button ${menuExpanded ? '' : 'solo'}  ${activeButton === 'contribute' ? 'active' : ''}`}
          >
            {language === "pt" ? "CONTRIBUIR" : "CONTRIBUTE"}
          </Link>
        }
        {(menuExpanded || activeButton === 'map2') && 
          <Link
            to="/map2"
            className={`menu-button ${menuExpanded ? '' : 'solo'}  ${activeButton === 'map2' ? 'active' : ''}`}
          >
            {language === "pt" ? "MAPEAR" : "MAP"}
          </Link>
        }
        {/*  (menuExpanded || activeButton === 'map') && 
          <Link
            to="/map"
            className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'map' ? 'active' : ''}`}
          >
            MAP
          </Link>
        }
        {{showMore && (
          <>
            {(menuExpanded || activeButton === 'get-started') && 
            <Link
              to="/get-started"
              className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'get-started' ? 'active' : ''}`}
            >
              GET STARTED
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
            {(menuExpanded || activeButton === 'learn') && 
              <Link
                to="/learn"
                className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'learn' ? 'active' : 'disabled'}`}
              >
                LEARN
              </Link>
            }
            {(menuExpanded || activeButton === 'contextualize') && 
              <Link
                to="/contextualize"
                className={`menu-button ${menuExpanded ? '' : 'solo'} ${activeButton === 'contextualize' ? 'active' : 'disabled'}`}
              >
                CONTEXTUALIZE
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
        } */}
      </div>
    </div>
  );
};

export default Menu;
