import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import '../styles/GetInspiredPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import { getCaseStudies } from '../utils/Data.js'; 
import { ReactComponent as WaveIcon } from '../assets/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as QuestionIcon } from '../assets/question-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/bookmark-icon.svg'; // Adjust the path as necessary


const GetInspiredPage = ({ savedCaseStudies, setSavedCaseStudies, newCaseStudies, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
  const initialState = useMemo(() => ({
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
    components: '',
    firstClick: true,
    showMessage: false,
  }), []);

  const [state, setState] = useState(initialState);
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselMode, setCarouselMode] = useState(true);
  const [action, setAction] = useState('get-inspired');
  const [resultsNumber, setResultsNumber] = useState(0);
  const [searchMode, setSearchMode] = useState('AND');
  const [fetchData, setFetchData] = useState(false); // State to trigger data fetching
  
  const carouselModeRef = useRef(carouselMode);
  const actionRef = useRef(action);
  const searchModeRef = useRef(searchMode);

  useEffect(() => {
    carouselModeRef.current = carouselMode;
  }, [carouselMode]);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    searchModeRef.current = searchMode;
  }, [searchMode]);

  const resetState = useCallback(() => {
    setState(initialState);
    setCarouselMode(true);
    carouselModeRef.current = true;
    setResultsNumber(0);
    setAction('get-inspired');
    actionRef.current = 'get-inspired';
    setIsExplanationPage(true);

  }, [initialState, setIsExplanationPage]);

  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((title) => {
    return savedCaseStudies.length !== 0 && savedCaseStudies.includes(title);
  }, [savedCaseStudies]);

  const handleCompassClick = () => {
    if(state.firstClick && firstMessage) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true
      }));
    }
    setIsExplanationPage(false);

    setCarouselMode(false);
    carouselModeRef.current = false;

    setAction('get-inspired');
    actionRef.current = 'get-inspired';
  };

  const searchCaseStudies = useCallback((components) => {
    const fetchedCaseStudies = getCaseStudies();
    // Concatenate the fetched case studies with newCaseStudies

    const allCaseStudies = [...fetchedCaseStudies, ...newCaseStudies];

    // Process the JSON data
    let filteredCaseStudies = allCaseStudies;
    // If labels are provided, filter the case studies
    if (components !== null) {
      filteredCaseStudies = allCaseStudies.filter(item => {
        if (searchModeRef.current === 'AND') {
          // AND mode: all components must be present in the item's Components array
          return components.every(component => item.Components.includes(component));
        } else if (searchModeRef.current === 'OR') {
          // OR mode: at least one component must be present in the item's Components array
          return components.some(component => item.Components.includes(component));
        } else {
          return components;
        }
      });
    }

    setCaseStudies(filteredCaseStudies);
    setResultsNumber(filteredCaseStudies.length);

    if (filteredCaseStudies.length > 0) {
      setState((prevState) => ({
        ...prevState,
        title: filteredCaseStudies[0].Title,
        collection: filteredCaseStudies[0].Collection,
        mainTarget: filteredCaseStudies[0].MainTarget,
        age: filteredCaseStudies[0].Age,
        time: filteredCaseStudies[0].Time,
        type: filteredCaseStudies[0].Type,
        languages: filteredCaseStudies[0].Languages,
        year: filteredCaseStudies[0].Year,
        description: filteredCaseStudies[0].Description,
        credits: filteredCaseStudies[0].Credits,
        components: filteredCaseStudies[0].Components,
        bookmark: getBookmarkState(filteredCaseStudies[0].Title),
      }));
      setCurrentIndex(0); // Reset to first case study
    }

    if (filteredCaseStudies.length === 0) {
      setState((prevState) => ({
        ...prevState,
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
      }));
    }
  }, [newCaseStudies, getBookmarkState]);

  const handleCarouselSearch = useCallback(() => {
    if(!carouselModeRef.current) return;

    setCarouselMode(true);
    carouselModeRef.current = true;

    if(state.firstClick && firstMessage) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
      }));
    }

    if (!isExplanationPage) return;
    setIsExplanationPage(false);

    searchCaseStudies(null);

    setAction('get-inspired-carousel');
    actionRef.current = 'get-inspired-carousel';

  }, [firstMessage, isExplanationPage, searchCaseStudies, state.firstClick, setIsExplanationPage]);

  const handleNext = useCallback(() => {
    if (currentIndex < caseStudies.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      setState({
        ...state,
        title: caseStudies[nextIndex].Title,
        collection: caseStudies[nextIndex].Collection,
        mainTarget: caseStudies[nextIndex].MainTarget,
        age: caseStudies[nextIndex].Age,
        time: caseStudies[nextIndex].Time,
        type: caseStudies[nextIndex].Type,
        languages: caseStudies[nextIndex].Languages,
        year: caseStudies[nextIndex].Year,
        description: caseStudies[nextIndex].Description,
        credits: caseStudies[nextIndex].Credits,
        components: caseStudies[nextIndex].Components,
        bookmark: getBookmarkState(caseStudies[nextIndex].Title),
      });
    }
  }, [caseStudies, currentIndex, getBookmarkState, state]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      setState({
        ...state,
        title: caseStudies[prevIndex].Title,
        collection: caseStudies[prevIndex].Collection,
        mainTarget: caseStudies[prevIndex].MainTarget,
        age: caseStudies[prevIndex].Age,
        time: caseStudies[prevIndex].Time,
        type: caseStudies[prevIndex].Type,
        languages: caseStudies[prevIndex].Languages,
        year: caseStudies[prevIndex].Year,
        description: caseStudies[prevIndex].Description,
        credits: caseStudies[prevIndex].Credits,
        components: caseStudies[prevIndex].Components,
        bookmark: getBookmarkState(caseStudies[prevIndex].Title),
      });
    }
  }, [caseStudies, currentIndex, getBookmarkState, state]);

  // Keyboard event handler
  const handleKeyPress = useCallback((e) => {
    if(e.key === 'Enter' && carouselModeRef.current) 
      handleCarouselSearch();
    else if(e.key === 'Enter' && !carouselModeRef.current) 
      handleSearchClick();
    else if (e.key === 'ArrowUp') 
      handlePrev();
    else if (e.key === 'ArrowDown') 
      handleNext();
  }, [handlePrev, handleNext, handleCarouselSearch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleCarouselSearch, handleKeyPress]); // Dependency array includes carouselHandleEnterClick

  const handleDefaultSearch = (components) => {
    if(carouselModeRef.current) return;

    setAction('get-inspired-search');
    actionRef.current = 'get-inspired-search';
    searchCaseStudies(components);
  };

   // Callback function to receive data from OLCompass
   const handleDataFromOLCompass = useCallback((data) => {
    if(carouselModeRef.current) return;

    setAction('get-inspired-search');
    actionRef.current = 'get-inspired-search';
    searchCaseStudies(data);
  }, [searchCaseStudies]); // Empty dependency array to ensure it doesn't change


  const handleSearchClick = () => {
    // You can now use compassData or perform any action with it
    setFetchData(true);

    // Set it back to false after the reset
    setTimeout(() => {
      setFetchData(false);
    }, 0);
  };

  const toggleBookmark = () => {
    setSavedCaseStudies((prevSavedComponents) => {
      // If the current title is already in the array, remove it
      if (prevSavedComponents.includes(state.title)) {
        return prevSavedComponents.filter(item => item !== state.title);
      }
      // Otherwise, add it to the array
      return [...prevSavedComponents, state.title];
    });

    setState({
      ...state,
      bookmark: !state.bookmark,
    });
  };

  const showMessage = () => {
    setState((prevState) => ({
      ...prevState,
      showMessage: true,
    }));
  };

  const removeMessage = () => {
    setState((prevState) => ({
      ...prevState,
      showMessage: false,
    }));

    if(firstMessage) {
      setFirstMessage((prevState) => ({
        ...prevState,
        getInspired: false,
      }));
    }
  };

  const handleSearchModeChange = useCallback((mode) => {
    if(mode === "AND") {
      setSearchMode('AND');
      searchModeRef.current = 'AND';
    } else if(mode === "OR") {
      setSearchMode('OR');
      searchModeRef.current = 'OR';
    }
  }, []);

  return (
    <div>
    <div className={`${state.showMessage ? "blur-background" : ""}`}>
      <OLCompass 
        action={action}
        position={isExplanationPage ? "center" : "left"} 
        resetState={resetState} // Passing resetState to OLCompass
        onEnterClick={handleDefaultSearch} 
        onButtonClick={handleCompassClick}
        selectedComponents={state.components}
        onSearchClick={handleDataFromOLCompass}
        fetchData={fetchData} 
      />
      {isExplanationPage && (
        <>
          <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Browse inspiring application cases
            </p>
            <div className='text'>
              You get OL theory, yet wonder how it works in practice?
              <br></br>
              In the GET INSPIRED mode the Compass gives you access to a variety of OL resources and initiatives, explained in terms of Principles, Perspectives and Dimensions addressed.
              <p className='instruction'>
              Select as many waves (
                <WaveIcon 
                  className='text-icon'
                />
              ) as you like and press 'Enter' to filter examples.
              To see a carousel of popular OL examples just press 'Enter'.       
              </p>
            </div>

          </div>
        </>
      )} 
      {((!isExplanationPage && carouselMode) || !carouselMode) && (
        <>
        <button onClick={showMessage} className="question-button">
          <QuestionIcon 
            className="question-icon" 
          />
        </button>
        </>
      )}

      {!isExplanationPage && (
        <>
          {resultsNumber !== 0 && (
            <>
            <div className='gi-text-container'>
              <div className="gi-card-container">
                <button onClick={toggleBookmark} className={`gi-bookmark-button ${state.bookmark ? 'active' : ''}`}>
                  <BookmarkIcon 
                    className="gi-bookmark-icon" 
                  />
                </button>   

                <h1 className="gi-title">{state.title}</h1>
                <p className="gi-description">{state.description}</p>
                <p className="gi-credits">Credits: {state.credits}</p>
                
                <div className='gi-boxes-container'>
                  <div className='gi-box-row'>
                    <p className='gi-text-box type'>{state.type}</p>
                    <p className='gi-text-box age'>{state.age}</p>
                    <p className='gi-text-box time'>{state.time}</p>
                  </div>
                  <div className='gi-box-row'>
                    <p className='gi-text-box languages'>{state.languages}</p>
                    <p className='gi-text-box mainTarget'>{state.mainTarget}</p>
                    <p className='gi-text-box year'>{state.year}</p>
                  </div>
                  <div className='gi-box-row'>
                    <p className='gi-text-box collection'>{state.collection}</p>
                  </div>
                </div>
              </div> 
            </div>
            </>
          )}

          {resultsNumber === 0 && (
            <>
            <div className='gi-text-container'>
              <div className="gi-card-container empty"></div> 
            </div>
            </>
          )}
          
          {/* Navigation Arrows */}
          {(currentIndex > 0 || resultsNumber === 0) && (
            <button className={`gi-arrow-button up ${resultsNumber === 0 ? "disabled" : ""}`} onClick={handlePrev}>
              <ArrowIcon 
                className='gi-arrow-icon'
              />

            </button>
          )}

          {(currentIndex < caseStudies.length - 1 || resultsNumber === 0) && (
            <button className={`gi-arrow-button down ${resultsNumber === 0 ? "disabled" : ""}`} onClick={handleNext}>
              <ArrowIcon 
                className='gi-arrow-icon'
            />
            </button>
          )}

          {resultsNumber !== 0 && (
            <>
            <p className='gi-results'>
              <span className='bold-text'>{resultsNumber}</span> results 
            </p>
            </>
          )}
           

          <div className="search-mode-menu">
            <div className="mode-button-background">
                <div className="mode-buttons">
                    <button
                        className={`mode-button ${searchMode === 'AND' ? 'active' : ''}`}
                        onClick={() => handleSearchModeChange("AND")}
                    >
                        AND
                    </button>
                    <button
                        className={`mode-button ${searchMode === 'OR' ? 'active' : ''}`}
                        onClick={() => handleSearchModeChange("OR")}
                    >
                        OR
                    </button>
                </div>
            </div>
            <button 
              className="search-button"
              onClick={handleSearchClick}
            >
              SEARCH
            </button>
          </div>
        </>
      )}    
      <Menu isExplanationPage={isExplanationPage}/>
    </div>
    {((!isExplanationPage && carouselMode) || !carouselMode) && state.showMessage && (
      <>
      <div className="message-box" style={{ width: 290 }}>
        <div className="question-circle">
            <QuestionIcon 
              className="question-icon message" 
            />
          </div>
        <p className="message-text">
          By default, the search includes resultsNumber that contain either of the
          <WaveIcon 
            className='message-icon'
          /> 
          you selected. Thus, the more 
          <WaveIcon 
            className='message-icon'
          />
          you select, the more case-studies are shown.
          <br></br>
          Click on the 
          <ArrowIcon 
            className='message-icon smaller'
          /> 
          to browse case-studies. 
          You can order and further filter them from the two top-right drop-down menus. Click on 
          <BookmarkIcon
            className='message-icon smaller'
          /> 
          to mark relevant ones.
        </p>
        <button className="got-it-button" onClick={removeMessage}>
          Ok, got it!
        </button>
      </div>
      </>
    )}
    </div>
  );
};

export default GetInspiredPage;
