import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import P1Image from '../assets/images/learn/P1.png';
import P2Image from '../assets/images/learn/P2.png';
import P3Image from '../assets/images/learn/P3.png';
import P4Image from '../assets/images/learn/P4.png';
import P5Image from '../assets/images/learn/P5.png';
import P6Image from '../assets/images/learn/P6.png';
import P7Image from '../assets/images/learn/P7.png';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
import { replaceBolds, replaceLineBreaks, replaceUnderlines } from '../utils/TextFormatting.js';
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

  const [component, setComponent] = useState(initialComponent);
  const [concept, setConcept] = useState(initialConcept);
  const [firstClick, setFirstClick] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const showMessageRef = useRef(showMessage);

  useEffect(() => {
    showMessageRef.current = showMessage;
  }, [showMessage]);

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][component.type]);
  document.documentElement.style.setProperty('--image-color', colors['Wave'][component.type]);

  const imageSrc =
    component.code === 'P1'
      ? P1Image
      : component.code === 'P2'
      ? P2Image
      : component.code === 'P3'
      ? P3Image
      : component.code === 'P4'
      ? P4Image
      : component.code === 'P5'
      ? P5Image
      : component.code === 'P6'
      ? P6Image
      : component.code === 'P7'
      ? P7Image
      : null;

  const resetState = useCallback(() => {
    setComponent(initialComponent);
    setConcept(initialConcept);
    setFirstClick(true);
    setShowMessage(false);
    showMessageRef.current = false;
    setIsExplanationPage(true);
  }, [initialComponent, initialConcept, setIsExplanationPage]);

  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.includes(code);
  }, [savedComponents]);

  const handleCompassClick = (code, title, headline, paragraph, type, concepts) => {
    if (firstClick && firstMessage["learn"]) {
      setFirstClick(false);
      setShowMessage(true);
      showMessageRef.current = true;
    }

    if (code === null) {
      setComponent(initialComponent);
      setIsExplanationPage(true);
      return;
    }
    setComponent((prevComponent) => ({
      ...prevComponent,
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

    if (concepts !== null) {
      setConcept({
        code: concepts[0].code,
        label: concepts[0].label,
        paragraph: concepts[0].paragraph,
        linkedTo: concepts[0].linkedTo,
        index: 0,
      });
    }
  };

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
        <div className={`l-background ${isExplanationPage ? '' : 'gradient'}`}>
          <OLCompass
            mode="learn"
            position={isExplanationPage ? "center" : "left"}
            onButtonClick={handleCompassClick}
            resetState={resetState}
          />
          {isExplanationPage && 
            <Description colors={colors} mode={'learn'} />
          }

          {!isExplanationPage && (
            <>
              <Message
                mode={'learn'}
                type={'button'}
                messageStateChange={messageStateChange}  
              />

              <div className='l-bookmark-container'>
                <div className="l-white-line"></div>
                <button
                  onClick={toggleBookmark}
                  className={`l-bookmark-button ${component.bookmark ? 'active' : ''}`}
                >
                  <BookmarkIcon className="l-bookmark-icon" />
                </button>
              </div>

              <div className="l-text-container">
                <h1 className='l-title'>{component.title}</h1>
                {replaceLineBreaks(component.headline, 'l-headline')}
                {replaceBolds(component.paragraph, 'l-text', null, 'l-text bold')}
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
