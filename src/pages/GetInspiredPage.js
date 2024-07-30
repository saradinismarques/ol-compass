import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Text.css';
import OLDiagram from '../components/OLDiagram';

const GetInspiredPage = () => {
  const initialText = {
    title: `What's it for?`,
    headline: 'Browse inspiring application cases',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    instruction: 'Select as many elements as you like to filter examples'
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
    <div>
      <OLDiagram size="450" position="left" onButtonClick={handleDiagramClick} />
        {state.initialState && (
        <>
        <div className='text-container'>
            <h1 className='title-initial'>{initialText.title}</h1>
            <h2 className='headline-initial'>{initialText.headline}</h2>
            <p className='text-initial'>{initialText.paragraph}</p>
            <h3 className='instruction'>{initialText.instruction}</h3>
        </div>
        </>
        )} 

        {!state.initialState && (
        <>
        <div className='card-text-container'>
        <p className='results-get-inspired'>
            <span className='bold-text'>16 </span>
            results | Relevance
        </p>
        <div className="card-container">
            <h1 className="title-get-inspired">[Title XXX]</h1>
            <p className="description-get-inspired">[Short Description]</p>
            <p className="credits-get-inspired">Credits: [Lorem Ipsum]</p>
            <button onClick={toggleShowMore} className="show-more-button get-inspired">
                {state.showMore ? 'Show less' : 'Show more'}
            </button>
        </div>
        </div>
        </>
        )}    


    </div>
  );
};

export default GetInspiredPage;
