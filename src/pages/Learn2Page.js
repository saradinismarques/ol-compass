import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
import { replaceStyledText } from '../utils/TextFormatting.js';
import '../styles/pages/Learn2Page.css';

const Learn2Page = () => {
  const {
    colors,
    firstMessage,
    isExplanationPage,
    setIsExplanationPage,
    savedComponents,
    setSavedComponents,
  } = useContext(StateContext);

  const initialComponent = useMemo(() => ({
    title: '',
    paragraph: '',
    currentTerm: null,
    currentLinks: null,
    type: null,
    bookmark: false,
  }), []);

  const [component, setComponent] = useState(initialComponent);
  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate function
  
  const componentRef = useRef(component);
  const slideIndexRef = useRef(slideIndex);
  const showMessageRef = useRef(showMessage);

  useEffect(() => {
      componentRef.current = component;
  }, [component]);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
}, [slideIndex]);


  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--component-bookmark-color', colors['CBookmark']);
  document.documentElement.style.setProperty('--component-bookmark-hover-color', colors['CBookmark Hover']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][component.type]);
  document.documentElement.style.setProperty('--image-color', colors['Wave'][component.type]);
  document.documentElement.style.setProperty('--highlightP-color', colors['Wave']['Principle']);
  document.documentElement.style.setProperty('--highlightPe-color', colors['Wave']['Perspective']);

  const resetState = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.some(item => item.code === code);
  }, [savedComponents]);

  const handleCompassClick = (data) => {
    if (firstClick && firstMessage["learn"]) {
      setFirstClick(false);
      setShowMessage(true);
      showMessageRef.current = true;
    }

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
        currentParagraph: paragraph,
        currentTerm: null,
        currentLinks: null,
        slideMax: type === 'Principle' ? 3 : 3,
        bookmark: getBookmarkState(code),
        ...(type === 'Principle'
          ? { wbc_links, region_feature, country_e1, ce1_links, country_e2, ce2_links }
          : { diff_code, diff_paragraph, example_1, example_2, e1_codes, e2_codes }),
      };
  
      // Update the ref
      componentRef.current = updatedComponent;
  
      return updatedComponent;
    });
  
    setSlideIndex(0);
    slideIndexRef.current = 0;

    document.documentElement.style.setProperty('--text-color', colors['Text'][type]);
    document.documentElement.style.setProperty('--wave-color', colors['Wave'][type]);
  
    setIsExplanationPage(false);
  };

  const updateSlide = (index) => {
    let currentParagraph, currentTerm = null, currentLinks = null;

    if(componentRef.current.type === 'Principle') {
      if(index === 0) {
        currentParagraph = componentRef.current.paragraph;
      } else if(index === 1) {
        currentParagraph = componentRef.current.region_feature;
        currentLinks = componentRef.current.wbc_links;
      } else if(index === 2) {
        currentParagraph = componentRef.current.country_e1;
        currentLinks = componentRef.current.ce1_links;
      } else if(index === 3) {
        currentParagraph = componentRef.current.country_e2;
        currentLinks = componentRef.current.ce2_links;
      } 
    } else {
      if(index === 0) {
        currentParagraph = componentRef.current.paragraph;
      } else if(index === 1) {
        currentParagraph = componentRef.current.diff_paragraph;
        currentLinks = componentRef.current.diff_code;
      } else if(index === 2) {
        currentParagraph = componentRef.current.example_1;
        currentLinks = componentRef.current.e1_codes;
      } else if(index === 3) {
        currentParagraph = componentRef.current.example_2;
        currentLinks = componentRef.current.e2_codes;
      }
    }

    setComponent((prevComponent) => ({
      ...prevComponent,
      currentParagraph: currentParagraph,
      currentTerm: currentTerm,
      currentLinks: currentLinks,
    }));
  }

  const handlePrev = useCallback(() => {
    if(slideIndexRef.current > 0) {
      let prevIndex = slideIndexRef.current - 1;
      setSlideIndex(prevIndex);
      slideIndexRef.current = prevIndex;
      updateSlide(prevIndex);
    }  
  }, []);
  
  const handleNext = useCallback(() => {
    if(slideIndexRef.current < componentRef.current.slideMax) {
      let nextIndex = slideIndexRef.current + 1;
      setSlideIndex(nextIndex);
      slideIndexRef.current = nextIndex;
      updateSlide(nextIndex);
    }
  }, []);

  // Keyboard event handler
  // const handleButtonClick = (index) => {
  //   if (index === 0)  {

  //   } else if (index === 1) {} 
  //   else if (index === 2)  
  // };

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') 
      handlePrev();
    else if (e.key === 'ArrowDown') 
      handleNext();
  }, [handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Dependency array includes carouselHandleEnterClick

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

  const getButtonsText = (index) => {
    if(slideIndexRef.current)
      return replaceStyledText(component.currentParagraph, "l2-text-container", 'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe');
      
  };

  return (
    <>
      <div className={`${showMessage ? "blur-background" : ""}`}>
        <div className={`l2-background ${isExplanationPage ? '' : 'gradient'}`}>
          <Compass
            mode="learn-2"
            position={isExplanationPage ? "center" : "left-3"}
            currentLinks={component.currentLinks}
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
              
              {/* <div>
                <button 
                  onClick={() => handleButtonClick(0)} 
                >
                  {getButtonsText(0)}
                </button>
                <button 
                  onClick={() => handleButtonClick(1)} 
                >
                  {getButtonsText(1)}
                </button>
                <button 
                  onClick={() => handleButtonClick(2)} 
                >
                  {getButtonsText(2)}
                </button>
              </div> */}
              {replaceStyledText(component.currentParagraph, "l2-text-container", 'l2-text', 'l2-text bold', 'l2-text underline', 'l2-text highlightP', 'l2-text highlightPe')}
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
