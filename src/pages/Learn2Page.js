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
  const [activeButton, setActiveButton] = useState(0);

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
          : { example_1, example_2, e1_codes, e2_codes }),
      };
  
      // Update the ref
      componentRef.current = updatedComponent;
  
      return updatedComponent;
    });

    setActiveButton(0);
    activeButtonRef.current = 0;
    setCurrentLinks(null);

    document.documentElement.style.setProperty('--text-color', colors['Text'][type]);
    document.documentElement.style.setProperty('--wave-color', colors['Wave'][type]);
  
    setIsExplanationPage(false);
  };

  const getButtonsTextPrinciples = (buttonIndex) => {
    // Define button text mappings
    const buttonTexts = {
      0: {
        0: replaceBoldsUnderlinesHighlights(
          componentRef.current.paragraph,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        1: <span className='l2-question'>
            <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</> 
          </span>,
        2: <span className='l2-question'>
            <>How does it apply to <span className="l2-question-bold">Portugal</span>?</> 
          </span>,
      },
      1: {
        0: <span className='l2-question'>In short</span>,
        1: replaceBoldsUnderlinesHighlights(
          componentRef.current.region_feature,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        2: <span className='l2-question'>
            <>How does it apply to <span className="l2-question-bold">Portugal</span>?</> 
          </span>,
      },
      2: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
            <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>  
          </span>,
        2: replaceBoldsUnderlinesHighlights(
          componentRef.current.country_e1,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      3: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
            <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</> 
          </span>,
        2: replaceBoldsUnderlinesHighlights(
          componentRef.current.country_e2,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
            <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>  
          </span>,
        2: <span className='l2-question'>
            <>How does it apply to <span className="l2-question-bold">Portugal</span>?</>  
          </span>,
      },
    };
    return buttonTexts[activeButtonRef.current]?.[buttonIndex] || null;
  };  

  
  const getButtonsTextOthers = (buttonIndex) => {
    // Define button text mappings
    const buttonTexts = {
      0: {
        0: replaceBoldsUnderlinesHighlights(
          componentRef.current.paragraph,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        1: <span className='l2-question'>
            How can it be applied in practice?
          </span>,
      },
      1: {
        0: <span className='l2-question'>In short</span>,
        1: replaceBoldsUnderlinesHighlights(
          componentRef.current.example_1,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      2: {
        0: <span className='l2-question'>In short</span>,
        1: replaceBoldsUnderlinesHighlights(
          componentRef.current.example_2,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>In short</span>,
        1: <span className='l2-question'>
            How can it be applied in practice? 
          </span>,
      },
    };
    return buttonTexts[activeButtonRef.current]?.[buttonIndex] || null;
  }; 

  // Keyboard event handler
  const handleButtonClickPrinciple = (index, text) => {
    setActiveButton((prevState) => {
      const currentValue = prevState;
      const newIndex = (currentValue === index  || (text === 'paragraph' && (currentValue === 3 && index === 2))) ? null : index;
  
      // Clear links for 0 or null
      if (newIndex === 0 || newIndex === null) {
        setCurrentLinks(null);
        activeButtonRef.current = newIndex;
        return newIndex;
      }
  
      // Define link mappings based on component type and newIndex
      const linkMappings = {
        1: componentRef.current.wbc_links,
        2: componentRef.current.ce1_links,
        3: componentRef.current.ce2_links,
      };

      // Set the appropriate links based on the new index and type
      const links = linkMappings[newIndex];
      setCurrentLinks(links);
  
      // Update state
      activeButtonRef.current = newIndex;
      return newIndex;
    });
  };

  // Keyboard event handler
  const handleButtonClickOthers = (index, text) => {
    setActiveButton((prevState) => {
      const currentValue = prevState;
      const newIndex = (currentValue === index  || (text === 'paragraph' && (currentValue === 2 && index === 1))) ? null : index;
  
      // Clear links for 0 or null
      if (newIndex === 0 || newIndex === null) {
        setCurrentLinks(null);
        activeButtonRef.current = newIndex;
        return newIndex;
      }
  
      // Define link mappings based on component type and newIndex
      const linkMappings = {
        1: componentRef.current.e1_codes,
        2: componentRef.current.e2_codes,
      };

      // Set the appropriate links based on the new index and type
      const links = linkMappings[newIndex];
      setCurrentLinks(links);
  
      // Update state
      activeButtonRef.current = newIndex;
      return newIndex;
    });
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
              
              {component.type === 'Principle' &&
                <div className='l2-text-buttons-container'>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <button 
                      key={index} // Add a unique key for each button
                      className='l2-button'
                      onClick={() => handleButtonClickPrinciple(index, 'paragraph')} 
                    >
                      <div>
                        <Arrow2Icon className={`l2-arrow-icon ${activeButton === index || (index === 2 && activeButton === 3) ? "active" : ""}`} />
                      </div>
                      {getButtonsTextPrinciples(index)}
                    </button>
                  ))}
                  
                  {activeButton > 1 && (
                    <div className="l2-example-arrow-container">
                      <button
                        className={`l2-example-arrow left ${activeButton === 2 ? "disabled" : ""}`}
                        onClick={() => handleButtonClickPrinciple(2, 'example')}
                      >
                        <Arrow2Icon className='l2-example-arrow-icon' />
                      </button>
                      <span className='l2-example-number bold'>{activeButton - 1}</span>
                      <span className='l2-example-number'> / 2</span>
                      <button
                        className={`l2-example-arrow right ${activeButton === 3 ? "disabled" : ""}`}
                        onClick={() => handleButtonClickPrinciple(3, 'examples')}
                      >
                        <Arrow2Icon className='l2-example-arrow-icon' />
                      </button>
                    </div>
                  )}
                </div>
              }
              {component.type !== 'Principle' &&
                <div className='l2-text-buttons-container'>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <button 
                      key={index} // Add a unique key for each button
                      className='l2-button'
                      onClick={() => handleButtonClickOthers(index, 'paragraph')} 
                    >
                      <div>
                        <Arrow2Icon className={`l2-arrow-icon ${activeButton === index || (index === 2 && activeButton === 3) ? "active" : ""}`} />
                      </div>
                      {getButtonsTextOthers(index)}
                    </button>
                  ))}
                  
                  {activeButton > 0 && (
                    <div className="l2-example-arrow-container">
                      <button
                        className={`l2-example-arrow left ${activeButton === 1 ? "disabled" : ""}`}
                        onClick={() => handleButtonClickOthers(1, 'example')}
                      >
                        <Arrow2Icon className='l2-example-arrow-icon' />
                      </button>
                      <span className='l2-example-number bold'>{activeButton}</span>
                      <span className='l2-example-number'> / 2</span>
                      <button
                        className={`l2-example-arrow right ${activeButton === 2 ? "disabled" : ""}`}
                        onClick={() => handleButtonClickOthers(2, 'examples')}
                      >
                        <Arrow2Icon className='l2-example-arrow-icon' />
                      </button>
                    </div>
                  )}
                </div>
              }
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
