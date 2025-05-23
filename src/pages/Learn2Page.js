import React, { useState, useCallback, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import P1Image from '../assets/images/learn-2/P1.png';
import P2Image from '../assets/images/learn-2/P2.png';
import P3Image from '../assets/images/learn-2/P3.png';
import P4Image from '../assets/images/learn-2/P4.png';
import P5Image from '../assets/images/learn-2/P5.png';
import P6Image from '../assets/images/learn-2/P6.png';
import P7Image from '../assets/images/learn-2/P7.png';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
import { replaceBoldsHighlights, replaceBolds, replaceHighlightsPlaceholders } from '../utils/TextFormatting.js';
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import { getModeTexts, getLabelsTexts } from '../utils/DataExtraction.js';
import '../styles/pages/Learn2Page.css';

const Learn2Page = () => {
  const {
    colors,
    language,
    showExplanation,
    setFirstUse,
    showInstruction,
    setShowInstruction,
    learnComponent,
    setLearnComponent,
    savedComponents,
    setSavedComponents,
    iconsMap,
  } = useContext(StateContext);

  const labelsTexts = getLabelsTexts(language, "learn");
  const instruction = getModeTexts("learn", language).Instruction;
  
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

  const imageSrc =
    learnComponent === null
      ? null
      : learnComponent.code === 'P1'
      ? P1Image
      : learnComponent.code === 'P2'
      ? P2Image
      : learnComponent.code === 'P3'
      ? P3Image
      : learnComponent.code === 'P4'
      ? P4Image
      : learnComponent.code === 'P5'
      ? P5Image
      : learnComponent.code === 'P6'
      ? P6Image
      : learnComponent.code === 'P7'
      ? P7Image
      : null;

  const resetState = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.some(item => item.code === code);
  }, [savedComponents]);

  const handleCompassClick = (data) => {
    if (data === null) 
      return;

    const {
      code,
      title,
      paragraph,
      paragraph_extended,
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
          ? { paragraph_extended, wbc_links, region_feature, country_e1, ce1_links, country_e2, ce2_links }
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
    setFirstUse(prevState => ({
      ...prevState, // Keep all existing attributes
      learn: false   // Update only 'home'
    })); 
    setShowInstruction(false);
  };

  const getButtonsTextPrinciples = (buttonIndex) => {
    // Define button text mappings
    const buttonTexts = {
      0: {
        0: {
          paragraph: replaceBoldsHighlights(
            componentRef.current.paragraph,
            'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
          ),
          paragraph_extended: replaceBoldsHighlights(
            componentRef.current.paragraph_extended,
            'l2-text extended', 'l2-text bold', 'l2-text italic', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
          ), // Assuming this is the extended paragraph you want to return
        },
        1: replaceBolds(
            labelsTexts["question-1-principles"], 
            null, 'l2-question', 'l2-question bold'),
        2: replaceBolds(
          labelsTexts["question-2-principles"], 
          null, 'l2-question', 'l2-question bold')
      },
      1: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: replaceBoldsHighlights(
          componentRef.current.region_feature,
          'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        2: replaceBolds(
          labelsTexts["question-2-principles"], 
          null, 'l2-question', 'l2-question bold'),
      },
      2: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: replaceBolds(
          labelsTexts["question-1-principles"], 
          null, 'l2-question', 'l2-question bold'),
        2: replaceBoldsHighlights(
          componentRef.current.country_e1,
          'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      3: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: replaceBolds(
          labelsTexts["question-1-principles"], 
          null, 'l2-question', 'l2-question bold'),
        2: replaceBoldsHighlights(
          componentRef.current.country_e2,
          'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: replaceBolds(
          labelsTexts["question-1-principles"], 
          null, 'l2-question', 'l2-question bold'),
        2: replaceBolds(
          labelsTexts["question-2-principles"], 
          null, 'l2-question', 'l2-question bold'),
      },
    };

   // If buttonIndex is 0, return both paragraphs as separate elements
  if (buttonIndex === 0 && activeButtonRef.current === 0) {
    const result = buttonTexts[0]?.[0];
    return (
      <div>
        <div>{result.paragraph}</div>
        <div className='l2-extended-container'>{result.paragraph_extended}</div>
      </div>
    );
  }
  
    return buttonTexts[activeButtonRef.current]?.[buttonIndex] || null;
  };
  
  const getButtonsTextOthers = (buttonIndex) => {
    // Define button text mappings
    const buttonTexts = {
      0: {
        0: replaceBoldsHighlights(
          componentRef.current.paragraph,
          'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text highlightP', 'l2-text highlightPe'
        ),
        1: <span className='l2-question'>
            {labelsTexts["question-1-others"]}
          </span>,
      },
      1: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: replaceBoldsHighlights(
          componentRef.current.example_1,
          'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      2: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: replaceBoldsHighlights(
          componentRef.current.example_2,
          'l2-text', 'l2-text bold', 'l2-text italic', 'l2-text highlightP', 'l2-text highlightPe'
        ),
      },
      null: {
        0: <span className='l2-question'>
            {labelsTexts["question-0"]}
          </span>,
        1: <span className='l2-question'>
            {labelsTexts["question-1-others"]}
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
        {!showExplanation && showInstruction && 
          <>
            <div className='instruction-container'>
              {replaceHighlightsPlaceholders(instruction, 'instruction', 'instruction highlightP', 'instruction highlightPe', 'instruction highlightD', iconsMap)}
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
              <>
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
                      <span className='l2-example-number'>{labelsTexts["example"]}&nbsp;</span>
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
                {activeButton === 1 && 
                  <div className="l2-image-container">
                    <img src={imageSrc} alt={`Background Atlantic Ocean`} className="l2-image" />
                  </div>
                }
              </>
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
                    <span className='l2-example-number'>{labelsTexts["example"]}&nbsp;</span>
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
