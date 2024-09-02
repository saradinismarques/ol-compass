import React, { useState, useEffect, useCallback, useMemo }  from 'react';
import '../styles/IdeatePage.css';
import OLCompass from '../components/OLCompass';
import PostIt from '../components/PostIt';

const IdeatePage = ({colors}) => {
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
      {!state.initialState && (
      <>
        <div class="circle-container">
          <div class="circle circle-left"></div>
          <div class="content content-left">
            <h1>theory-driven ideation</h1>
            <p>select the compass elements you want to tackle and come up with an idea to do so</p>
          </div> 

          <div class="circle circle-right"></div>
          <div class="content content-right">
            <h1>intuition-driven ideation</h1>
            <p>note down your idea and trace it back to the compass elements</p>
          </div> 
        </div>
        
        <PostIt/>
        <OLCompass colors={colors} action="ideate" />

      </>
      )}
      {state.initialState && (
      <>
      <OLCompass colors={colors} action="default-left" />
      <div className='text-container'>
        <p className='question'>
          What's it for?
        </p>
        <p className='headline'>
          Come up with new ideas for pursuing OL
        </p>
        <p className='text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <button onClick={toggleInitialState} className='start-new-button'>
          Start New Ideation Session
        </button>
      </div>
      </>
      )} 
    </div>
  );
};

export default IdeatePage;
