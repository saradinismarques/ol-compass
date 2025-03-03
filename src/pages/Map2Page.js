import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { StateContext } from "../State";
import '../styles/pages/Map2Page.css';

const Map2Page = () => {
  const {
    colors,
    firstMessage,
    isExplanationPage,
    setIsExplanationPage,
    mapComponents,
    setMapComponents,
    mapProjectName,
    setMapProjectName,
  } = useContext(StateContext);

  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const componentsRef = useRef(mapComponents);
  const showMessageRef = useRef(showMessage);

  useEffect(() => {
    componentsRef.current = mapComponents; // Keep the ref in sync with the latest state
  }, [mapComponents]);
  
  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

  // Reset state and UI elements
  const resetState = useCallback(() => {
    setFirstClick(true);
    setShowMessage(false);
    showMessageRef.current = false;
    setIsExplanationPage(true);
  }, [setIsExplanationPage]);

  // Trigger compass action
  const handleCompassClick = (code) => {
    // if (firstClick && firstMessage["contribute"]) {
    //   setFirstClick(false);
    //   setShowMessage(true);
    //   showMessageRef.current = true;
    // }

    setMapComponents(prevComponents => {
      const newComponents = prevComponents.includes(code)
        ? prevComponents.filter(buttonId => buttonId !== code) // Remove ID if already clicked
        : [...prevComponents, code]; // Add ID if not already clicked
      componentsRef.current = newComponents;
      
      // Return the updated state
      return newComponents;
    });

    setIsExplanationPage(false);
  };

  const messageStateChange = (state) => {
    setShowMessage(state);
    showMessageRef.current = state;
  };

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Enter') return;

    if(!showMessageRef.current) {
    //   if (firstClick && firstMessage["contribute"]) {
    //     setFirstClick(false);
    //     setShowMessage(true);
    //     showMessageRef.current = true;
    //   }
      if(isExplanationPage)
        setIsExplanationPage(false);
    }
  }, [firstClick, firstMessage, setIsExplanationPage, isExplanationPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update form state
  const handleProjectNameChange = (e) => {
    setMapProjectName(e.target.value);
  };

  return (
    <>
      <div className={showMessage ? 'blur-background' : ''}>
        <Compass
          mode="contribute"
          position={isExplanationPage ? 'center' : 'left'}
          resetState={resetState}
          onButtonClick={handleCompassClick}
          stateSaved={mapComponents}
        />
        {isExplanationPage && 
          <Description mode="contribute" />
        }

        {!isExplanationPage && (
          <>
            <Message 
              mode={"contribute"} 
              type={"button"} 
              messageStateChange={messageStateChange}  
            />

            <div className='m2-text-container'>
              <textarea
                  className="m2-project-name-textarea" 
                  type="text" 
                  placeholder='Insert Map Title'
                  value={mapProjectName} 
                  onChange={handleProjectNameChange}
                  spellCheck="false"
                  disabled={window.innerWidth > 1300 ? false : true}
              ></textarea>
            </div>
          </>
        )}
        <Menu />
      </div>
      {!isExplanationPage && (
        <Message
          mode={"contribute"}
          type={"message"}
          showMessage={showMessage} // Pass whether to show the message
          messageStateChange={messageStateChange}
        />
      )}
    </>
  );
};

export default Map2Page;
