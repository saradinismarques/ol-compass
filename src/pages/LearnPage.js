import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/LearnPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import BookmarkIcon from '../assets/bookmark-svgrepo-com.svg';

const LearnPage = ({colors}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    code: '',
    title: '',
    headline: '',
    paragraph: '',
    showMore: false,
    showMoreText: '',
    initialState: true,
    gradientColor: null,
    bookmark: false,
    savedComponents: []
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleCompassClick = (code, title, headline, paragraph, showMoreText, Type) => {
    setState((prevState) => ({
      ...prevState,
      code,
      title,
      headline,
      paragraph,
      showMoreText,
      showMore: false,
      initialState: false,
      gradientColor: colors[Type]
    }));
  };

  const toggleShowMore = () => {
    setState((prevState) => ({
      ...prevState,
      showMore: !prevState.showMore,
    }));
  };

  const toggleBookmark = () => {
    setState((prevState) => {
      // Only add the title if it's not already in the array
      if (!prevState.savedComponents.includes(prevState.title)) {
        return {
          ...prevState,
          savedComponents: [...prevState.savedComponents, prevState.code] // Add the new title to savedComponents array
        };
      }
      
      // If it's already bookmarked, we don't do anything special for now
      return {
        ...prevState,
      };
    });
  };
  

  return (
    <div className='l-gradient-background'
      style={{
        background: state.initialState
          ? 'none'
          : `linear-gradient(to right, #ffffff 30%, ${state.gradientColor} 85%)`
      }}
    >
      <OLCompass 
        colors={colors} 
        action="learn" 
        onButtonClick={handleCompassClick} 
        resetState={resetState}  // Passing resetState to OLCompass
        savedComponents={state.savedComponents}
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
            <div className={state.showMore ? 'l-text expanded scroller' : 'l-text scroller'}>
              <p>{state.paragraph}</p>
              {state.showMore && (
                <>
                  <p>{state.showMoreText}</p>
                </>
              )}
            </div>
              <button onClick={toggleShowMore} className="l-show-more-button">
                {state.showMore ? 'Show less' : 'Show more'}
              </button>
              </div>
            </>
        )} 
        <Menu />
    </div>
  );
};

export default LearnPage;
