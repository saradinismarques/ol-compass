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
    firstClick: true,
    showMessage: false
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


  // const handleClick = useCallback(() => {
  //   if(state.firstClick) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       firstClick: false,
  //       showMessage: true,
  //     }));
  //   }

  //   if (!state.initialState) return;

  //   const fetchedCaseStudies = getCaseStudies();
  //   setCaseStudies(fetchedCaseStudies);

  //   if (fetchedCaseStudies.length > 0) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       title: fetchedCaseStudies[0].Title,
  //       shortDescription: fetchedCaseStudies[0].ShortDescription,
  //       credits: fetchedCaseStudies[0].Credits,
  //       components: fetchedCaseStudies[0].Components,
  //       showMore: false,
  //       bookmark: getBookmarkState(fetchedCaseStudies[0].Title),
  //       initialState: false,
  //     }));
  //     setCurrentIndex(0); // Reset to first case study
  //   }

  // }, [state.initialState, state.firstClick, getBookmarkState]);

  const handleKeyDown = useCallback((e) => {
    if(e.key !== 'Enter') return;

    if(state.firstClick) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
      }));
    }

    if (!state.initialState) return;

    const fetchedCaseStudies = getCaseStudies();
    setCaseStudies(fetchedCaseStudies);

    if (fetchedCaseStudies.length > 0) {
      setState((prevState) => ({
        ...prevState,
        title: fetchedCaseStudies[0].Title,
        shortDescription: fetchedCaseStudies[0].ShortDescription,
        credits: fetchedCaseStudies[0].Credits,
        components: fetchedCaseStudies[0].Components,
        showMore: false,
        bookmark: getBookmarkState(fetchedCaseStudies[0].Title),
        initialState: false,
      }));
      setCurrentIndex(0); // Reset to first case study
    }

  }, [state.initialState, state.firstClick, getBookmarkState]);


  // useEffect(() => {
  //   // Attach the click event listener to the specific area instead of the entire window
  //   const clickableArea = clickableAreaRef.current;
  //   if (clickableArea) {
  //     clickableArea.addEventListener('click', handleClick);
  //   }
  //   // Cleanup function to remove the event listener when the component unmounts
  //   return () => {
  //     if (clickableArea) {
  //       clickableArea.removeEventListener('click', handleClick);
  //     } 
  //   };
  // }, [handleClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [handleKeyDown]); // Dependency array includes handleKeyDown


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
    <div className={`${state.showMessage ? "blur-background" : ""}`} ref={clickableAreaRef}>
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
              You get OL theory, yet wonder how it works in practice?
              <br></br>
              In the GET INSPIRED mode the Compass gives you access to a variety of OL resources and initiatives, explained in terms of Principles, Perspectives and Dimensions addressed.
              <br></br>
              <br></br>
              Select as many waves (
                <svg 
                  className='text-icon'
                  fill="currentcolor"
                  stroke="currentcolor"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="-1.5 -4 35 10"  >
                  <path class="cls-1" d="m32.54,8.56l-11.43,7.13c-3.07,1.92-6.61,1.92-9.68,0L0,8.56,11.43,1.44c3.07-1.92,6.61-1.92,9.68,0l11.43,7.13Z"/>
                </svg>
              ) as you like and press 'Enter' to filter examples.
              To see a carousel of popular OL examples just press 'Enter'.       
            </p>

          </div>
        </>
      )} 

      {!state.initialState && (
        <>
        <button onClick={showMessage} className="question-button">
              <svg 
                className="question-icon" 
                fill="currentcolor" 
                stroke="currentcolor" /* Adds stroke color */
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="-1 109 35 35"  
                >
                <path d="m14.01,133.19c0-1.09.05-2.04.16-2.87.1-.83.38-1.66.82-2.5.42-.79.93-1.45,1.55-1.97.61-.52,1.25-1.02,1.92-1.48.67-.47,1.3-1.02,1.9-1.66.54-.63.91-1.26,1.09-1.9s.27-1.32.27-2.03-.09-1.34-.26-1.9c-.17-.56-.44-1.04-.8-1.44-.56-.68-1.24-1.15-2.05-1.4s-1.65-.38-2.53-.38-1.67.12-2.41.37c-.75.24-1.36.62-1.85,1.12-.47.45-.82.98-1.03,1.61-.22.63-.32,1.29-.32,1.98h-3.17c.06-1.1.3-2.18.72-3.23.42-1.05,1.05-1.93,1.87-2.64.82-.75,1.78-1.3,2.87-1.64,1.09-.34,2.2-.51,3.31-.51,1.36,0,2.66.21,3.88.62,1.23.41,2.26,1.1,3.09,2.06.67.71,1.16,1.52,1.47,2.43.31.91.47,1.88.47,2.91,0,1.16-.22,2.24-.65,3.26-.43,1.02-1.04,1.92-1.82,2.72-.47.52-1.01.99-1.61,1.43-.6.44-1.17.89-1.72,1.36-.55.47-.97.97-1.26,1.51-.36.67-.56,1.3-.6,1.9-.03.6-.05,1.36-.05,2.28h-3.26Zm.02,8.21v-4.09h3.24v4.09h-3.24Z"/>
              </svg>
            </button>
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
                    viewBox="8.5 59 16 16"  >
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
                    viewBox="8.5 59 16 16"  >
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
    {!state.initialState && state.showMessage && (
      <>
      <div className="message-box">
        <div className="question-circle">
            <svg 
                className="question-icon" 
                fill="currentcolor" 
                stroke="currentcolor" /* Adds stroke color */
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="-1 109 35 35"  
              >
              <path d="m14.01,133.19c0-1.09.05-2.04.16-2.87.1-.83.38-1.66.82-2.5.42-.79.93-1.45,1.55-1.97.61-.52,1.25-1.02,1.92-1.48.67-.47,1.3-1.02,1.9-1.66.54-.63.91-1.26,1.09-1.9s.27-1.32.27-2.03-.09-1.34-.26-1.9c-.17-.56-.44-1.04-.8-1.44-.56-.68-1.24-1.15-2.05-1.4s-1.65-.38-2.53-.38-1.67.12-2.41.37c-.75.24-1.36.62-1.85,1.12-.47.45-.82.98-1.03,1.61-.22.63-.32,1.29-.32,1.98h-3.17c.06-1.1.3-2.18.72-3.23.42-1.05,1.05-1.93,1.87-2.64.82-.75,1.78-1.3,2.87-1.64,1.09-.34,2.2-.51,3.31-.51,1.36,0,2.66.21,3.88.62,1.23.41,2.26,1.1,3.09,2.06.67.71,1.16,1.52,1.47,2.43.31.91.47,1.88.47,2.91,0,1.16-.22,2.24-.65,3.26-.43,1.02-1.04,1.92-1.82,2.72-.47.52-1.01.99-1.61,1.43-.6.44-1.17.89-1.72,1.36-.55.47-.97.97-1.26,1.51-.36.67-.56,1.3-.6,1.9-.03.6-.05,1.36-.05,2.28h-3.26Zm.02,8.21v-4.09h3.24v4.09h-3.24Z"/>
            </svg>
          </div>
        <p class="message-text">
          By default, the search includes results that contain either of the
          <svg 
            id='wave'
            className='message-icon'
            fill="currentcolor"
            stroke="currentcolor"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="-1 -17.5 35 35"  >
            <path class="cls-1" d="m32.54,8.56l-11.43,7.13c-3.07,1.92-6.61,1.92-9.68,0L0,8.56,11.43,1.44c3.07-1.92,6.61-1.92,9.68,0l11.43,7.13Z"/>
          </svg> 
          you selected. Thus, the more 
          <svg 
            id='wave'
            className='message-icon'
            fill="currentcolor"
            stroke="currentcolor"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="-1 -17.5 35 35"  >
            <path class="cls-1" d="m32.54,8.56l-11.43,7.13c-3.07,1.92-6.61,1.92-9.68,0L0,8.56,11.43,1.44c3.07-1.92,6.61-1.92,9.68,0l11.43,7.13Z"/>
          </svg>
          you select, the more case-studies are shown.
          <br></br>
          Click on the 
          <svg 
            id='arrow'
            className='message-icon smaller'
            fill="currentcolor"
            stroke="currentcolor"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="8 57.8 17 17"  >
            <path d="m22.74,68.05l-11.42,6.59c-.57.33-1.28-.08-1.28-.74v-13.18c0-.66.71-1.06,1.28-.74l11.42,6.59c.57.33.57,1.15,0,1.47Z"/>
          </svg> 
          to browse case-studies. 
          You can order and further filter them from the two top-right drop-down menus. Click on 
          <svg
            id='bookmark'
            className='message-icon smaller'
            fill="currentcolor"
            stroke="currentcolor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="8 175.5 17 17"  >
            <path d="m16.61,187.76c-1.55,1.27-3.06,2.51-4.57,3.74-.32.26-.61.55-.95.77-.18.11-.47.19-.65.12-.14-.05-.24-.36-.25-.55-.02-1.13-.01-2.27-.01-3.4,0-3.73,0-7.47,0-11.2,0-.84.08-.91.93-.91,3.68,0,7.36,0,11.04,0,.79,0,.88.09.88.91,0,4.79,0,9.59-.01,14.38,0,.28-.18.55-.28.83-.26-.1-.57-.14-.77-.31-1.78-1.43-3.54-2.88-5.36-4.37Z"/>
          </svg> 
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
