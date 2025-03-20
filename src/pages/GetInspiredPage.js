import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass.js';
import Menu from '../components/Menu';
import Description from '../components/Description';
import { getGetInspiredData, getLabelsTexts, getModeTexts } from '../utils/DataExtraction.js'; 
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import { replaceHighlightsPlaceholders} from '../utils/TextFormatting.js';
import '../styles/pages/GetInspiredPage.css';

const GetInspiredPage = () => {
  const {
    language,
    showExplanation,
    savedCaseStudies,
    setSavedCaseStudies,
    newCaseStudies,
    setFirstUse,
    showInstruction,
    setShowInstruction,
    currentCaseStudy,
    setCurrentCaseStudy,
    caseStudies,
    setCaseStudies,
    currentIndex,
    setCurrentIndex,
    mode,
    setMode,
    resultsNumber,
    setResultsNumber,
    searchLogic,
    setSearchLogic,
    giComponents,
    setGIComponents,
    currentGIComponents,
    setCurrentGIComponents,
    iconsMap
  } = useContext(StateContext);

  const navigate = useNavigate(); // Initialize the navigate function

  const labelsTexts = getLabelsTexts(language, "get-inspired");
  const instruction = getModeTexts("get-inspired", language).Instruction;
  const modeRef = useRef(mode);
  const searchLogicRef = useRef(searchLogic);
  const componentsRef = useRef(giComponents);
  const savedCaseStudiesRef = useRef(savedCaseStudies);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    componentsRef.current = giComponents;
  }, [giComponents]);
  

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    savedCaseStudiesRef.current = savedCaseStudies;
  }, [savedCaseStudies]);

  useEffect(() => {
    searchLogicRef.current = searchLogic;
  }, [searchLogic]);

  useEffect(() => {
    if(giComponents.length === 0)
      setShowInstruction(true);
    else {
      setFirstUse(prevState => ({
        ...prevState, // Keep all existing attributes
        "get-inspired": false   // Update only 'home'
      }));
    }
  }, [giComponents, setShowInstruction]);

  
  document.documentElement.style.setProperty('--search-font-size', language === "pt" ? "1.15vh" : "1.5vh");
  document.documentElement.style.setProperty('--logic-font-size', language === "pt" ? "1.5vh" : "1.6vh");

  const resetState = useCallback(() => {
      navigate('/home');
  }, [navigate]);
  
  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((title) => {
    return savedCaseStudiesRef.current.length !== 0 && savedCaseStudiesRef.current.some(item => item.title === title);
  }, [savedCaseStudies]);

  const handleCompassClick = (code) => {
    // Reset components if on these modes 
    if(searchLogicRef.current === 'SAVED' || searchLogicRef.current === 'CAROUSEL') {
      setShowInstruction(true);
      setMode('get-inspired');
      modeRef.current = 'get-inspired';
      setSearchLogic('OR');
      searchLogicRef.current = 'OR';
      setResultsNumber(-1);
    } else {
      setMode('get-inspired');
      modeRef.current = 'get-inspired';
    }
    
    setGIComponents(prevComponents => {
      const newComponents = prevComponents.includes(code)
        ? prevComponents.filter(buttonId => buttonId !== code) // Remove ID if already clicked
        : [...prevComponents, code]; // Add ID if not already clicked
      componentsRef.current = newComponents;
      
      // Return the updated state
      return newComponents;
    });
  };

  const searchCaseStudies = useCallback((searchedComponents) => {
    let allCaseStudies;
    setShowInstruction(false);

    if(searchLogicRef.current === 'SAVED')
      allCaseStudies = savedCaseStudiesRef.current;
    else 
      // Concatenate the fetched case studies with newCaseStudies
      allCaseStudies = [...getGetInspiredData(language), ...newCaseStudies];

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
    setShowInstruction(false);

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
      setCurrentGIComponents(filteredCaseStudies[0].components)
    }

    if (filteredCaseStudies.length === 0)
      setCurrentGIComponents([]);
  }, [newCaseStudies, getBookmarkState, language, setCaseStudies, setCurrentCaseStudy, setCurrentGIComponents, setCurrentIndex, setResultsNumber, setShowInstruction]);

  const handleDefaultSearch = useCallback(() => {
    setMode('get-inspired-search');
    modeRef.current = 'get-inspired-search';
    searchCaseStudies(componentsRef.current);
  }, [searchCaseStudies, setMode]);

  const handleCarouselSearch = useCallback(() => {
    setDropdownOpen(false);
    if(searchLogicRef.current !== 'CAROUSEL') {
      setMode('get-inspired-carousel');
      modeRef.current = 'get-inspired-carousel';

      setSearchLogic('CAROUSEL');
      searchLogicRef.current = 'CAROUSEL';
      setShowInstruction(false);
      searchCaseStudies(null);
    }
  }, [searchCaseStudies, setShowInstruction, setMode, setSearchLogic]);
  
  const handleSavedCaseStudiesSearch = useCallback(() => {
    setDropdownOpen(false);
    if(searchLogicRef.current !== 'SAVED') {
      setMode('get-inspired-carousel');
      modeRef.current = 'get-inspired-carousel';
      setSearchLogic('SAVED');
      searchLogicRef.current = 'SAVED';  
      searchCaseStudies(null);
    }
  }, [searchCaseStudies, setMode, setSearchLogic]);

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
      setCurrentGIComponents(caseStudies[nextIndex].components)
    }
  }, [caseStudies, currentIndex, getBookmarkState, currentCaseStudy, setCurrentCaseStudy, setCurrentGIComponents, setCurrentIndex]);

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
      setCurrentGIComponents(caseStudies[prevIndex].components)

    }
  }, [caseStudies, currentIndex, getBookmarkState, currentCaseStudy, setCurrentCaseStudy, setCurrentGIComponents, setCurrentIndex]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if(e.key === 'Enter' && modeRef.current !== 'get-inspired-carousel') 
      handleDefaultSearch();
    if (e.key === 'ArrowLeft') 
      handlePrev();
    else if (e.key === 'ArrowRight') 
      handleNext();
  }, [handlePrev, handleNext, handleDefaultSearch]);

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
        savedCaseStudiesRef.current = prevSavedCaseStudies.filter(item => item.title !== currentCaseStudy.title);
        return prevSavedCaseStudies.filter(item => item.title !== currentCaseStudy.title);
      }
  
      // Otherwise, add the entire case study object
      savedCaseStudiesRef.current = [...prevSavedCaseStudies, currentCaseStudy];
      return [...prevSavedCaseStudies, currentCaseStudy];
    });
  
    setCurrentCaseStudy({
      ...currentCaseStudy,
      bookmark: !currentCaseStudy.bookmark,
    });

    if(searchLogicRef.current === 'SAVED') 
      searchCaseStudies(null);
  };  

  const handleSearchLogicChange = useCallback((mode) => {
    if(mode === "AND") {
      setSearchLogic('AND');
      searchLogicRef.current = 'AND';
    } else if(mode === "OR") {
      setSearchLogic('OR');
      searchLogicRef.current = 'OR';
    }
  }, [setSearchLogic]);

  const handleBackFiltering = () => {
    setShowInstruction(true);
    setMode('get-inspired');
    modeRef.current = 'get-inspired';
    setSearchLogic('OR');
    searchLogicRef.current = 'OR';
    setResultsNumber(-1);
  };

  return (
    <>
      <Compass
        mode={mode}
        position="fixed"
        resetState={resetState} // Passing resetState to OLCompass
        onButtonClick={handleCompassClick}
        currentComponent={currentGIComponents}
        stateSaved={giComponents}
      />
      {showExplanation && 
        <Description mode={'get-inspired'} />
      }

      {!showExplanation && showInstruction && 
        <div className='instruction-container'>
          {replaceHighlightsPlaceholders(instruction, 'instruction', 'instruction highlightP', 'instruction highlightPe', 'instruction highlightD', iconsMap)}
        </div>
      }

      {!showExplanation && giComponents.length > 0 && (
        <>
          <div className='gi-text-container'>
            {resultsNumber > 0 && (
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
                <p className="gi-credits">{labelsTexts["credits"]}: {currentCaseStudy.credits}</p>
  
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

            {!showInstruction && resultsNumber === 0 && (
              <div className="instruction-container">
                <div className='instruction'>
                  {searchLogic === 'SAVED' 
                  ? labelsTexts["no-saved-cs"]
                  : labelsTexts["no-filters-cs"]}
                </div>
              </div>
            )}
  
            {/* Navigation Arrows */}
            {(currentIndex > 0 && resultsNumber > 0) && (
              <button
                className={`gi-arrow-button left ${resultsNumber === 0 ? "disabled" : ""}`}
                onClick={handlePrev}
              >
                <Arrow2Icon className='gi-arrow-icon' />
              </button>
            )}
  
            {(currentIndex < caseStudies.length - 1 && resultsNumber > 0) && (
              <button
                className={`gi-arrow-button right ${resultsNumber === 0 ? "disabled" : ""}`}
                onClick={handleNext}
              >
                <Arrow2Icon className='gi-arrow-icon' />
              </button>
            )}
            </div>
  
            <div className='gi-results-container'>
              {resultsNumber !== -1 && (
                <p className={`gi-results`}>
                  <span className='gi-bold-text'>{resultsNumber}</span>&nbsp;{labelsTexts["results"]}
                </p>
              )}
            </div>

            <div className={`gi-search-container`}>
              <div className="gi-search-logic-menu">
                <div className="gi-logic-button-background">
                  {(searchLogic === 'OR' || searchLogic === 'AND') &&
                    <div className="gi-logic-buttons">
                      <button
                        className={`gi-logic-button ${searchLogic === 'OR' ? 'active' : ''}`}
                        onClick={() => handleSearchLogicChange("OR")}
                      >
                        {labelsTexts["at-least-one"]}
                      </button>
                      <button
                        className={`gi-logic-button ${searchLogic === 'AND' ? 'active' : ''}`}
                        onClick={() => handleSearchLogicChange("AND")}
                      >
                        {labelsTexts["all"]}
                      </button>
                    </div>
                  }
                  {(searchLogic === 'SAVED' || searchLogic === 'CAROUSEL') &&
                    <button 
                      className="gi-back-to-filters-button" 
                      onClick={handleBackFiltering}
                    >
                      {labelsTexts["back-to-filters"]}
                    </button>
                  }
                </div>
                {(searchLogic === 'OR' || searchLogic === 'AND') &&
                  <button 
                    className="gi-search-button" 
                    onClick={handleDefaultSearch}
                  >
                    {labelsTexts["search"]}
                  </button>
                } 
              </div>
              
            </div>

            <div className={`gi-dropdown-container ${showInstruction ? 'disabled' : ''}`}>
              <>
              <div className={`gi-dropdown-button`}>
                {searchLogic !== "CAROUSEL" &&
                  <button
                    onClick={handleSavedCaseStudiesSearch}
                    className={`gi-show-bookmarks-container ${searchLogic === 'SAVED' ? 'active' : ''}`}
                  >   
                    <BookmarkIcon className="gi-bookmark-icon show" />
                    <p className='gi-show-bookmark-button'>
                      {labelsTexts["show-saved"]}
                    </p>
                  </button>
                }
                {searchLogic === "CAROUSEL" &&
                  <button
                    onClick={handleCarouselSearch}
                    className={`gi-show-carousel-container ${searchLogic === 'CAROUSEL' ? 'active' : ''} ${showInstruction ? 'disabled' : ''}`}
                  >   
                    <p className='gi-show-carousel-button'>
                      {labelsTexts["show-all"]}
                    </p>
                  </button>
                }
                
                <button 
                  className='gi-dropdown-arrow'
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <ArrowIcon className="gi-dropdown-arrow-icon" />
                </button>
                </div>
                {dropdownOpen && 
                  <div className="gi-dropdown-content">
                  {searchLogic !== "CAROUSEL" &&
                    <button
                      onClick={handleCarouselSearch}
                      className={`gi-show-carousel-container ${searchLogic === 'CAROUSEL' ? 'active' : ''} ${showInstruction ? 'disabled' : ''}`}
                    >   
                      <p className='gi-show-carousel-button'>
                        {labelsTexts["show-all"]}
                      </p>
                    </button>
                  }
                  {searchLogic === "CAROUSEL" &&
                    <button
                      onClick={handleSavedCaseStudiesSearch}
                      className={`gi-show-bookmarks-container ${searchLogic === 'SAVED' ? 'active' : ''}`}
                    >   
                      <p className='gi-show-bookmark-button'>
                        {labelsTexts["show-saved"]}
                      </p>
                    </button>
                  }
                  </div>
                }
              </>
            </div>
        </>
      )}
      <Menu />
    </>
  );
} 

export default GetInspiredPage;
