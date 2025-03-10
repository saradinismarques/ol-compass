import React, { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Compass from '../components/Compass.js';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import '../styles/pages/GetInspiredPage.css';

const GetInspiredPage = () => {
  const {
    colors,
    language,
    firstMessage,
    isExplanationPage,
    setIsExplanationPage,
    savedCaseStudies,
    setSavedCaseStudies,
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
  const [resetCompass, setResetCompass] = useState(false);
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('get-inspired-carousel');
  const [resultsNumber, setResultsNumber] = useState(-1);
  const [searchLogic, setSearchLogic] = useState('OR');
  const [components, setComponents] = useState([]);
  const [clickedComponent, setClickedComponent] = useState([]);
  const [currentComponents, setCurrentComponents] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const modeRef = useRef(mode);
  const searchLogicRef = useRef(searchLogic);
  const componentsRef = useRef(components);
  const showMessageRef = useRef(showMessage);
  const savedCaseStudiesRef = useRef(savedCaseStudies);

  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

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
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--selection-hover-color', colors['Selection Hover']);
  document.documentElement.style.setProperty('--bookmark-cs-color', colors['CSBookmark']);
  document.documentElement.style.setProperty('--bookmark-cs-hover-color', colors['CSBookmark Hover']);
  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);
  document.documentElement.style.setProperty('--search-menu-width', language === "pt" ? "38vh" : "35vh");
  document.documentElement.style.setProperty('--logic-buttons-width', language === "pt" ? "24.5vh" : "22.3vh");
  document.documentElement.style.setProperty('--search-button-left', language === "pt" ? "-6.7%" : "-6%");

  const resetState = useCallback(() => {
      navigate('/home');
  }, [navigate]);
  
  const resetStateAndCompass = (code) => {
    setMode('get-inspired');
    modeRef.current = 'get-inspired';
    setSearchLogic('OR');
    searchLogicRef.current = 'OR';
    setResultsNumber(-1);
    setClickedComponent(code);
    setResetCompass(true);
    //setTimeout(() => setResetCompass(false), 0); // Reset compass trigger
  }
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

    // Reset components if on these modes 
    if(searchLogicRef.current === 'SAVED' || searchLogicRef.current === 'CAROUSEL') 
      resetStateAndCompass(code)
    else {
      setMode('get-inspired');
      modeRef.current = 'get-inspired';
      setIsExplanationPage(false);
    }
    
    setComponents(prevComponents => {
      const newComponents = prevComponents.includes(code)
        ? prevComponents.filter(buttonId => buttonId !== code) // Remove ID if already clicked
        : [...prevComponents, code]; // Add ID if not already clicked
      componentsRef.current = newComponents;
      
      // Return the updated state
      return newComponents;
    });
  };

  const messageStateChange = (state) => {
    setShowMessage(state);
    showMessageRef.current = state;
  };

  const searchCaseStudies = useCallback(async (searchedComponents) => {
    let allCaseStudies;
  
    // Fetch case studies from the backend
    try {
      const response = await axios.get("http://localhost:5000/case-studies");
      allCaseStudies = response.data;
  
      console.log(allCaseStudies);
      if (searchLogicRef.current === 'SAVED') {
        allCaseStudies = savedCaseStudiesRef.current; // Saved case studies are still from the client
      } else {
        // Combine the new case studies with the fetched case studies from the database
        allCaseStudies = response.data;
      }
  
      // Process the data as before
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
        setCurrentComponents(filteredCaseStudies[0].components);
      }
  
      if (filteredCaseStudies.length === 0) {
        setCurrentComponents([]);
      }
    } catch (error) {
      console.error("Error fetching case studies:", error);
    }
  }, [getBookmarkState]);

  const handleDefaultSearch = useCallback(() => {
    setMode('get-inspired-search');
    modeRef.current = 'get-inspired-search';
    searchCaseStudies(componentsRef.current);
  }, [searchCaseStudies]);

  const handleCarouselSearch = useCallback(() => {
    if(searchLogicRef.current === 'CAROUSEL') {
      resetStateAndCompass()
    } else {
      setMode('get-inspired-carousel');
      modeRef.current = 'get-inspired-carousel';

      // if(firstClick && firstMessage["get-inspired"]) {
      //   setShowMessage(true);
      //   showMessageRef.current = true;
      //   setFirstClick(false);
      // }
      setSearchLogic('CAROUSEL');
      searchLogicRef.current = 'CAROUSEL';
      setIsExplanationPage(false);
      searchCaseStudies(null);
    }
  }, [firstMessage, isExplanationPage, searchCaseStudies, firstClick, setIsExplanationPage]);
  
  const handleSavedCaseStudiesSearch = useCallback(() => {
    if(searchLogicRef.current === 'SAVED') {
     resetStateAndCompass()
    } else {
      setMode('get-inspired-carousel');
      modeRef.current = 'get-inspired-carousel';
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
    if(e.key === 'Enter' && modeRef.current === 'get-inspired-carousel' && !showMessageRef.current)
      handleCarouselSearch();
    else if(e.key === 'Enter' && modeRef.current !== 'get-inspired-carousel' && !showMessageRef.current) 
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
          resetCompass={resetCompass}
          clickedComponent={clickedComponent}
        />
        {isExplanationPage && 
          <Description mode={'get-inspired'} />
        }

        {((!isExplanationPage && mode === 'get-inspired-carousel') || mode !== 'get-inspired-carousel') && (
          <Message
            mode={'get-inspired'}
            type={'button'}
            messageStateChange={messageStateChange}  
          />
        )}
  
        {!isExplanationPage && (
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
                  <p className="gi-credits">{language === "pt" ? "Créditos" : "Credits"}: {currentCaseStudy.credits}</p>
    
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
                <div className="gi-instruction">
                  {language === "pt" 
                  ? "Continua a clicar nas ondas que queres incluir. Quando acabares clica em 'Pesquisa' ou pressiona a tecla 'Enter'" 
                  : "Continue clicking on the waves you want to include. Once your done click on 'Search' or press 'Enter'"}
                </div>
              )}

              {resultsNumber === 0 && (
                <div className="gi-no-results">
                  {searchLogic === 'SAVED' 
                  ? (language === 'pt' 
                      ? "Nenhum caso de estudo salvo ainda. Clique no ícone de marcador para salvar um caso de estudo"
                      : "No case studies saved yet. Press the bookmark icon to save a case study")
                  : (language === 'pt' 
                      ? "Nenhum caso de estudo encontrado com esses filtros. Tente usar outros"
                      : "No case studies found with those filters. Try using others")}
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
                  <p className={`gi-results ${searchLogic === 'SAVED' ? 'bookmarked' : ''}`}>
                    <span className='gi-bold-text'>{resultsNumber}</span>&nbsp;{language === "pt" ? "resultados" : "results"}
                  </p>
                )}
              </div>
              <div className={`gi-search-container ${(searchLogic === 'SAVED' || searchLogic === 'CAROUSEL') ? "disabled" : ""}`}>
                <div className="gi-search-logic-menu">
                  <div className="gi-logic-button-background">
                    <div className="gi-logic-buttons">
                      <button
                        className={`gi-logic-button ${searchLogic === 'OR' ? 'active' : ''}`}
                        onClick={() => handleSearchLogicChange("OR")}
                      >
                        {language === "pt" ? "PELO MENOS UM" : "AT LEAST ONE"}
                      </button>
                      <button
                        className={`gi-logic-button ${searchLogic === 'AND' ? 'active' : ''}`}
                        onClick={() => handleSearchLogicChange("AND")}
                      >
                        {language === "pt" ? "TUDO" : "ALL"}
                      </button>
                    </div>
                  </div>
                  <button 
                    className="gi-search-button" 
                    onClick={handleDefaultSearch}
                  >
                    {language === "pt" ? "PESQUISA" : "SEARCH"}
                  </button>
                </div>
              </div>
              <button
                onClick={handleSavedCaseStudiesSearch}
                className={`gi-show-bookmarks-container ${searchLogic === 'SAVED' ? 'active' : ''}`}
              >   
                <p className='gi-show-bookmark-button'>
                  {language === "pt" ? "SALVOS" : "SAVED"}
                </p>
                <BookmarkIcon className="gi-bookmark-icon show" />
              </button>
              <button
                onClick={handleCarouselSearch}
                className={`gi-show-carousel-container ${searchLogic === 'CAROUSEL' ? 'active' : ''}`}
              >   
                <p className='gi-show-carousel-button'>
                  {language === "pt" ? "TODOS" : "SHOW ALL"}
                </p>
              </button>
          </>
        )}
        <Menu isExplanationPage={isExplanationPage} />
      </div>
  
      {((!isExplanationPage && mode === 'get-inspired-carousel') || mode !== 'get-inspired-carousel') && (
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
