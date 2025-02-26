import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
import { replaceBoldsUnderlinesHighlights } from '../utils/TextFormatting.js';
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import '../styles/pages/Learn2Page.css';

const Learn2Page = () => {
  const {
    colors,
    firstMessage,
    isExplanationPage,
    setIsExplanationPage,
    savedComponents,
    setSavedComponents,
    allComponents
  } = useContext(StateContext);

  const initialComponent = useMemo(() => ({
    title: '',
    paragraph: '',
    type: null,
    bookmark: false,
  }), []);

  const [component, setComponent] = useState(initialComponent);
  const [currentLinks, setCurrentLinks] = useState(null);
  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  // Initialize activeButton as an object with all entries set to 0
  const [activeButton, setActiveButton] = useState(
    allComponents.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );

  const navigate = useNavigate(); // Initialize the navigate function
  
  const componentRef = useRef(component);
  const activeButtonRef = useRef(activeButton);
  const showMessageRef = useRef(showMessage);

  useEffect(() => {
      componentRef.current = component;
  }, [component]);

  useEffect(() => {
    activeButtonRef.current = activeButton;
}, [activeButton]);

  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--component-bookmark-color', colors['CBookmark']);
  document.documentElement.style.setProperty('--component-bookmark-hover-color', colors['CBookmark Hover']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][component.type]);
  document.documentElement.style.setProperty('--image-color', colors['Wave'][component.type]);
  document.documentElement.style.setProperty('--highlightP-color', colors['Wave']['Principle']);
  document.documentElement.style.setProperty('--highlightPe-color', colors['Wave']['Perspective']);
  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

  const resetState = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.some(item => item.code === code);
  }, [savedComponents]);

  const handleCompassClick = (data) => {
    // if (firstClick && firstMessage["learn"]) {
    //   setFirstClick(false);
    //   setShowMessage(true);
    //   showMessageRef.current = true;
    // }

    if (data === null) 
      return;

    const {
      code,
      title,
      paragraph,
      type,
      wbc_links = null,
      region_feature = null,
      country_e1 = null,
      ce1_links = null,
      country_e2 = null,
      ce2_links = null,
      diff_code = null,
      diff_label = null,
      diff_paragraph = null,
      example_1 = null,
      example_2 = null,
      e1_codes = null,
      e2_codes = null
    } = data;

    setComponent((prevComponent) => {
      const updatedComponent = {
        ...prevComponent,
        code,
        title,
        paragraph,
        type,
        bookmark: getBookmarkState(code),
        ...(type === 'Principle'
          ? { wbc_links, region_feature, country_e1, ce1_links, country_e2, ce2_links }
          : { diff_code, diff_label, diff_paragraph, example_1, example_2, e1_codes, e2_codes }),
      };
  
      // Update the ref
      componentRef.current = updatedComponent;
  
      return updatedComponent;
    });

    const currentButton = activeButtonRef.current[code];
    
    if(currentButton === 0)
      setCurrentLinks(null);
    else if(currentButton === 1)
      if(type === 'Principle')
        setCurrentLinks(wbc_links);
      else 
        setCurrentLinks(diff_code);
    else if(currentButton === 2)
      if(type === 'Principle')
        setCurrentLinks(ce1_links);
      else 
        setCurrentLinks(e1_codes);

    document.documentElement.style.setProperty('--text-color', colors['Text'][type]);
    document.documentElement.style.setProperty('--wave-color', colors['Wave'][type]);
  
    setIsExplanationPage(false);
  };

  const getButtonsText = (buttonIndex) => {
    const activeButton = activeButtonRef.current[componentRef.current.code];
    const type = componentRef.current.type;
  
    // Define button text mappings
    const buttonTexts = {
      0: {
        0: replaceBoldsUnderlinesHighlights(
          componentRef.current.paragraph,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        1: <span className='l2-question'>
          {type === 'Principle'  
            ? <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</> 
            : <>How does it differ from <span className="l2-question-bold">{component.diff_label.toUpperCase()}</span>?</>
          }</span>,
        2: <span className='l2-question'>
          {type === 'Principle' 
            ? <>How does it apply to <span className="l2-question-bold">Portugal</span>?</> 
            : "How can it be applied in practice?"
          }</span>,
      },
      1: {
        0: <span className='l2-question'>In short</span>,
        1: replaceBoldsUnderlinesHighlights(
          type === 'Principle' ? componentRef.current.region_feature : componentRef.current.diff_paragraph,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        2: <span className='l2-question'>
          {type === 'Principle' 
            ? <>How does it apply to <span className="l2-question-bold">Portugal</span>?</> 
            : "How can it be applied in practice?"
          }</span>,
      },
      2: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
          {type === 'Principle' 
            ? <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>  
            : <>How does it differ from <span className="l2-question-bold">{component.diff_label.toUpperCase()}</span>?</>
          }</span>,
        2: replaceBoldsUnderlinesHighlights(
          type === 'Principle' ? componentRef.current.country_e1 : componentRef.current.example_1,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      3: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
          {type === 'Principle' 
            ? <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</> 
            : <>How does it differ from <span className="l2-question-bold">{component.diff_label.toUpperCase()}</span>?</>
          }</span>,
        2: replaceBoldsUnderlinesHighlights(
          type === 'Principle' ? componentRef.current.country_e2 : componentRef.current.example_2,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
          {type === 'Principle' 
            ? <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>  
            : <>How does it differ from <span className="l2-question-bold">{component.diff_label.toUpperCase()}</span>?</>
          }</span>,
        2: <span className='l2-question'>
          {type === 'Principle' 
            ? <>How does it apply to <span className="l2-question-bold">Portugal</span>?</>  
            : "How can it be applied in practice?"
          }</span>,
      },
    };
  
    return buttonTexts[activeButton]?.[buttonIndex] || null;
  };  

  // Keyboard event handler
  const handleButtonClick = (index) => {
    setActiveButton((prevState) => {
      const currentValue = prevState[componentRef.current.code];
      const newIndex = currentValue === index ? null : index;
  
      // Clear links for 0 or null
      if (newIndex === 0 || newIndex === null) {
        setCurrentLinks(null);
        return updateState(prevState, newIndex);
      }
  
      // Define link mappings based on component type and newIndex
      const linkMappings = {
        1: {
          principle: componentRef.current.wbc_links,
          default: componentRef.current.diff_code,
        },
        2: {
          principle: componentRef.current.ce1_links,
          default: componentRef.current.e1_codes,
        },
        3: {
          principle: componentRef.current.ce2_links,
          default: componentRef.current.e2_codes,
        },
      };
  
      // Set the appropriate links based on the new index and type
      const links = linkMappings[newIndex]?.[componentRef.current.type === 'Principle' ? 'principle' : 'default'];
      setCurrentLinks(links);
  
      // Update state
      return updateState(prevState, newIndex);
    });
  };
  
  // Helper function to update the state and activeButtonRef
  const updateState = (prevState, newIndex) => {
    const updatedState = {
      ...prevState,
      [componentRef.current.code]: newIndex,
    };
    activeButtonRef.current = updatedState;
    return updatedState;
  };
  
  const messageStateChange = (state) => {
    setShowMessage(state);
    showMessageRef.current = state;
  };

  const toggleBookmark = () => {
    setSavedComponents((prevSavedComponents) => {
      // Check if the component already exists in the saved components list
      const exists = prevSavedComponents.some(item => item.code === component.code);
  
      if (exists) {
        // Remove the component from saved components
        return prevSavedComponents.filter(item => item.code !== component.code);
      }
      
      // Add the entire component object instead of just the code
      return [...prevSavedComponents, { ...component }];
    });
  
    setComponent((prevComponent) => ({
      ...prevComponent,
      bookmark: !prevComponent.bookmark,
    }));
  };

  return (
    <>
      <div className={`${showMessage ? "blur-background" : ""}`}>
        <div className={`l2-background ${isExplanationPage ? '' : 'gradient'}`}>
          <Compass
            mode="learn-2"
            position={isExplanationPage ? "center" : "left-3"}
            currentLinks={currentLinks}
            onButtonClick={handleCompassClick}
            resetState={resetState}
          />
          {isExplanationPage && 
            <Description colors={colors} mode={'learn'} />
          }

          {!isExplanationPage && (
            <>
              <CompassIcon 
                mode={"learn-2"}
                currentType={component.type} 
              />

              <Message
                mode={'learn'}
                type={'button'}
                messageStateChange={messageStateChange}  
              />

              <div className='l2-title-bookmark-container'>
                <span className='l2-title'>{component.title}</span>
                <div className="l2-white-line"></div>
                <button
                  onClick={toggleBookmark}
                  className={`l2-bookmark-button ${component.bookmark ? 'active' : ''}`}
                >
                  <BookmarkIcon className="l2-bookmark-icon" />
                </button>
              </div>
              
              <div className='l2-text-buttons-container'>
                {[0, 1, 2].map((index) => (
                  <button 
                    key={index} // Add a unique key for each button
                    className='l2-button'
                    onClick={() => handleButtonClick(index)} 
                  >
                    <div>
                      <Arrow2Icon className={`l2-arrow-icon ${activeButton[component.code] === index || (index === 2 && activeButton[component.code] === 3) ? "active" : ""}`} />
                    </div>
                    {getButtonsText(index)}
                  </button>
                ))}
                
                {activeButton[component.code] > 1 && (
                  <div className="l2-example-arrow-container">
                    <button
                      className={`l2-example-arrow left ${activeButton[component.code] === 2 ? "disabled" : ""}`}
                      onClick={() => handleButtonClick(2)}
                    >
                      <Arrow2Icon className='l2-example-arrow-icon' />
                    </button>
                    <span className='l2-example-number bold'>{activeButton[component.code] - 1}</span>
                    <span className='l2-example-number'> / 2</span>
                    <button
                      className={`l2-example-arrow right ${activeButton[component.code] === 3 ? "disabled" : ""}`}
                      onClick={() => handleButtonClick(3)}
                    >
                      <Arrow2Icon className='l2-example-arrow-icon' />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <Menu />
        </div>
      </div>

      {!isExplanationPage && (
        <Message
          mode={'learn'}
          type={'message'}
          showMessage={showMessage}
          messageStateChange={messageStateChange}  
        />
      )}
    </>
  );
};

export default Learn2Page;
