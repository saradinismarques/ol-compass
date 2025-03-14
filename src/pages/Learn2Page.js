import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
import { replaceBoldsUnderlinesHighlights } from '../utils/TextFormatting.js';
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import '../styles/pages/Learn2Page.css';

const Learn2Page = () => {
  const {
    colors,
    language,
    showExplanation,
    setShowExplanation,
    firstUse,
    setFirstUse,
    showInstruction,
    setShowInstruction,
    learnComponent,
    setLearnComponent,
    savedComponents,
    setSavedComponents,
  } = useContext(StateContext);

  const [currentLinks, setCurrentLinks] = useState(null);
  // Initialize activeButton as an object with all entries set to 0
  const [activeButton, setActiveButton] = useState(0);

  const navigate = useNavigate(); // Initialize the navigate function
  
  const componentRef = useRef(learnComponent);
  const activeButtonRef = useRef(activeButton);

  useEffect(() => {
      componentRef.current = learnComponent;
  }, [learnComponent]);

  useEffect(() => {
    activeButtonRef.current = activeButton;
}, [activeButton]);

  document.documentElement.style.setProperty('--component-bookmark-color', colors['CBookmark']);
  document.documentElement.style.setProperty('--component-bookmark-hover-color', colors['CBookmark Hover']);
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
    setFirstUse(prevState => ({
      ...prevState, // Keep all existing attributes
      learn: false   // Update only 'home'
    }));

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

    setLearnComponent((prevComponent) => {
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
  
    setShowInstruction(false);
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
            {language === 'pt' 
              ? <>Como se aplica ao <span className="l2-question-bold">Oceano Atlântico</span>?</>
              : <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>}
          </span>,
        2: <span className='l2-question'>
            {language === 'pt' 
              ? <>Como se aplica a <span className="l2-question-bold">Portugal</span>?</>
              : <>How does it apply to <span className="l2-question-bold">Portugal</span>?</>}
          </span>,
      },
      1: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: replaceBoldsUnderlinesHighlights(
          componentRef.current.region_feature,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        2: <span className='l2-question'>
            {language === 'pt' 
              ? <>Como se aplica a <span className="l2-question-bold">Portugal</span>?</>
              : <>How does it apply to <span className="l2-question-bold">Portugal</span>?</>}
          </span>,
      },
      2: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: <span className='l2-question'>
            {language === 'pt' 
              ? <>Como se aplica ao <span className="l2-question-bold">Oceano Atlântico</span>?</>
              : <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>}
          </span>,
        2: replaceBoldsUnderlinesHighlights(
          componentRef.current.country_e1,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      3: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: <span className='l2-question'>
            {language === 'pt' 
              ? <>Como se aplica ao <span className="l2-question-bold">Oceano Atlântico</span>?</>
              : <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>}
          </span>,
        2: replaceBoldsUnderlinesHighlights(
          componentRef.current.country_e2,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: <span className='l2-question'>
            {language === 'pt' 
              ? <>Como se aplica ao <span className="l2-question-bold">Oceano Atlântico</span>?</>
              : <>How does it apply to the <span className="l2-question-bold">Atlantic Ocean</span>?</>}
          </span>,
        2: <span className='l2-question'>
            {language === 'pt' 
              ? <>Como se aplica a <span className="l2-question-bold">Portugal</span>?</>
              : <>How does it apply to <span className="l2-question-bold">Portugal</span>?</>}
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
            {language === 'pt' 
              ? 'Como pode ser aplicado na prática?' 
              : 'How can it be applied in practice?'}
          </span>,
      },
      1: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: replaceBoldsUnderlinesHighlights(
          componentRef.current.example_1,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      2: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: replaceBoldsUnderlinesHighlights(
          componentRef.current.example_2,
          'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>
            {language === 'pt' ? 'Em resumo' : 'In short'}
          </span>,
        1: <span className='l2-question'>
            {language === 'pt' 
              ? 'Como pode ser aplicado na prática?' 
              : 'How can it be applied in practice?'}
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
  
  const toggleBookmark = () => {
    setSavedComponents((prevSavedComponents) => {
      // Check if the component already exists in the saved components list
      const exists = prevSavedComponents.some(item => item.code === learnComponent.code);
  
      if (exists) {
        // Remove the component from saved components
        return prevSavedComponents.filter(item => item.code !== learnComponent.code);
      }
      
      // Add the entire component object instead of just the code
      return [...prevSavedComponents, { ...learnComponent }];
    });
  
    setLearnComponent((prevComponent) => ({
      ...prevComponent,
      bookmark: !prevComponent.bookmark,
    }));
  };

  return (
    <>
      <div className={`l2-background ${(showExplanation || showInstruction) ? '' : 'gradient'}`}>
        <Compass
          mode="learn-2"
          position="fixed"
          currentLinks={currentLinks}
          onButtonClick={handleCompassClick}
          resetState={resetState}
          stateSaved={componentRef.current ? componentRef.current.code : null}
        />
        {showExplanation && 
          <Description mode={'learn'} />
        }
        {showInstruction && 
          <>
            <div className='instruction'>
              Click on any wave
            </div>

            <CompassIcon 
              mode={"learn-2"}
              currentType={null} 
            />
          </>
        }

        {!showExplanation && !showInstruction && (
          <>
            <CompassIcon 
              mode={"learn-2"}
              currentType={learnComponent.type} 
            />

            <div className='l2-title-bookmark-container'>
              <span className='l2-title'>{learnComponent.title}</span>
              <div className="l2-white-line"></div>
              <button
                onClick={toggleBookmark}
                className={`l2-bookmark-button ${learnComponent.bookmark ? 'active' : ''}`}
              >
                <BookmarkIcon className="l2-bookmark-icon" />
              </button>
            </div>
            
            {learnComponent.type === 'Principle' &&
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
            {learnComponent.type !== 'Principle' &&
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
    </>
  );
};

export default Learn2Page;
