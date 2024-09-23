import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import '../styles/GetInspiredPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import { getCaseStudies } from '../utils/Data.js'; 

const GetInspiredPage = ({ colors, savedCaseStudies, setSavedCaseStudies }) => {
  const initialState = useMemo(() => ({
    title: '', 
    shortDescription: '',
    credits: '',
    source: '',
    components: '',
    showMore: false,
    initialState: true,
  }), []);

  const [state, setState] = useState(initialState);
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reference for the specific container where clicks will be registered
  const clickableAreaRef = useRef(null);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((title) => {
    return savedCaseStudies.length !== 0 && savedCaseStudies.includes(title);
  }, [savedCaseStudies]);


  const handleClick = useCallback(() => {
    if (!state.initialState) return;

    const fetchedCaseStudies = getCaseStudies();
    setCaseStudies(fetchedCaseStudies);

    if (fetchedCaseStudies.length > 0) {
      setState({
        title: fetchedCaseStudies[0].Title,
        shortDescription: fetchedCaseStudies[0].ShortDescription,
        credits: fetchedCaseStudies[0].Credits,
        components: fetchedCaseStudies[0].Components,
        showMore: false,
        bookmark: getBookmarkState(fetchedCaseStudies[0].Title),
        initialState: false,
      });
      setCurrentIndex(0); // Reset to first case study
    }
  }, [state.initialState, getBookmarkState]);

  useEffect(() => {
    // Attach the click event listener to the specific area instead of the entire window
    const clickableArea = clickableAreaRef.current;
    if (clickableArea) {
      clickableArea.addEventListener('click', handleClick);
    }
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (clickableArea) {
        clickableArea.removeEventListener('click', handleClick);
      } 
    };
  }, [handleClick]);

  // const toggleShowMore = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     showMore: !prevState.showMore,
  //   }));
  // };

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

  return (
    <div ref={clickableAreaRef}>
      <OLCompass 
        colors={colors} 
        action="get-inspired" 
        resetState={resetState} // Passing resetState to OLCompass
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
            <p className='text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="instruction-container">
              <svg 
                className='arrow-icon two-lines'
                fill="currentcolor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
               <polygon points="3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9"/>
              </svg>
                    
              <p className="instruction">
                Click anywhere to start scrolling case studies
              </p>
            </div>
          </div>
        </>
      )} 

      {!state.initialState && (
        <>
          <div className='gi-text-container'>
            {/* <p className='gi-results'>
                <span className='bold-text'>16 </span>
                results | Relevance
            </p> */}
            <div className="gi-card-container">
              <button onClick={toggleBookmark} className={`gi-bookmark-button ${state.bookmark ? 'active' : ''}`}>
                <svg 
                  className="gi-bookmark-icon" 
                  fill="currentcolor" 
                  viewBox="0 0 32 32" 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentcolor" /* Adds stroke color */
                >
                  <path d="M26 1.25h-20c-0.414 0-0.75 0.336-0.75 0.75v0 28.178c0 0 0 0 0 0.001 0 0.414 0.336 0.749 0.749 0.749 0.181 0 0.347-0.064 0.476-0.171l-0.001 0.001 9.53-7.793 9.526 7.621c0.127 0.102 0.29 0.164 0.468 0.164 0.414 0 0.75-0.336 0.751-0.75v-28c-0-0.414-0.336-0.75-0.75-0.75v0zM25.25 28.439l-8.781-7.025c-0.127-0.102-0.29-0.164-0.468-0.164-0.181 0-0.347 0.064-0.477 0.171l0.001-0.001-8.775 7.176v-25.846h18.5z"></path>
                </svg>
              </button>   

              <h1 className="gi-title">{state.title}</h1>
              <p className="gi-description">{state.shortDescription}</p>
              <p className="gi-credits">{state.credits}</p>
              {/* <button onClick={toggleShowMore} className="gi-show-more-button">
                  {state.showMore ? 'Show less' : 'Show more'}
              </button> */}

              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <button className="gi-arrow-button left" onClick={handlePrev}>
                  <svg 
                    className='gi-arrow-icon'
                    fill="currentcolor"
                    stroke="currentcolor"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="6 57 20 20"  >
                    <path d="m22.74,68.05l-11.42,6.59c-.57.33-1.28-.08-1.28-.74v-13.18c0-.66.71-1.06,1.28-.74l11.42,6.59c.57.33.57,1.15,0,1.47Z"/>
                  </svg>

                </button>
              )}
            
              {currentIndex < caseStudies.length - 1 && (
                <button className="gi-arrow-button right" onClick={handleNext}>
                  <svg 
                    className='gi-arrow-icon'
                    fill="currentcolor"
                    stroke="currentcolor"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="6 57 20 20"  >
                    <path d="m22.74,68.05l-11.42,6.59c-.57.33-1.28-.08-1.28-.74v-13.18c0-.66.71-1.06,1.28-.74l11.42,6.59c.57.33.57,1.15,0,1.47Z"/>
                  </svg>
                </button>
              )}
            </div> 
          </div>
        </>
      )}    
      <Menu />
    </div>
  );
};

export default GetInspiredPage;
