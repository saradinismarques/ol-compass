import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    showMore: false,
    initialState: true,
  }), []);

  const [state, setState] = useState(initialState);
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  function getBookmarkState(title) {
    if(savedCaseStudies.length !== 0 && savedCaseStudies.includes(title)) 
      return true;
    else
      return false;
  }

  const handleEnterClick = (components) => {
    const fetchedCaseStudies = getCaseStudies(components);
    setCaseStudies(fetchedCaseStudies);

    if (fetchedCaseStudies.length > 0) {
      setState({
        title: fetchedCaseStudies[0].Title,
        shortDescription: fetchedCaseStudies[0].ShortDescription,
        credits: fetchedCaseStudies[0].Credits,
        showMore: false,
        bookmark: getBookmarkState(fetchedCaseStudies[0].Title),
        initialState: false,
      });
      setCurrentIndex(0); // Reset to first case study
    }
  };

  const toggleShowMore = () => {
    setState((prevState) => ({
      ...prevState,
      showMore: !prevState.showMore,
    }));
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

      let bookmark;

      console.log(savedCaseStudies);
      if(savedCaseStudies.includes(caseStudies[prevIndex].Title)) 
        bookmark = true;
      else
        bookmark = false;

      setState({
        ...state,
        title: caseStudies[prevIndex].Title,
        shortDescription: caseStudies[prevIndex].ShortDescription,
        credits: caseStudies[prevIndex].Credits,
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
    <div>
      <OLCompass 
        colors={colors} 
        action="get-inspired" 
        onButtonClick={handleEnterClick} 
        resetState={resetState} // Passing resetState to OLCompass
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
            <p className='instruction'>
              Select as many elements as you like to filter examples
            </p>
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
                    className="gi-arrow-icon"
                    fill="currentcolor"
                    viewBox="0 0 123.959 123.959" 
                    xmlns="http://www.w3.org/2000/svg" 
                    stroke="currentcolor"
                  >
                    <path d="M66.18,29.742c-2.301-2.3-6.101-2.3-8.401,0l-56,56c-3.8,3.801-1.1,10.2,4.2,10.2h112c5.3,0,8-6.399,4.2-10.2L66.18,29.742	z"/>           
                  </svg>
                </button>
              )}
            
              {currentIndex < caseStudies.length - 1 && (
                <button className="gi-arrow-button right" onClick={handleNext}>
                  <svg
                    className="gi-arrow-icon"
                    fill="currentcolor"
                    viewBox="0 0 123.959 123.959" 
                    xmlns="http://www.w3.org/2000/svg" 
                    stroke="currentcolor"
                  >
                    <path d="M66.18,29.742c-2.301-2.3-6.101-2.3-8.401,0l-56,56c-3.8,3.801-1.1,10.2,4.2,10.2h112c5.3,0,8-6.399,4.2-10.2L66.18,29.742	z"/>           
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
