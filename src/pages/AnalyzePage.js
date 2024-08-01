import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Text.css';
import OLDiagram from '../components/OLDiagram';

const GetInspiredPage = ({colors}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    text: [], 
    showMore: false,
    initialState: true,
  }), []);

  const [state, setState] = useState(initialState);

  const toggleInitialState = () => {
    setState((prevState) => ({
      ...prevState,
      initialState: false,
    }));
  };

  return (
    <div>
      <OLDiagram size="450" colors={colors} position="left" action="analyze" />
        {state.initialState && (
        <>
        <div className='text-container'>
            <p className='title-explanation'>
              What's it for?
            </p>
            <p className='headline-explanation'>
              Scan an OL practice or resource you developed!
            </p>
            <p className='text-explanation'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button onClick={toggleInitialState} className='start-analysis-button'>
              Start New Analysis
            </button>
        </div>
        </>
        )} 

        {!state.initialState && (
        <>
        <div className="input-container">
        <div className="title">
            <input className="font-placeholder" type="text" placeholder="Insert Title" />
        </div>
        <p className='select-text'>Select all relevant elements</p>
        <div className='instruction-container'>
            <p className='instruction-text'>Click again to deselect</p>
            <p className='instruction-text'>Long press to recall description</p>
        </div>
        <div className='questions-container'>
            <p className='question-text'>Which principles does your case address?</p>
            <p className='question-text'>Which perspective(s) does it express?</p>
            <p className='question-text'>Which dimension(s) does it pertain?</p>
        </div>
        <div className="description">
            <textarea className="font-placeholder" placeholder="Insert Description"></textarea>
        </div>
        <button className="upload-picture-button">Upload Picture</button>
        <div className="insert-sources">
            <input type="text" className="font-placeholder" placeholder="Insert Sources/Credits" />
        </div>
        <button className="preview-button">Preview</button>
        </div>
        </>
        )}    


    </div>
  );
};

export default GetInspiredPage;
