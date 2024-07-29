import React, { useState, useEffect } from 'react';
import '../styles/Text.css';
import '../styles/App.css';
import OLDiagram from '../components/OLDiagram';

const LearnPage = () => {
  const initialState = {
    title: `What's it for?`,
    headline: 'Explore the fundamentals of OL, one by one!',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    instruction: 'Click on any element',
    showMore: false,
    showMoreText: '',
    showMoreButton: false,
    clickedId: null,
  };

  const [state, setState] = useState(initialState);

  const resetState = () => {
    setState(initialState);
  };

  const handleDiagramClick = (title, headline, paragraph, showMoreText) => {
    setState((prevState) => ({
      ...prevState,
      title,
      headline,
      paragraph,
      showMoreText,
      instruction: '',
      showMore: false,
      showMoreButton: true,
    }));
  };

  const toggleShowMore = () => {
    setState((prevState) => ({
      ...prevState,
      showMore: !prevState.showMore,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      resetState();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <OLDiagram size="450" position="left" onButtonClick={handleDiagramClick} />
      <div className="text-container">
        <h1>{state.title}</h1>
        <h2>{state.headline}</h2>
        <div className={state.showMore ? 'text-content expanded' : 'text-content'}>
          <p>{state.paragraph}</p>
          {state.showMore && (
            <>
              <p>{state.showMoreText}</p>
            </>
          )}
        </div>

        {state.showMoreButton && (
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
