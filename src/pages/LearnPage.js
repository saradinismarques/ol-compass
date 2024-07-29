import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Text.css';
import '../styles/App.css';
import OLDiagram from '../components/OLDiagram';

const LearnPage = () => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: `What's it for?`,
    headline: 'Explore the fundamentals of OL, one by one!',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    instruction: 'Click on any element',
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
      instruction: '',
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
          : `linear-gradient(to right, #ffffff 35%, ${state.gradientColor} 80%)`
      }}
    >
      <OLDiagram size="450" position="left" onButtonClick={handleDiagramClick} />
      <div className="text-container">
        <h1 className={state.initialState ? 'h1-initial' : 'h1-default'}>
          {state.title}
        </h1>
        <h2 className={state.initialState ? 'h2-initial' : 'h2-default'}>
          {state.headline}
        </h2>
        <div className={`${state.initialState ? 'p-initial' : (state.showMore ? 'p-default expanded' : 'p-default')}`}>
          <p>{state.paragraph}</p>
          {state.showMore && (
            <>
              <p>{state.showMoreText}</p>
            </>
          )}
        </div>

        {!state.initialState && (
          <>
            <button onClick={toggleShowMore} className="show-more-button">
              {state.showMore ? 'Show less' : 'Show more'}
            </button>
          </>
        )}

        <h3>{state.instruction}</h3>
      </div>
    </div>
  );
};

export default LearnPage;
