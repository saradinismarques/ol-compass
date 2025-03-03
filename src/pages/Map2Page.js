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
  const [limitExceeded, setLimitExceeded] = useState(false);

  const componentsRef = useRef(mapComponents);
  const showMessageRef = useRef(showMessage);
  const textareaRefs = useRef([]); // Initialize refs for textareas

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
  const handleCompassClick = (code, label, paragraph, type) => {
    // if (firstClick && firstMessage["map-2"]) {
    //   setFirstClick(false);
    //   setShowMessage(true);
    //   showMessageRef.current = true;
    // }
    if(code) {
      setMapComponents(prevComponents => {
        const exists = prevComponents.some(component => component.code === code);
      
        if (exists && !isExplanationPage) {
          // Remove component if it already exists
          const updatedComponents = prevComponents.filter(component => component.code !== code);
      
          // Focus on the last textarea after removal (if any remain)
          setTimeout(() => {
            if (updatedComponents.length > 0) {
              textareaRefs.current[updatedComponents.length - 1]?.focus();
            }
          }, 0); // Ensuring it runs after the state update
      
          return updatedComponents;
        } else if (exists && isExplanationPage) {
          return prevComponents;
        } else {
          // Add new component with default values
          const newComponent = { code, label, paragraph, type, text: "" };
          const updatedComponents = [...prevComponents, newComponent];
      
          // Focus the last added textarea
          setTimeout(() => {
            textareaRefs.current[updatedComponents.length - 1]?.focus();
          }, 0); // Ensuring it runs after the state update
      
          return updatedComponents;
        }
      });
      
      setLimitExceeded(false);
    } else {
      setLimitExceeded(true);
    }
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
    //   if (firstClick && firstMessage["map-2"]) {
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

  // Update individual component text field
  const handleComponentChange = (e, index) => {
    if(e.target.value.length < 105) {
      let updatedComponents = [...mapComponents];
      updatedComponents[index] = { ...updatedComponents[index], text: e.target.value };
      setMapComponents(updatedComponents);
    }
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`; // Return as "r, g, b"
  };

  return (
    <>
      <div className={showMessage ? 'blur-background' : ''}>
        <Compass
          mode="map-2"
          position={isExplanationPage ? 'center' : 'left'}
          resetState={resetState}
          onButtonClick={handleCompassClick}
          stateSaved={mapComponents.map(component => component.code)}
        />
        {isExplanationPage && 
          <Description mode="map-2" />
        }

        {!isExplanationPage && (
          <>
            <Message 
              mode={"map-2"} 
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
            
            {/* First section for the first 5 components */}
            <div className="m2-components-textarea-container">
              {mapComponents.map((component, id) => (
                id <= 3 && (
                  <div key={id} className="m2-components-textarea">
                    <textarea
                      className="m2-component-textarea"
                      ref={(el) => textareaRefs.current[id] = el} // Assign ref to each textarea
                      style={{
                        '--text-color': colors['Text'][component.type], // Define CSS variable
                        backgroundColor: `rgba(${hexToRgb(colors['Wave'][component.type])}, 0.3)`,
                      }}
                      type="text"
                      placeholder={`Why does your project have ${component.label}?`}
                      value={component.text}
                      onChange={(e) => handleComponentChange(e, id)}
                      spellCheck="false"
                      disabled={window.innerWidth > 1300 ? false : true}
                    />
                  </div>
                )
              ))}
            </div>

            {/* Second section for components with id > 4 */}
            <div className="m2-components-textarea-container left">
              {mapComponents.map((component, id) => (
                id > 3 && (
                  <div key={id} className="m2-components-textarea">
                    <textarea
                      className="m2-component-textarea"
                      style={{
                        '--text-color': colors['Text'][component.type], // Define CSS variable
                        backgroundColor: `rgba(${hexToRgb(colors['Wave'][component.type])}, 0.3)`,
                      }}
                      type="text"
                      placeholder={`Why does your project have ${component.label}?`}
                      value={component.text}
                      onChange={(e) => handleComponentChange(e, id)}
                      spellCheck="false"
                      disabled={window.innerWidth > 1300 ? false : true}
                    />
                  </div>
                )
              ))}
            </div>

            {limitExceeded &&
              <div className='m2-limit-exceed-message'>
                Maximum 10 elements!
              </div>
            }
          </>
        )}
        <Menu />
      </div>
      {!isExplanationPage && (
        <Message
          mode={"map-2"}
          type={"message"}
          showMessage={showMessage} // Pass whether to show the message
          messageStateChange={messageStateChange}
        />
      )}
    </>
  );
};

export default Map2Page;
