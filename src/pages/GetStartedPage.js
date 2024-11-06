import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/GetStartedPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import P1Image from '../images/P1.png';
import P2Image from '../images/P2.png';
import P3Image from '../images/P3.png';
import P4Image from '../images/P4.png';
import P5Image from '../images/P5.png';
import P6Image from '../images/P6.png';
import P7Image from '../images/P7.png';
import { ReactComponent as WaveIcon } from '../assets/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as QuestionIcon } from '../assets/question-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/bookmark-icon.svg'; // Adjust the path as necessary

const colors = {
  Principle: "#41ffc9",
  Perspective: "#41e092",
  Dimension: "#41c4e0"
};

const LearnPage = ({ savedComponents, setSavedComponents, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '',
    headline: '',
    paragraph: '',
    concepts: [],
    type: null,
    firstClick: true,
    showMessage: false,
    gradientColor: null,
    textColor: null,
    bookmark: false,
  }), []);

  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
  }, [initialState, setIsExplanationPage]);

  // Wrap getBookmarkState in useCallback
  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.includes(code);
  }, [savedComponents]);

  const handleCompassClick = (code, title, headline, paragraph,type, concepts) => {
    if(state.firstClick && firstMessage) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true
      }));
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
      gradientColor: colors[type],
      textColor: tColor,
      bookmark: getBookmarkState(code),
    }));

    setIsExplanationPage(false);
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
    setState((prevState) => ({
      ...prevState,
      showMessage: true,
    }));
  };

  const removeMessage = () => {
    setState((prevState) => ({
      ...prevState,
      showMessage: false,
    }));

    if(firstMessage) {
      setFirstMessage((prevState) => ({
        ...prevState,
        learn: false,
      }));
    }
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

    <div className={`container ${state.showMessage ? "blur-background" : ""}`}>
      <div className='l-gradient-background'
        style={{
          background: isExplanationPage
            ? 'none'
            : `linear-gradient(to right, transparent 25%, ${state.gradientColor} 100%)`,
        }}
      >
        <OLCompass 
          action="learn" 
          position={isExplanationPage ? "center" : "left"}
          onButtonClick={handleCompassClick} 
          resetState={resetState}  // Passing resetState to OLCompass
          savedComponents={savedComponents}
        />  
        {isExplanationPage && (
            <>
            <div className="text-container" >
                <p className='question'>
                  What's it for?
                </p>
                <p className='headline'>
                  Explore the OL fundamentals, one by one
                  </p>
                <div className='text'>
                  Are you new to Ocean Literacy, or need a refresher?
                  <br></br>
                  In the LEARN mode the Compass lets you familiarize with each OL Principle, Perspective and Dimension, with basic definitions, additional information and hints for reflection.
                  <p className='instruction'>
                  Start by clicking on any wave (
                  <WaveIcon 
                    className="text-icon" // Apply your CSS class
                  />
                  ).
                  </p>
                </div>
              </div>
            </>
          )}

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
              maxWidth: state.code === 'P7' ? '373px': 
                        state.code === 'P3'? '364.5px': 
                        state.code === 'P1' ? '362px' : '365px'}}>
                <h1 className='l-title'>{state.title}</h1>
                <h2 className='l-headline' dangerouslySetInnerHTML={{ __html: state.headline }}></h2>
                <div className="l-text" style={{ color: state.textColor }}>
                  <p dangerouslySetInnerHTML={{ __html: state.paragraph }}></p>
                </div>
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
    
    {!isExplanationPage && state.showMessage && (
      <>
      <div className="message-box" style={{ width: 200 }}>
        <div className="question-circle">
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
