import React, { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import OLCompass from '../components/OLCompass.js';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { getGetInspiredData } from '../utils/Data.js'; 
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
  const [searchLogic, setSearchLogic] = useState('AND');
  const [components, setComponents] = useState([]);
  const [currentComponents, setCurrentComponents] = useState();
  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const carouselModeRef = useRef(carouselMode);
  const modeRef = useRef(mode);
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
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    searchLogicRef.current = searchLogic;
  }, [searchLogic]);

  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--selection-hover-color', colors['Selection Hover']);

  const resetState = useCallback(() => {
    setCurrentCaseStudy(initialCaseStudy);
    setCaseStudies([]);
    setCurrentIndex(0);
    setCarouselMode(true);
    carouselModeRef.current = true;
    setMode('get-inspired');
    modeRef.current = 'get-inspired';
    setResultsNumber(-1);
    setSearchLogic('AND');
    searchLogicRef.current = 'AND';
    setComponents([]);
    componentsRef.current = [];
    setCurrentComponents();
    setFirstClick(true);
    setShowMessage(false);
    showMessageRef.current = false;
    setIsExplanationPage(true);
  }, [initialCaseStudy, setIsExplanationPage]);

  // State to store window height
  //const [height, setHeight] = useState(window.innerHeight);

  // useEffect(() => {
  //   // Function to update height on window resize
  //   const handleResize = () => {
  //     setHeight(window.innerHeight);
  //   };

  //   // Add event listener for resize
  //   window.addEventListener('resize', handleResize);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //   window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((title) => {
    return savedCaseStudies.length !== 0 && savedCaseStudies.includes(title);
  }, [savedCaseStudies]);

  const handleCompassClick = (code) => {
    if(firstClick && firstMessage["get-inspired"]) {
      setFirstClick(false);
      setShowMessage(true);
      showMessageRef.current = true;
    }

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
    modeRef.current = 'get-inspired';
  };

  const messageStateChange = (state) => {
    setShowMessage(state);
    showMessageRef.current = state;
  };

  const searchCaseStudies = useCallback(() => {
    const fetchedCaseStudies = getGetInspiredData();
    // Concatenate the fetched case studies with newCaseStudies
    const allCaseStudies = [...fetchedCaseStudies, ...newCaseStudies];

    // Process the JSON data
    let filteredCaseStudies = allCaseStudies;
    
    if (componentsRef.current !== null) {
      filteredCaseStudies = allCaseStudies.filter(item => {
        if (searchLogicRef.current === 'AND') {
          // AND mode: all components must be present in the item's Components array
          return componentsRef.current.every(component => item.components.includes(component));
        } else if (searchLogicRef.current === 'OR') {
          // OR mode: at least one component must be present in the item's Components array
          return componentsRef.current.some(component => item.components.includes(component));
        } else {
          return componentsRef.current;
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
  }, [newCaseStudies, getBookmarkState]);

  const handleDefaultSearch = useCallback(() => {
    if(carouselModeRef.current) return;
    setMode('get-inspired-search');
    modeRef.current = 'get-inspired-search';
    searchCaseStudies();
  }, [searchCaseStudies]);

  const handleCarouselSearch = useCallback(() => {
    if(!carouselModeRef.current) return;

    setCarouselMode(true);
    carouselModeRef.current = true;

    if(firstClick && firstMessage["get-inspired"]) {
      setShowMessage(true);
      showMessageRef.current = true;
      setFirstClick(false);
    }

    if (!isExplanationPage) return;
    
    setIsExplanationPage(false);
    searchCaseStudies(null);
    setMode('get-inspired-carousel');
    modeRef.current = 'get-inspired-carousel';

  }, [firstMessage, isExplanationPage, searchCaseStudies, firstClick, setIsExplanationPage]);
  
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
  const handleKeyPress = useCallback((e) => {
    if(e.key === 'Enter' && carouselModeRef.current && !showMessageRef.current) 
      handleCarouselSearch();
    else if(e.key === 'Enter' && !carouselModeRef.current && !showMessageRef.current) 
      handleDefaultSearch();
    else if (e.key === 'ArrowUp') 
      handlePrev();
    else if (e.key === 'ArrowDown') 
      handleNext();
  }, [handlePrev, handleNext, handleDefaultSearch, handleCarouselSearch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleCarouselSearch, handleKeyPress]); // Dependency array includes carouselHandleEnterClick

  const toggleBookmark = () => {
    setSavedCaseStudies((prevSavedComponents) => {
      // If the current title is already in the array, remove it
      if (prevSavedComponents.includes(currentCaseStudy.title)) {
        return prevSavedComponents.filter(item => item !== currentCaseStudy.title);
      }
      // Otherwise, add it to the array
      return [...prevSavedComponents, currentCaseStudy.title];
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
      <div className={`${showMessageRef.current ? "blur-background" : ""}`}>
        <OLCompass
          mode={mode}
          position={isExplanationPage ? "center" : "left"}
          resetState={resetState} // Passing resetState to OLCompass
          onButtonClick={handleCompassClick}
          current={currentComponents}
        />
        {isExplanationPage && 
          <Description mode={'get-inspired'} 
        />}
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
                  className={`gi-arrow-button up ${resultsNumber === 0 ? "disabled" : ""}`}
                  onClick={handlePrev}
                >
                  <ArrowIcon className='gi-arrow-icon' />
                </button>
              )}
    
              {(currentIndex < caseStudies.length - 1 || resultsNumber === -1) && (
                <button
                  className={`gi-arrow-button down ${resultsNumber === 0 ? "disabled" : ""}`}
                  onClick={handleNext}
                >
                  <ArrowIcon className='gi-arrow-icon' />
                </button>
              )}
              </div>
    
              <div className='gi-search-results-container'>
              {resultsNumber !== -1 && (
                <p className='gi-results'>
                  <span className='gi-bold-text'>{resultsNumber}</span> results
                </p>
              )}
              <div className="gi-search-logic-menu">
                <div className="gi-logic-button-background">
                  <div className="gi-logic-buttons">
                    <button
                      className={`gi-logic-button ${searchLogic === 'AND' ? 'active' : ''}`}
                      onClick={() => handleSearchLogicChange("AND")}
                    >
                      AND
                    </button>
                    <button
                      className={`gi-logic-button ${searchLogic === 'OR' ? 'active' : ''}`}
                      onClick={() => handleSearchLogicChange("OR")}
                    >
                      OR
                    </button>
                  </div>
                </div>
                <button className="gi-search-button" onClick={handleDefaultSearch}>
                  SEARCH
                </button>
              </div>
            </div>
          </>
        )}
        <Menu isExplanationPage={isExplanationPage} />
      </div>
  
      {((!isExplanationPage && carouselMode) || !carouselMode) && (
        <Message
          mode={'get-inspired'}
          type={'message'}
          showMessage={showMessageRef.current} // Pass whether to show the message
          messageStateChange={messageStateChange}
        />
      )}
    </>
  );
} 

export default GetInspiredPage;
