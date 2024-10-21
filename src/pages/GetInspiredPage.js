import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import '../styles/GetInspiredPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import { getCaseStudies } from '../utils/Data.js'; 
import { ReactComponent as WaveIcon } from '../assets/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as QuestionIcon } from '../assets/question-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/bookmark-icon.svg'; // Adjust the path as necessary


const GetInspiredPage = ({ colors, savedCaseStudies, setSavedCaseStudies, newCaseStudies, firstMessage, setFirstMessage }) => {
  const initialState = useMemo(() => ({
    title: '', 
    mainTarget: '',
    age: '',
    time: '',
    languages: '',
    year: '',
    description: '',
    credits: '',
    components: '',
    initialState: true,
    firstClick: true,
    showMessage: false,
    olPosition: "center"
  }), []);

  const [state, setState] = useState(initialState);
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselMode, setCarouselMode] = useState(true);
  const [action, setAction] = useState('get-inspired');
  const [resultsNumber, setResultsNumber] = useState(0);
  const carouselModeRef = useRef(carouselMode);
  const actionRef = useRef(action);

  useEffect(() => {
    carouselModeRef.current = carouselMode;
  }, [carouselMode]);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const resetState = useCallback(() => {
    setState(initialState);
    setCarouselMode(true);
    carouselModeRef.current = true;

    setAction('get-inspired');
    actionRef.current = 'get-inspired';

  }, [initialState]);

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

    setState((prevState) => ({
      ...prevState,
      olPosition: "left"
    }));

    setCarouselMode(false);
    carouselModeRef.current = false;

    setAction('get-inspired');
    actionRef.current = 'get-inspired';
  };

  const searchCaseStudies = useCallback((components) => {
    const fetchedCaseStudies = getCaseStudies(components);
    // Concatenate the fetched case studies with newCaseStudies
    const allCaseStudies = [...fetchedCaseStudies, ...newCaseStudies];
    setCaseStudies(allCaseStudies);
    setResultsNumber(allCaseStudies.length);

    if (allCaseStudies.length > 0) {
      setState((prevState) => ({
        ...prevState,
        title: allCaseStudies[0].Title,
        mainTarget: allCaseStudies[0].MainTarget,
        age: allCaseStudies[0].Age,
        time: allCaseStudies[0].Time,
        languages: allCaseStudies[0].Languages,
        year: allCaseStudies[0].Year,
        description: allCaseStudies[0].Description,
        credits: allCaseStudies[0].Credits,
        components: allCaseStudies[0].Components,
        bookmark: getBookmarkState(allCaseStudies[0].Title),
        initialState: false,
      }));
      setCurrentIndex(0); // Reset to first case study
    }

    if (allCaseStudies.length === 0) {
      setState((prevState) => ({
        ...prevState,
        title: "No cases found with those filters",
        mainTarget: '',
        age: '',
        time: '',
        languages: '',
        year: '',
        description: '',
        credits: '',
        initialState: false,
      }));
    }
  }, [newCaseStudies, getBookmarkState]);

  const carouselHandleEnterClick = () => {
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

    if (!state.initialState) return;

    setState((prevState) => ({
      ...prevState,
      olPosition: "left"
    }));

    searchCaseStudies(null);

    setAction('get-inspired-carousel');
    actionRef.current = 'get-inspired-carousel';

  };

  const handleNext = () => {
    if (currentIndex < caseStudies.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      setState({
        ...state,
        title: caseStudies[nextIndex].Title,
        mainTarget: caseStudies[nextIndex].MainTarget,
        age: caseStudies[nextIndex].Age,
        time: caseStudies[nextIndex].Time,
        languages: caseStudies[nextIndex].Languages,
        year: caseStudies[nextIndex].Year,
        description: caseStudies[nextIndex].Description,
        credits: caseStudies[nextIndex].Credits,
        components: caseStudies[nextIndex].Components,
        bookmark: getBookmarkState(caseStudies[nextIndex].Title),
        initialState: false,
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      setState({
        ...state,
        title: caseStudies[prevIndex].Title,
        mainTarget: caseStudies[prevIndex].MainTarget,
        age: caseStudies[prevIndex].Age,
        time: caseStudies[prevIndex].Time,
        languages: caseStudies[prevIndex].Languages,
        year: caseStudies[prevIndex].Year,
        description: caseStudies[prevIndex].Description,
        credits: caseStudies[prevIndex].Credits,
        components: caseStudies[prevIndex].Components,
        bookmark: getBookmarkState(caseStudies[prevIndex].Title),
        initialState: false,
      });
    }
  };

  // Keyboard event handler
  const handleKeyPress = useCallback((e) => {
    if(e.key === 'Enter') 
      carouselHandleEnterClick();
    else if (e.key === 'ArrowUp') 
      handlePrev();
    else if (e.key === 'ArrowDown') 
      handleNext();
  }, [handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
  }, [carouselHandleEnterClick]); // Dependency array includes carouselHandleEnterClick

  const defaultHandleEnterClick = (components) => {
    if(carouselModeRef.current) return;

    setAction('get-inspired-search');
    actionRef.current = 'get-inspired-seatch';
    searchCaseStudies(components);
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

  return (
    <div>
    <div className={`${state.showMessage ? "blur-background" : ""}`}>
      <OLCompass 
        colors={colors} 
        action={action}
        position={state.olPosition} 
        resetState={resetState} // Passing resetState to OLCompass
        onEnterClick={defaultHandleEnterClick} 
        onButtonClick={handleCompassClick}
        selectedComponents={state.components}
      />
      {state.initialState && (
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
      {((!state.initialState && carouselMode) || !carouselMode) && (
        <>
        <button onClick={showMessage} className="question-button">
          <QuestionIcon 
            className="question-icon" 
          />
        </button>
        </>
      )}

      {!state.initialState && (
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
                  <p className='gi-text-box type'>/type/</p>
                  <p className='gi-text-box age'>{state.age}</p>
                  <p className='gi-text-box time'>{state.time}</p>
                </div>
                <div className='gi-box-row'>
                  <p className='gi-text-box languages'>{state.languages}</p>
                  <p className='gi-text-box mainTarget'>{state.mainTarget}</p>
                  <p className='gi-text-box year'>{state.year}</p>
                </div>
                <div className='gi-box-row'>
                  <p className='gi-text-box collection'>/Collection Title + Collection Author/</p>
                </div>
              </div>
            </div> 
          </div>
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button className="gi-arrow-button up" onClick={handlePrev}>
              <ArrowIcon 
                className='gi-arrow-icon'
              />

            </button>
          )}

          {currentIndex < caseStudies.length - 1 && (
            <button className="gi-arrow-button down" onClick={handleNext}>
              <ArrowIcon 
                className='gi-arrow-icon'
            />
            </button>
          )}
          <p className='gi-results'>
            <span className='bold-text'>{resultsNumber}</span> results 
          </p> 
        </>
      )}    
      <Menu />
    </div>
    {((!state.initialState && carouselMode) || !carouselMode) && state.showMessage && (
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
