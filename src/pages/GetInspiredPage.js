import React, { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass.js';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { getGetInspiredData } from '../utils/DataExtraction.js'; 
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import '../styles/pages/GetInspiredPage.css';

const GetInspiredPage = () => {
  const {
    colors,
    firstMessage,
    isExplanationPage,
    setIsExplanationPage,
    savedCaseStudies,
    setSavedCaseStudies,
    newCaseStudies,
  } = useContext(StateContext);

  const initialCaseStudy = useMemo(() => ({
    title: '', 
    collection: '',
    mainTarget: '',
    age: '',
    time: '',
    type: '',
    languages: '',
    year: '',
    description: '',
    credits: '',
    components: [],
    bookmark: false,
  }), []);

  const [currentCaseStudy, setCurrentCaseStudy] = useState(initialCaseStudy);
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselMode, setCarouselMode] = useState(true);
  const [mode, setMode] = useState('get-inspired');
  const [resultsNumber, setResultsNumber] = useState(-1);
  const [searchLogic, setSearchLogic] = useState('OR');
  const [components, setComponents] = useState([]);
  const [currentComponents, setCurrentComponents] = useState();
  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const carouselModeRef = useRef(carouselMode);
  const searchLogicRef = useRef(searchLogic);
  const componentsRef = useRef(components);
  const showMessageRef = useRef(showMessage);

  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  useEffect(() => {
    carouselModeRef.current = carouselMode;
  }, [carouselMode]);

  useEffect(() => {
    searchLogicRef.current = searchLogic;
  }, [searchLogic]);

  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--selection-hover-color', colors['Selection Hover']);
  document.documentElement.style.setProperty('--bookmark-cs-color', colors['CSBookmark']);
  document.documentElement.style.setProperty('--bookmark-cs-hover-color', colors['CSBookmark Hover']);
  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

  const resetState = useCallback(() => {
      navigate('/home');
  }, [navigate]);
  
  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((title) => {
    return savedCaseStudies.length !== 0 && savedCaseStudies.some(item => item.title === title);
  }, [savedCaseStudies]);

  const handleCompassClick = (code) => {
    // if(firstClick && firstMessage["get-inspired"]) {
    //   setFirstClick(false);
    //   setShowMessage(true);
    //   showMessageRef.current = true;
    // }

    setComponents(prevComponents => {
      const newComponents = prevComponents.includes(code)
        ? prevComponents.filter(buttonId => buttonId !== code) // Remove ID if already clicked
        : [...prevComponents, code]; // Add ID if not already clicked
      componentsRef.current = newComponents;
      
      // Return the updated state
      return newComponents;
    });

    setIsExplanationPage(false);
    setCarouselMode(false);
    carouselModeRef.current = false;
    setMode('get-inspired');
  };

  const messageStateChange = (state) => {
    setShowMessage(state);
    showMessageRef.current = state;
  };

  const searchCaseStudies = useCallback((searchedComponents) => {
    let allCaseStudies;
    if(searchLogicRef.current === 'SAVED')
      allCaseStudies = savedCaseStudies;
    else 
      // Concatenate the fetched case studies with newCaseStudies
      allCaseStudies = [...getGetInspiredData(), ...newCaseStudies];

    // Process the JSON data
    let filteredCaseStudies = allCaseStudies;
    
    if (searchedComponents !== null) {
      filteredCaseStudies = allCaseStudies.filter(item => {
        if (searchLogicRef.current === 'AND') {
          // AND mode: all components must be present in the item's Components array
          return searchedComponents.every(component => item.components.includes(component));
        } else if (searchLogicRef.current === 'OR') {
          // OR mode: at least one component must be present in the item's Components array
          return searchedComponents.some(component => item.components.includes(component));
        } else {
          return searchedComponents;
        }
      });
    } 

    setCaseStudies(filteredCaseStudies);
    setResultsNumber(filteredCaseStudies.length);

    if (filteredCaseStudies.length > 0) {
      setCurrentIndex(0); // Reset to first case study
      
      setCurrentCaseStudy((prevCaseStudy) => ({
        ...prevCaseStudy,
        title: filteredCaseStudies[0].title,
        collection: filteredCaseStudies[0].collection,
        mainTarget: filteredCaseStudies[0].mainTarget,
        age: filteredCaseStudies[0].age,
        time: filteredCaseStudies[0].time,
        type: filteredCaseStudies[0].type,
        languages: filteredCaseStudies[0].languages,
        year: filteredCaseStudies[0].year,
        description: filteredCaseStudies[0].description,
        credits: filteredCaseStudies[0].credits,
        components: filteredCaseStudies[0].components,
        bookmark: getBookmarkState(filteredCaseStudies[0].title),
      }));
      setCurrentComponents(filteredCaseStudies[0].components)
    }

    if (filteredCaseStudies.length === 0) {
      setCurrentCaseStudy((prevCaseStudy) => ({
        ...prevCaseStudy,
        title: "No cases found with those filters",
        collection: '',
        mainTarget: '',
        age: '',
        time: '',
        type: '',
        languages: '',
        year: '',
        description: '',
        credits: '',
        components: []
      }));
    }
  }, [newCaseStudies, getBookmarkState, savedCaseStudies]);

  const handleDefaultSearch = useCallback(() => {
    setMode('get-inspired-search');
    searchCaseStudies(componentsRef.current);
  }, [searchCaseStudies]);

  const handleCarouselSearch = useCallback(() => {
    setCarouselMode(true);
    carouselModeRef.current = true;

    // if(firstClick && firstMessage["get-inspired"]) {
    //   setShowMessage(true);
    //   showMessageRef.current = true;
    //   setFirstClick(false);
    // }

    if (!isExplanationPage) return;
    
    setIsExplanationPage(false);
    searchCaseStudies(null);
    setMode('get-inspired-carousel');

  }, [firstMessage, isExplanationPage, searchCaseStudies, firstClick, setIsExplanationPage]);
  
  const handleSavedCaseStudiesSearch = useCallback(() => {
    setMode('get-inspired-carousel');
    carouselModeRef.current = true;
  

    if(searchLogicRef.current === 'SAVED') {
      setSearchLogic('OR');
      searchLogicRef.current = 'OR';  
      setCurrentComponents([]);
      setResultsNumber(-1);
    } else {
      setSearchLogic('SAVED');
      searchLogicRef.current = 'SAVED';  
      searchCaseStudies(null);
    }
   
  }, [searchCaseStudies]);

  const handleNext = useCallback(() => {
    if (currentIndex < caseStudies.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      setCurrentCaseStudy({
        ...currentCaseStudy,
        title: caseStudies[nextIndex].title,
        collection: caseStudies[nextIndex].collection,
        mainTarget: caseStudies[nextIndex].mainTarget,
        age: caseStudies[nextIndex].age,
        time: caseStudies[nextIndex].time,
        type: caseStudies[nextIndex].type,
        languages: caseStudies[nextIndex].languages,
        year: caseStudies[nextIndex].year,
        description: caseStudies[nextIndex].description,
        credits: caseStudies[nextIndex].credits,
        components: caseStudies[nextIndex].components,
        bookmark: getBookmarkState(caseStudies[nextIndex].title),
      });
      setCurrentComponents(caseStudies[nextIndex].components)
    }
  }, [caseStudies, currentIndex, getBookmarkState, currentCaseStudy]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      setCurrentCaseStudy({
        ...currentCaseStudy,
        title: caseStudies[prevIndex].title,
        collection: caseStudies[prevIndex].collection,
        mainTarget: caseStudies[prevIndex].mainTarget,
        age: caseStudies[prevIndex].age,
        time: caseStudies[prevIndex].time,
        type: caseStudies[prevIndex].type,
        languages: caseStudies[prevIndex].languages,
        year: caseStudies[prevIndex].year,
        description: caseStudies[prevIndex].description,
        credits: caseStudies[prevIndex].credits,
        components: caseStudies[prevIndex].components,
        bookmark: getBookmarkState(caseStudies[prevIndex].title),
      });
      setCurrentComponents(caseStudies[prevIndex].components)

    }
  }, [caseStudies, currentIndex, getBookmarkState, currentCaseStudy]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if(e.key === 'Enter' && carouselModeRef.current && !showMessageRef.current) 
      handleCarouselSearch();
    else if(e.key === 'Enter' && !carouselModeRef.current && !showMessageRef.current) 
      handleDefaultSearch();
    else if (e.key === 'ArrowLeft') 
      handlePrev();
    else if (e.key === 'ArrowRight') 
      handleNext();
  }, [handlePrev, handleNext, handleDefaultSearch, handleCarouselSearch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCarouselSearch, handleKeyDown]); // Dependency array includes carouselHandleEnterClick

  const toggleBookmark = () => {
    setSavedCaseStudies((prevSavedCaseStudies) => {
      const exists = prevSavedCaseStudies.some(item => item.title === currentCaseStudy.title);
  
      if (exists) {
        // Remove the case study if it already exists
        return prevSavedCaseStudies.filter(item => item.title !== currentCaseStudy.title);
      }
  
      // Otherwise, add the entire case study object
      return [...prevSavedCaseStudies, currentCaseStudy];
    });
  
    setCurrentCaseStudy({
      ...currentCaseStudy,
      bookmark: !currentCaseStudy.bookmark,
    });
  };  

  const handleSearchLogicChange = useCallback((mode) => {
    if(mode === "AND") {
      setSearchLogic('AND');
      searchLogicRef.current = 'AND';
    } else if(mode === "OR") {
      setSearchLogic('OR');
      searchLogicRef.current = 'OR';
    }
  }, []);

  return (
    <>
      <div className={`${showMessage ? "blur-background" : ""}`}>
        <Compass
          mode={mode}
          position={isExplanationPage ? "center" : "left"}
          resetState={resetState} // Passing resetState to OLCompass
          onButtonClick={handleCompassClick}
          currentComponent={currentComponents}
        />
        {isExplanationPage && 
          <Description mode={'get-inspired'} />
        }

        {((!isExplanationPage && carouselMode) || !carouselMode) && (
          <Message
            mode={'get-inspired'}
            type={'button'}
            messageStateChange={messageStateChange}  
          />
        )}
  
        {!isExplanationPage && (
          <>
            <div className='gi-text-container'>
              {resultsNumber !== -1 && (
                <div className="gi-card-container">
                  <button
                    onClick={toggleBookmark}
                    className={`gi-bookmark-button ${currentCaseStudy.bookmark ? 'active' : ''}`}
                  >   
                    <BookmarkIcon className="gi-bookmark-icon" />
                  </button>
    
                  <h1 className="gi-title">{currentCaseStudy.title}</h1>
                  <p className="gi-description">{currentCaseStudy.description}</p>
                  {/* <p>{height}</p> */}
                  <p className="gi-credits">Credits: {currentCaseStudy.credits}</p>
    
                  <div className='gi-boxes-container'>
                  <div className='gi-box-row'>
                    <p className='gi-text-box type'>{currentCaseStudy.type}</p>
                    <p className='gi-text-box age'>{currentCaseStudy.age}</p>
                    <p className='gi-text-box time'>{currentCaseStudy.time}</p>
                  </div>
                  <div className='gi-box-row'>
                    <p className='gi-text-box languages'>{currentCaseStudy.languages}</p>
                    <p className='gi-text-box mainTarget'>{currentCaseStudy.mainTarget}</p>
                    <p className='gi-text-box year'>{currentCaseStudy.year}</p>
                  </div>
                  <div className='gi-box-row'>
                    <p className='gi-text-box collection'>{currentCaseStudy.collection}</p>
                  </div>
                </div>
              </div>
              )}
              {resultsNumber === -1 && (
                <div className="gi-card-container empty"></div>
              )}
    
              {/* Navigation Arrows */}
              {(currentIndex > 0 || resultsNumber === -1) && (
                <button
                  className={`gi-arrow-button left ${resultsNumber === 0 ? "disabled" : ""}`}
                  onClick={handlePrev}
                >
                  <ArrowIcon className='gi-arrow-icon' />
                </button>
              )}
    
              {(currentIndex < caseStudies.length - 1 || resultsNumber === -1) && (
                <button
                  className={`gi-arrow-button right ${resultsNumber === 0 ? "disabled" : ""}`}
                  onClick={handleNext}
                >
                  <ArrowIcon className='gi-arrow-icon' />
                </button>
              )}
              </div>
    
              <div className='gi-results-container'>
                {resultsNumber !== -1 && (
                  <p className={`gi-results ${searchLogic === 'SAVED' ? 'bookmarked' : ''}`}>
                    <span className='gi-bold-text'>{resultsNumber}</span>&nbsp;results
                  </p>
                )}
              </div>
              <div className='gi-search-container'>
                <div className="gi-search-logic-menu">
                  <div className="gi-logic-button-background">
                    <div className="gi-logic-buttons">
                      <button
                        className={`gi-logic-button ${searchLogic === 'OR' ? 'active' : ''}`}
                        onClick={() => handleSearchLogicChange("OR")}
                      >
                        AT LEAST ONE
                      </button>
                      <button
                        className={`gi-logic-button ${searchLogic === 'AND' ? 'active' : ''}`}
                        onClick={() => handleSearchLogicChange("AND")}
                      >
                        ALL
                      </button>
                    </div>
                  </div>
                  <button 
                    className="gi-search-button" 
                    onClick={handleDefaultSearch}
                  >
                    SEARCH
                  </button>
                </div>
              </div>
              <button
                onClick={handleSavedCaseStudiesSearch}
                className={`gi-show-bookmarks-container ${searchLogic === 'SAVED' ? 'active' : ''}`}
              >   
                <p className='gi-bookmark-saved'>SAVED</p>
                <BookmarkIcon className="gi-bookmark-icon show" />
              </button>
          </>
        )}
        <Menu isExplanationPage={isExplanationPage} />
      </div>
  
      {((!isExplanationPage && carouselMode) || !carouselMode) && (
        <Message
          mode={'get-inspired'}
          type={'message'}
          showMessage={showMessage} // Pass whether to show the message
          messageStateChange={messageStateChange}
        />
      )}
    </>
  );
} 

export default GetInspiredPage;
