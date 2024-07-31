import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Text.css';
import OLDiagram from '../components/OLDiagram';

const GetInspiredPage = ({colors}) => {
  const explanationText = {
    title: `What's it for?`,
    headline: 'Browse inspiring application cases',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    instruction: 'Select as many elements as you like to filter examples'
  };

  // Memoize the initialState object
  const initialState = useMemo(() => ({
    text: [], 
    showMore: false,
    initialState: true,
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleEnterClick = (components) => {
    const text = components.join('\n');

    setState((prevState) => ({
        ...prevState,
        text,
        showMore: false,
        initialState: false,
    }));
    console.log(state.components);
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
      <OLDiagram size="450" colors={colors} position="left" action="get-inspired" onButtonClick={handleEnterClick} />
        {state.initialState && (
        <>
        <div className='text-container'>
            <h1 className='title-explanation'>{explanationText.title}</h1>
            <h2 className='headline-explanation'>{explanationText.headline}</h2>
            <p className='text-explanation'>{explanationText.paragraph}</p>
            <h3 className='instruction'>{explanationText.instruction}</h3>
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
            <p className="description-get-inspired">{state.text}</p>
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
