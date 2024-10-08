import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import '../styles/GetInspiredPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import { getCaseStudies } from '../utils/Data.js'; 
import { ReactComponent as WaveIcon } from '../assets/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as QuestionIcon } from '../assets/question-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/bookmark-icon.svg'; // Adjust the path as necessary


const GetInspiredPage = ({ colors, savedCaseStudies, setSavedCaseStudies, newCaseStudies }) => {
  const initialState = useMemo(() => ({
    title: '', 
    shortDescription: '',
    credits: '',
    source: '',
    components: '',
    showMore: false,
    initialState: true,
    firstClick: true,
    showMessage: false,
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
    if(state.firstClick) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true
      }));
    }

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

    console.log(allCaseStudies[0].Components);
    if (allCaseStudies.length > 0) {
      setState((prevState) => ({
        ...prevState,
        title: allCaseStudies[0].Title,
        shortDescription: allCaseStudies[0].ShortDescription,
        credits: allCaseStudies[0].Credits,
        components: allCaseStudies[0].Components,
        showMore: false,
        bookmark: getBookmarkState(allCaseStudies[0].Title),
        initialState: false,
      }));
      setCurrentIndex(0); // Reset to first case study
    }

    if (allCaseStudies.length === 0) {
      setState((prevState) => ({
        ...prevState,
        title: "No cases found with those filters",
        shortDescription: '',
        credits: '',
        initialState: false,
      }));
    }
  }, [newCaseStudies, getBookmarkState]);

  const carouselHandleEnterClick = useCallback((e) => {
    if(e.key !== 'Enter') return;

    if(!carouselModeRef.current) return;

    setCarouselMode(true);
    carouselModeRef.current = true;

    if(state.firstClick) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
      }));
    }

    if (!state.initialState) return;

    searchCaseStudies(null);

    setAction('get-inspired-carousel');
    actionRef.current = 'get-inspired-carousel';

  }, [state.initialState, state.firstClick, searchCaseStudies ]);

  useEffect(() => {
    window.addEventListener('keydown', carouselHandleEnterClick);
    return () => {
        window.removeEventListener('keydown', carouselHandleEnterClick);
    };
}, [carouselHandleEnterClick]); // Dependency array includes carouselHandleEnterClick

const defaultHandleEnterClick = (components) => {
  if(carouselModeRef.current) return;

  setAction('get-inspired-search');
  actionRef.current = 'get-inspired-seatch';
  searchCaseStudies(components);
};

  const handleNext = () => {
    if (currentIndex < caseStudies.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      setState({
        ...state,
        title: caseStudies[nextIndex].Title,
        shortDescription: caseStudies[nextIndex].ShortDescription,
        credits: caseStudies[nextIndex].Credits,
        components: caseStudies[nextIndex].Components,
        showMore: false,
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
        shortDescription: caseStudies[prevIndex].ShortDescription,
        credits: caseStudies[prevIndex].Credits,
        components: caseStudies[prevIndex].Components,
        showMore: false,
        bookmark: getBookmarkState(caseStudies[prevIndex].Title),
        initialState: false,
      });
    }
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
  };

  return (
    <div>
    <div className={`${state.showMessage ? "blur-background" : ""}`}>
      <OLCompass 
        colors={colors} 
        action={action}
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
            <p className='gi-results'>
                <span className='bold-text'>{resultsNumber}</span> results 
            </p> 
            <div className="gi-card-container">
              <button onClick={toggleBookmark} className={`gi-bookmark-button ${state.bookmark ? 'active' : ''}`}>
                <BookmarkIcon 
                  className="gi-bookmark-icon" 
                />
              </button>   

              <h1 className="gi-title">{state.title}</h1>
              <p className="gi-description">{state.shortDescription}</p>
              <p className="gi-credits">{state.credits}</p>

              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <button className="gi-arrow-button left" onClick={handlePrev}>
                  <ArrowIcon 
                    className='gi-arrow-icon'
                  />

                </button>
              )}
            
              {currentIndex < caseStudies.length - 1 && (
                <button className="gi-arrow-button right" onClick={handleNext}>
                  <ArrowIcon 
                    className='gi-arrow-icon'
                  />
                </button>
              )}
            </div> 
          </div>
        </>
      )}    
      <Menu />
    </div>
    {((!state.initialState && carouselMode) || !carouselMode) && state.showMessage && (
      <>
      <div className="message-box" style={{ width: 290 }}>
        <div className="question-circle">
            <QuestionIcon 
              className="question-icon" 
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
