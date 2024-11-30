import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/pages/LearnPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import P1Image from '../assets/images/P1.png';
import P2Image from '../assets/images/P2.png';
import P3Image from '../assets/images/P3.png';
import P4Image from '../assets/images/P4.png';
import P5Image from '../assets/images/P5.png';
import P6Image from '../assets/images/P6.png';
import P7Image from '../assets/images/P7.png';
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as QuestionIcon } from '../assets/icons/question-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary

const LearnPage = ({ colors, savedComponents, setSavedComponents, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '',
    headline: '',
    paragraph: '',
    concepts: [],
    type: null,
    bookmark: false,
  }), []);

  const initialConcept = useMemo(() => ({
    code: '',
    label: '',
    paragraph: '',
    linkedTo: '',
    index: null,
  }), []);

  const [state, setState] = useState(initialState);
  const [concept, setConcept] = useState(initialConcept);
  const [firstClick, setFirstClick] = useState(true);
  const [message, setMessage] = useState(false);
  
  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][state.type]);
  
  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);

    setFirstClick(true);
    setMessage(false);
  }, [initialState, setIsExplanationPage]);

  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.includes(code);
  }, [savedComponents]);

  const handleCompassClick = (code, title, headline, paragraph, type, concepts) => {
    if(firstClick && firstMessage) {
      setFirstClick(false);
      setMessage(true);
    }

    if(code === null) {
      setState(initialState);
      setIsExplanationPage(true);
      return;
    }
    let tColor;
    if(type === 'Principle')
      tColor = "#218065"
    else if(type === 'Perspective')
      tColor = "#1c633e"
    else if(type === 'Dimension')
      tColor = "#216270"
    
    setState((prevState) => ({
      ...prevState,
      code,
      title,
      headline,
      paragraph,
      concepts,
      type,
      bookmark: getBookmarkState(code),
    }));

    document.documentElement.style.setProperty('--text-color', colors['Text'][type]);
    document.documentElement.style.setProperty('--wave-color', colors['Wave'][type]);

    setIsExplanationPage(false);

    if(concepts !== null) {
      setConcept((prevState) => ({
        ...prevState,
        code: concepts[0].Code,
        label: concepts[0].Label,
        paragraph: concepts[0].Paragraph,
        linkedTo: concepts[0].LinkedTo,
        index: 0,
      }));
    }
  };

  const toggleBookmark = () => {
    setSavedComponents((prevSavedComponents) => {
      // If the current title is already in the array, remove it
      if (prevSavedComponents.includes(state.code)) {
        return prevSavedComponents.filter(item => item !== state.code);
      }
      // Otherwise, add it to the array
      return [...prevSavedComponents, state.code];
    });

    setState({
      ...state,
      bookmark: !state.bookmark,
    });
  };

  const showMessage = () => {
    setMessage(true)
  };

  const removeMessage = () => {
    setMessage(false);

    if(firstMessage) {
      setFirstMessage((prevState) => ({
        ...prevState,
        learn: false,
      }));
    }
  };

  const handleNext = () => {
    if (concept.index < state.concepts.length - 1) {
      const nextIndex = concept.index + 1;
      
      setConcept((prevState) => ({
        ...prevState,
        code: state.concepts[nextIndex].Code,
        label: state.concepts[nextIndex].Label,
        paragraph: state.concepts[nextIndex].Paragraph,
        linkedTo: state.concepts[nextIndex].LinkedTo,
        index: nextIndex,
      }));
    }
  };

  const replaceUnderlinesWithButtons = (text, currentConcept) => {
    // Create a temporary container element to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text.trim(); // Trim any unwanted white space
  
    // Find all <u> elements inside the text
    const underlines = tempDiv.querySelectorAll('u');

    // Replace each <u> with a <button>
    underlines.forEach((underline, index) => {
      const button = document.createElement('button');

      button.textContent = underline.textContent;
    
      // Make the button bold if it matches the current concept
      if (currentConcept.linkedTo.toLowerCase().includes(button.textContent.toLowerCase())) {
        button.style.fontWeight = 500; // Apply bold style
      }

      // Add a data attribute for identifying buttons later
      button.setAttribute('data-index', index);
        // Replace the <u> tag with the <button>
        underline.replaceWith(button);
      });

    // Return the modified HTML as a string
    return tempDiv.innerHTML;
  };

  const DynamicText = ({ text, currentConcept }) => {
    // Use `useEffect` to add event listeners after the component is mounted
    
    useEffect(() => {
      // Find all buttons added by `replaceUnderlinesWithButtons`
      const buttons = document.querySelectorAll('.l-text button');
  
      const handleButtonClick = (buttonText) => {

        const matchingIndex = state.concepts.findIndex(concept => concept.LinkedTo.toLowerCase().includes(buttonText.toLowerCase()));
        // Check if a matching concept was found
        if (matchingIndex !== -1) {
          const matchingConcept = state.concepts[matchingIndex];
          setConcept({
            code: matchingConcept.Code,
            label: matchingConcept.Label,
            paragraph: matchingConcept.Paragraph,
            linkedTo: matchingConcept.LinkedTo,
            index: matchingIndex, // Set the index of the found concept
          });
        } else {
          setConcept(initialConcept); // Reset to initial concept if no match found
        }
      };

      // Attach click event to each button
      buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const buttonText = e.target.textContent;
          handleButtonClick(buttonText);
        });
      });

  
      // Cleanup event listeners on component unmount (good practice)
      return () => {
        buttons.forEach((button) => {
          button.removeEventListener('click', () => {});
        });
      };
    }, [text]); // Run this effect when `text` changes
    return (
      <div className="l-text">
        <p dangerouslySetInnerHTML={{ __html: replaceUnderlinesWithButtons(text, currentConcept) }}></p>
      </div>
    );
  };
  
  // Dynamically choose image source based on state.code
  const imageSrc = state.code === 'P1' ? P1Image 
                : state.code === 'P2' ? P2Image 
                : state.code === 'P3' ? P3Image 
                : state.code === 'P4' ? P4Image 
                : state.code === 'P5' ? P5Image 
                : state.code === 'P6' ? P6Image 
                : state.code === 'P7' ? P7Image 
                : null;

  return (
    <div>

    <div className={`${message ? "blur-background" : ""}`}>
      <div className={`l-background ${isExplanationPage ? '' : 'gradient'}`}>
    
        <OLCompass 
          colors={colors}
          mode="learn" 
          position={isExplanationPage ? "center" : "left"}
          onButtonClick={handleCompassClick} 
          resetState={resetState}  // Passing resetState to OLCompass
          savedComponents={savedComponents}
        />  
        {isExplanationPage && 
          <Description colors={colors} mode={'learn'}/>
        }

          {!isExplanationPage && (
            <>
            <button onClick={showMessage} className="question-button">
              <QuestionIcon 
                className="question-icon" // Apply your CSS class
              />
            </button>

            <div className='l-bookmark-container'>
              <div className="l-white-line"></div>
              <button onClick={toggleBookmark} className={`l-bookmark-button ${state.bookmark ? 'active' : ''}`}>
                <BookmarkIcon 
                  className="l-bookmark-icon" // Apply your CSS class
                />
              </button>
            </div>

            <div className="l-text-container" style={{
              width:  state.code === 'P3'? '369px': 
                      state.code === 'P7' ? '369px' : '350px'}}>
              <h1 className='l-title'>{state.title}</h1>
              <h2 className='l-headline' dangerouslySetInnerHTML={{ __html: state.headline }}></h2>
              {state.type === "Principle" && (
                <>
                <DynamicText text={state.paragraph} currentConcept={concept} />
                <div className='l-concepts-container'>
                  <h1 className='l-title-concepts'>{concept.label}</h1>
                  
                  {/* Navigation Arrows */}
                  {concept.index < state.concepts.length - 1 && (
                  <button className="l-arrow-button right" onClick={handleNext}>
                    <ArrowIcon 
                      className="l-arrow-icon"  // Apply your CSS class
                    />
                  </button>
                  )}
                </div>
                  <div className="l-text-concepts expanded l-scroller">
                    <p>{concept.paragraph}</p>
                  </div>
                </>
              )}
              {state.type !== "Principle" && (
                <>
                <div className="l-text">
                  <p dangerouslySetInnerHTML={{ __html: state.paragraph }}></p>
                </div>
                </>
              )}
            </div>
            </>
          )} 
          <Menu isExplanationPage={isExplanationPage}/>
      </div>
      {/* Conditionally render the image if an image source is set */}
      {imageSrc && (
        <div className="l-image-container">
          <img src={imageSrc} alt={`Background ${state.code}`} className="l-principles-image" />
        </div>
      )}
      {imageSrc === null && (
        <div className="l-image-container">
          <img src={imageSrc} alt={`Background ${state.code}`} className="l-other-components-image" />
        </div>
      )}
    </div>
    
    {!isExplanationPage && message && (
      <>
      <div className="message-box" style={{ width: 200 }}>
        <div className="message-question">
          <QuestionIcon 
            className="question-icon message" // Apply your CSS class
          />
        </div>
        <p className="message-text">
          For each element, you can browse in-depth information by clicking on the 
          <ArrowIcon
            className='message-icon smaller'
          /> 
          icon (or on the underlined words). Mark relevant content by clicking on the 
          <BookmarkIcon
            className='message-icon smaller'
          /> 
          icon.
        </p>
        <button className="got-it-button" onClick={removeMessage}>
          Ok, got it!
        </button>
      </div>
      </>
    )}
</div>
  );
};

export default LearnPage;
