import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/AnalyzePage.css';
import OLCompass from '../components/OLCompass';

const GetInspiredPage = ({colors}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    initialState: true,
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const toggleInitialState = () => {
    setState((prevState) => ({
      ...prevState,
      initialState: false,
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
      <OLCompass colors={colors} position="left" action="analyze" />
        {state.initialState && (
        <>
        <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Scan an OL practice or resource you developed!
            </p>
            <p className='text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button onClick={toggleInitialState} className='start-new-button'>
              Start New Analysis
            </button>
        </div>
        </>
        )} 

        {!state.initialState && (
        <>
        <div className="a-text-container">
        <div className="a-title">
            <input className="a-placeholder" type="text" placeholder="Insert Title" />
        </div>
        <div className='a-text'>
            <p className='a-small-instruction'>Select all relevant elements</p>
            <div className='a-instruction-container'>
                <p className='a-instruction'>Click again to deselect</p>
                <p className='a-instruction'>Long press to recall description</p>
            </div>
            <div className='a-question-container'>
                <p className='a-question'>Which principles does your case address?</p>
                <p className='a-question'>Which perspective(s) does it express?</p>
                <p className='a-question'>Which dimension(s) does it pertain?</p>
            </div>
        </div>
        <div className="a-description">
            <textarea className="a-placeholder" placeholder="Insert Description"></textarea>
        </div>
        <button className="a-upload-picture-button">Upload Picture</button>
        <div className="a-insert-sources">
            <input type="text" className="a-placeholder" placeholder="Insert Sources/Credits" />
        </div>
        <button className="a-preview-button">Preview</button>
        </div>
        </>
        )}    
    </div>
  );
};

export default GetInspiredPage;
