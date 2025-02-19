import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
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

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][component.type]);
  document.documentElement.style.setProperty('--image-color', colors['Wave'][component.type]);

  const resetState = useCallback(() => {
    setComponent(initialComponent);
    componentRef.current = initialComponent;
    setFirstClick(true);
    setShowMessage(false);
    showMessageRef.current = false;
    setIsExplanationPage(true);
    setSlideIndex(0);
    slideIndexRef.current = 0;
  }, [initialComponent, setIsExplanationPage]);

  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.includes(code);
  }, [savedComponents]);

  const handleCompassClick = (data) => {
    if (firstClick && firstMessage["learn"]) {
      setFirstClick(false);
      setShowMessage(true);
      showMessageRef.current = true;
    }

    if (data === null) {
      setComponent(initialComponent);
      componentRef.current = initialComponent;
      setIsExplanationPage(true);
      return;
    }

    const {
      code,
      title,
      paragraph,
      type,
      phy = null,
      geo = null,
      che = null,
      bio = null,
      phy_links = null,
      geo_links = null,
      che_links = null,
      bio_links = null,
      compared_paragraph = null,
      example_1 = null,
      example_2 = null,
      compared_code = null,
      example_1_codes = null,
      example_2_codes = null
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
        slideMax: type === 'Principle' ? 4 : 3,
        bookmark: getBookmarkState(code),
        ...(type === 'Principle'
          ? { phy, geo, che, bio, phy_links, geo_links, che_links, bio_links }
          : { compared_paragraph, example_1, example_2, compared_code, example_1_codes, example_2_codes }),
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
        currentParagraph = componentRef.current.geo;
        currentTerm = 'Ocean Geology';
        currentLinks = componentRef.current.geo_links;
      } else if(index === 2) {
        currentParagraph = componentRef.current.phy;
        currentTerm = 'Ocean Physics';
        currentLinks = componentRef.current.phy_links;
      } else if(index === 3) {
        currentParagraph = componentRef.current.che;
        currentTerm = 'Ocean Chemistry';
        currentLinks = componentRef.current.che_links;
      } else if(index === 4) {
        currentParagraph = componentRef.current.bio;
        currentTerm = 'Ocean Biology';
        currentLinks = componentRef.current.bio_links;
      }
    } else {
      if(index === 0) {
        currentParagraph = componentRef.current.paragraph;
      } else if(index === 1) {
        currentParagraph = componentRef.current.compared_paragraph;
        currentTerm = '/';
        currentLinks = componentRef.current.compared_code;
      } else if(index === 2) {
        currentParagraph = componentRef.current.example_1;
        currentTerm = 'Example 1';
        currentLinks = componentRef.current.example_1_codes;
      } else if(index === 3) {
        currentParagraph = componentRef.current.example_2;
        currentTerm = 'Example 2';
        currentLinks = componentRef.current.example_2_codes;
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
      if (prevSavedComponents.includes(component.code)) {
        return prevSavedComponents.filter((item) => item !== component.code);
      }
      return [...prevSavedComponents, component.code];
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
              
              <div className="l2-text-container">
                <p className='l2-text'>{component.currentParagraph}</p>
              </div>

              <p className='l2-terms'>{component.currentTerm}</p>
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
