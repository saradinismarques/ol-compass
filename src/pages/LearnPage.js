import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Text.css';
import '../styles/App.css';
import OLDiagram from '../components/OLDiagram';
import ArrowIcon from '../assets/arrow-icon.svg'; 

const LearnPage = () => {
  const initialText = {
    title: `What's it for?`,
    headline: 'Explore the fundamentals of OL, one by one!',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    instruction: 'Click on any element'
  };

  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '',
    headline: '',
    paragraph: '',
    instruction: '',
    showMore: false,
    showMoreText: '',
    initialState: true,
    gradientColor: null
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleDiagramClick = (title, headline, paragraph, showMoreText, gradientColor) => {
    setState((prevState) => ({
      ...prevState,
      title,
      headline,
      paragraph,
      showMoreText,
      showMore: false,
      initialState: false,
      gradientColor
    }));
  };

  const toggleShowMore = () => {
    setState((prevState) => ({
      ...prevState,
      showMore: !prevState.showMore,
    }));
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      resetState();
    }
  }, [resetState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [handleKeyDown]);


  return (
    <div className='gradient-background'
      style={{
        background: state.initialState
          ? 'none'
          : `linear-gradient(to right, #ffffff 40%, ${state.gradientColor} 85%)`
      }}
    >
      <OLDiagram size="450" position="left" onButtonClick={handleDiagramClick} />
      <div className="text-container">
        {state.initialState && (
          <>
            <h1 className='h1-initial'>{initialText.title}</h1>
            <h2 className='h2-initial'>{initialText.headline}</h2>
            <p className='p-initial'>{initialText.paragraph}</p>
            <h3 className='h3-initial'>{initialText.instruction}</h3>
          </>
        )}

        {!state.initialState && (
          <>
            <h1 className='h1-learn'>{state.title}</h1>
            <h2 className='h2-learn'>{state.headline}</h2>
            <div className={state.showMore ? 'p-learn expanded' : 'p-learn'}>
              <p>{state.paragraph}</p>
              {state.showMore && (
                <>
                  <p>{state.showMoreText}</p>
                </>
              )}
            </div>
              <button onClick={toggleShowMore} className="show-more-button">
                {state.showMore ? 'Show less' : 'Show more'}
              </button>
            </>
        )}
      </div>      
    </div>
  );
};

export default LearnPage;
