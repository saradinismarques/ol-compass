import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/LearnPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import P1Image from '../images/P1.png';
import P2Image from '../images/P2.png';
import P3Image from '../images/P3.png';
import P4Image from '../images/P4.png';
import P5Image from '../images/P5.png';
import P6Image from '../images/P6.png';
import P7Image from '../images/P7.png';

const LearnPage = ({colors}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    code: '',
    title: '',
    headline: '',
    paragraph: '',
    showMoreText: '',
    designPrompt: '',
    type: null,
    initialState: true,
    showMore: false,
    gradientColor: null,
    bookmark: false,
    showDesignPrompt: false
  }), []);

  const [state, setState] = useState(initialState);
  const [savedComponents, setSavedComponents] = useState([]);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleCompassClick = (code, title, headline, paragraph, showMoreText, designPrompt, type) => {
    setState((prevState) => ({
      ...prevState,
      code,
      title,
      headline,
      paragraph,
      showMoreText,
      designPrompt,
      type,
      initialState: false,
      showMore: false,
      showDesignPrompt: false,
      gradientColor: colors[type]
    }));

    console.log(imageSrc);
  };

  const toggleShowMore = () => {
    setState((prevState) => ({
      ...prevState,
      showMore: !prevState.showMore,
    }));
  };

  const toggleShowDesignPrompt = () => {
    setState((prevState) => ({
      ...prevState,
      showDesignPrompt: true,
    }));
  };

  const toggleBookmark = () => {
    setSavedComponents((prevSavedComponents) => {
      // If the current title is already in the array, remove it
      if (prevSavedComponents.includes(state.code)) {
        return prevSavedComponents.filter(item => item !== state.code);
      }
      // Otherwise, add it to the array
      return [...prevSavedComponents, state.code];
    });
  };
  
  // Dynamically choose image source based on state.code
  const imageSrc = state.code === 'P1' ? P1Image 
                : state.code === 'P2' ? P2Image 
                : state.code === 'P3' ? P3Image 
                : state.code === 'P4' ? P4Image 
                : state.code === 'P5' ? P5Image 
                : state.code === 'P6' ? P6Image 
                : state.code === 'P7' ? P7Image 
                : null;

  return (
    <div>
      <div className='l-gradient-background'
        style={{
          background: state.initialState
            ? 'none'
            : `linear-gradient(to right, transparent 30%, ${state.gradientColor} 70%)`
        }}
      >
        <OLCompass 
          colors={colors} 
          action="learn" 
          onButtonClick={handleCompassClick} 
          resetState={resetState}  // Passing resetState to OLCompass
          savedComponents={savedComponents}
        />

        {state.initialState && (
            <>
            <div className="text-container">
                <p className='question'>
                  What's it for?
                </p>
                <p className='headline'>
                  Explore the fundamentals of OL, one by one!
                  </p>
                <p className='text'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className='instruction'>
                  Click on any element
                </p>
              </div>
            </>

          )}

          {!state.initialState && (
            <>
            <div className='l-bookmark-container'>
              <div className="l-white-line"></div>
              <button onClick={toggleBookmark} className={`l-bookmark-button ${state.bookmark ? '' : ''}`}>
                <svg 
                  className="l-bookmark-icon" 
                  fill="currentcolor" 
                  viewBox="0 0 32 32" 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentcolor" /* Adds stroke color */
                >
                  <path d="M26 1.25h-20c-0.414 0-0.75 0.336-0.75 0.75v0 28.178c0 0 0 0 0 0.001 0 0.414 0.336 0.749 0.749 0.749 0.181 0 0.347-0.064 0.476-0.171l-0.001 0.001 9.53-7.793 9.526 7.621c0.127 0.102 0.29 0.164 0.468 0.164 0.414 0 0.75-0.336 0.751-0.75v-28c-0-0.414-0.336-0.75-0.75-0.75v0zM25.25 28.439l-8.781-7.025c-0.127-0.102-0.29-0.164-0.468-0.164-0.181 0-0.347 0.064-0.477 0.171l0.001-0.001-8.775 7.176v-25.846h18.5z"></path>
                </svg>
              </button>
            </div>

            <div className="l-text-container">
              <h1 className='l-title'>{state.title}</h1>
              <h2 className='l-headline' dangerouslySetInnerHTML={{ __html: state.headline }}></h2>
              <div className="l-text expanded scroller">
                <p dangerouslySetInnerHTML={{__html: state.paragraph.replace(/\*(.*?)\*/g, '<b>$1</b>')}}></p>
                {/* {state.showMore && (
                  <>
                    <p>{state.showMoreText}</p>
                  </>
                )} */}
              </div>
              {state.type != "Principle" && (
                <>
                {state.showDesignPrompt ? (
                  <p className='l-design-prompt'>{state.designPrompt}</p>
                ) : (
                  <button onClick={toggleShowDesignPrompt} className="l-show-more-button">
                    Design Prompt
                  </button>
                )}
                </>
              )}
                {/* <button onClick={toggleShowMore} className="l-show-more-button">
                  {state.showMore ? 'Show less' : 'Show more'}
                </button> */}
            </div>
            </>
          )} 
          <Menu />
      </div>
      {/* Conditionally render the image if an image source is set */}
      {imageSrc && (
        <div className="l-image-container">
          <img src={imageSrc} alt={`Background ${state.code}`} className="l-principles-image" />
        </div>
      )}
      {imageSrc === null && (
        <div className="l-image-container">
          <img src={imageSrc} alt={`Background ${state.code}`} className="l-other-components-image" />
        </div>
      )}
    </div>
  );
};

export default LearnPage;
