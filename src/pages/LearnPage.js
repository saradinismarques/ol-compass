import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/LearnPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';

const LearnPage = ({colors}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '',
    headline: '',
    paragraph: '',
    showMore: false,
    showMoreText: '',
    initialState: true,
    gradientColor: null
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    console.log("LEarn");
    setState(initialState);
  }, [initialState]);

  const handleDiagramClick = (title, headline, paragraph, showMoreText, Type) => {
    setState((prevState) => ({
      ...prevState,
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
        onButtonClick={handleDiagramClick} 
        resetState={resetState}  // Passing resetState to OLCompass
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
          <div className="l-text-container">
            <h1 className='l-title'>{state.title}</h1>
            <h2 className='l-headline'>{state.headline}</h2>
            <div className={state.showMore ? 'l-text expanded' : 'l-text'}>
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
