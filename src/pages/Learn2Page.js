import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import OLCompass from '../components/OLCompass';
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
      compared_paragraph = null,
      example_1 = null,
      example_2 = null,
    } = data;

    setComponent((prevComponent) => {
      const updatedComponent = {
        ...prevComponent,
        code,
        title,
        paragraph,
        type,
        slidesMaxIndex: type === 'Principle' ? 4 : 3,
        bookmark: getBookmarkState(code),
        ...(type === 'Principle'
          ? { phy, geo, che, bio }
          : { compared_paragraph, example_1, example_2 }),
      };
  
      // Update the ref
      componentRef.current = updatedComponent;
  
      return updatedComponent;
    });
  
    setSlideIndex(0);
    slideIndexRef.current = 0;

    let lineWidth;
    if(type === 'Principle') lineWidth = '14.1vw';
    else if(type === 'Perspective') lineWidth = '11.7vw';
    else if(type === 'Dimension') lineWidth = '13.4vw';

    document.documentElement.style.setProperty('--text-color', colors['Text'][type]);
    document.documentElement.style.setProperty('--wave-color', colors['Wave'][type]);
    document.documentElement.style.setProperty('--line-width', lineWidth);

    setIsExplanationPage(false);
  };

  const getParagraph = () => {
    if(slideIndexRef.current === 0) return componentRef.current.paragraph;

    if(component.type === 'Principle') {
      if(slideIndexRef.current === 1) return componentRef.current.phy;
      else if(slideIndexRef.current === 2) return componentRef.current.geo;
      else if(slideIndexRef.current === 3) return componentRef.current.che;
      else if(slideIndexRef.current === 4) return componentRef.current.bio;
    } else {
      if(slideIndexRef.current === 1) return componentRef.current.compared_paragraph;
      else if(slideIndexRef.current === 2) return componentRef.current.example_1;
      else if(slideIndexRef.current === 3) return componentRef.current.example_2;
    }
  };

  const getTerms = () => {
    if(component.type !== 'Principle' || slideIndexRef.current === 0) return;

    if(slideIndexRef.current === 1) return 'Ocean Geology';
    else if(slideIndexRef.current === 2) return 'Ocean Physics';
    else if(slideIndexRef.current === 3) return 'Ocean Chemistry';
    else if(slideIndexRef.current === 4) return 'Ocean Biology';
  };

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      if(slideIndexRef.current > 0) {
        let prevIndex = slideIndexRef.current - 1;
        setSlideIndex(prevIndex);
        slideIndexRef.current = prevIndex;
      }
    }
    else if (e.key === 'ArrowDown') {
      if(slideIndexRef.current < componentRef.current.slidesMaxIndex) {
        let nextIndex = slideIndexRef.current + 1;
        setSlideIndex(nextIndex);
        slideIndexRef.current = nextIndex;
      }
    }
  }, []);

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
          <OLCompass
            mode="learn-2"
            position={isExplanationPage ? "center" : "left-3"}
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
                <p className='l2-text'>{getParagraph()}</p>
              </div>

              <p className='l2-terms'>{getTerms()}</p>
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
