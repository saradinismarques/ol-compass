import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/icons/home-icon.svg'; // Adjust the path as necessary
import { ReactComponent as GoBackIcon } from '../assets/icons/go-back-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { getLabelsTexts } from '../utils/DataExtraction.js';
import { replaceBoldsColoredBreaks } from '../utils/TextFormatting.js';
import '../styles/components/Menu.css';

const Menu = () => {
  const {
    language,
    firstUse,
    setFirstUse,
    showExplanation,
    setShowExplanation,
    setShowInstruction,
    showStudyInstruction,
    setShowStudyInstruction
  } = useContext(StateContext);

  const labelsTexts = getLabelsTexts(language, "menu");
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate(); // Initialize the navigate function

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
  const menuExpanded = (activeButton === 'home' || showExplanation);

  useEffect(() => {
    if ((firstUse["home"] && activeButton === 'home')) {
      const timer = setTimeout(() => {
        setShowStudyInstruction(true);
      }, 4000); // 5 seconds delay
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [firstUse, activeButton]); // Depend on firstUserVariable
  
  const handleShowStudyInstruction = (value) => {
    if(firstUse["home"])
      setFirstUse(prevState => ({
        ...prevState, // Keep all existing attributes
        home: false   // Update only 'home'
      }));
    setShowStudyInstruction(value);
  };

  const handleHomeClick = () => {
    setShowExplanation(true); // Reset to initial state when the page changes
    setShowInstruction(false);
  };

  const handlePrevPage = useCallback(() => {
    setShowExplanation(false); // Reset to initial state when the page changes

    if(activeButton === "learn2") 
      return;
    else if(activeButton === "get-inspired") {
      if(firstUse["learn"])
        setShowInstruction(true); // Reset to initial state when the page changes
      else
        setShowInstruction(false); // Reset to initial state when the page changes

      navigate('/learn2');
    }
    else if(activeButton === "map2") {
      if(firstUse["get-inspired"])
        setShowInstruction(true); // Reset to initial state when the page changes
      else
        setShowInstruction(false); // Reset to initial state when the page changes

      navigate('/get-inspired');
    }
  }, [navigate, setShowInstruction, setShowExplanation, activeButton, firstUse]);

  const handleNextPage = useCallback(() => {
    setShowExplanation(false); // Reset to initial state when the page changes
    setShowInstruction(false); // Reset to initial state when the page changes
  
    if(activeButton === "learn2") {
      if(firstUse["get-inspired"])
        setShowInstruction(true); // Reset to initial state when the page changes
      else
        setShowInstruction(false); // Reset to initial state when the page changes
  
      navigate('/get-inspired');
    } else if(activeButton === "get-inspired") {
      if(firstUse["map"])
        setShowInstruction(true); // Reset to initial state when the page changes
      else
        setShowInstruction(false); // Reset to initial state when the page changes
  
      navigate('/map2');
    } else if(activeButton === "map2") 
      return;
    }, [navigate, setShowInstruction, setShowExplanation, activeButton, firstUse]);

  return (
    <div>
       {showStudyInstruction && (
        <div className="menu-message-box">
          <div className="menu-message-question">
            {labelsTexts["study-instructions"]}
          </div>
          {replaceBoldsColoredBreaks(
            labelsTexts["study-instructions-text"],
          'menu-message-text', 'menu-message-text bold', 'menu-message-text blue')}
          <button 
            className="menu-got-it-button" 
            onClick={() => handleShowStudyInstruction(false)}
          >
            {labelsTexts["ok-got-it"]}
          </button>
        </div>
      )}
      <Link
        to="/home"
        className={`circle-button home ${activeButton === 'home' ? 'active' : ''}`}
        onClick={handleHomeClick}
      >
        <HomeIcon 
          className="home-icon" 
        />
      </Link>
      <Link
        to="/"
        className={`circle-button go-back ${activeButton === 'intro-page' ? 'active' : ''}`}
      >
        <GoBackIcon 
          className="go-back-icon" 
        />
      </Link>
      {(!firstUse["home"] || activeButton !== 'home') &&
        <button 
          className='menu-study-instructions'
          onClick={() => handleShowStudyInstruction(true)}
        >
            STUDY INSTRUCTIONS
        </button>
      }
      {!menuExpanded &&
          <>
          <div className='menu-arrow-container'>
            <button
              className={`menu-arrow-button left ${activeButton === "learn2" ? "disabled" : ""}`}
              onClick={handlePrevPage}
            >
              <ArrowIcon className='menu-arrow-icon' />
            </button>
            <button
              className={`menu-arrow-button right ${activeButton === "map2" ? "disabled" : ""}`}
              onClick={handleNextPage}
            >
              <ArrowIcon className='menu-arrow-icon' />
            </button>
          </div>
          </>
      }
      <div className="left-menu">
        {menuExpanded && 
          <div className='i-want-to-text'>
            {labelsTexts["lets"]}
          </div>
        }
        
        {(menuExpanded || activeButton === 'learn2') && 
          <Link
            to="/learn2"
            className={`menu-button ${menuExpanded ? '' : 'solo'} 
              ${activeButton === 'learn2' && !showExplanation ? 'active' : ''} 
              ${activeButton === 'learn2' && showExplanation ? 'semi-active' : ''}`}
          >
            {labelsTexts["learn"]}
          </Link>
        }
        
        {(menuExpanded || activeButton === 'get-inspired') && 
          <Link
            to="/get-inspired"
            className={`menu-button ${menuExpanded ? '' : 'solo'} 
              ${activeButton === 'get-inspired' && !showExplanation ? 'active' : ''} 
              ${activeButton === 'get-inspired' && showExplanation ? 'semi-active' : ''}`}
          >
            {labelsTexts["get-inspired"]}
          </Link>
        }

        {(menuExpanded || activeButton === 'map2') && 
          <Link
            to="/map2"
            className={`menu-button ${menuExpanded ? '' : 'solo'} 
              ${activeButton === 'map2' && !showExplanation ? 'active' : ''} 
              ${activeButton === 'map2' && showExplanation ? 'semi-active' : ''}`}
          >
            {labelsTexts["map"]}
          </Link>
        }
        {/* <div className='guideline-1'></div>
        <div className='guideline-2'></div>
        <div className='guideline-3'></div>
        <div className='guideline-4'></div>
        <div className='guideline-5'></div>
        <div className='guideline-6'></div>
        <div className='guideline-7'></div>
        <div className='guideline-8'></div>
        <div className='guideline-9'></div>
        <div className='guideline-10'></div>
        <div className='guideline-11'></div> */}
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
      {menuExpanded &&
        <div className='menu-background'></div>
      }
    </div>
  );
};

export default Menu;
