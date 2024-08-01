import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Text.css';
import '../styles/App.css';
import OLDiagram from '../components/OLDiagram';

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
          : `linear-gradient(to right, #ffffff 30%, ${state.gradientColor} 85%)`
      }}
    >
      <OLDiagram size="450" colors={colors} position="left" action="learn" onButtonClick={handleDiagramClick} />
      <div className="text-container">
        {state.initialState && (
          <>
            <p className='title-explanation'>
              What's it for?
            </p>
            <p className='headline-explanation'>
              Explore the fundamentals of OL, one by one!
              </p>
            <p className='text-explanation'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className='instruction'>
              Click on any element
            </p>
          </>
        )}

        {!state.initialState && (
          <>
            <h1 className='title-learn'>{state.title}</h1>
            <h2 className='headline-learn'>{state.headline}</h2>
            <div className={state.showMore ? 'text-learn expanded' : 'text-learn'}>
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
