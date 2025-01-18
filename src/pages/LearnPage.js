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
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { StateContext } from "../State";
import { replaceBolds, replaceLineBreaks, replaceUnderlines } from '../utils/TextFormatting.js';
import '../styles/pages/LearnPage.css';

const LearnPage = () => {
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

  const handleNext = () => {
    if (concept.index < component.concepts.length - 1) {
      const nextIndex = concept.index + 1;
      setConcept({
        code: component.concepts[nextIndex].code,
        label: component.concepts[nextIndex].label,
        paragraph: component.concepts[nextIndex].paragraph,
        linkedTo: component.concepts[nextIndex].linkedTo,
        index: nextIndex,
      });
    }
  };

  const TextWithButtons = ({ text, currentConcept }) => {
    const handleButtonClick = (buttonText) => {
        const matchingIndex = component.concepts.findIndex((concept) =>
            concept.linkedTo.toLowerCase().includes(buttonText.toLowerCase())
        );

        if (matchingIndex !== -1) {
            const matchingConcept = component.concepts[matchingIndex];
            setConcept({
                code: matchingConcept.code,
                label: matchingConcept.label,
                paragraph: matchingConcept.paragraph,
                linkedTo: matchingConcept.linkedTo,
                index: matchingIndex,
            });
        } else {
            setConcept(initialConcept);
        }
    };

    return (
        <div className="l-text principles">
            <p>
                {replaceUnderlines(text, currentConcept, handleButtonClick)}
            </p>
        </div>
    );
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

              <div
                className="l-text-container"
                style={{
                  width:
                    component.code === 'P3' || component.code === 'P7' ? '52vh' : '48vh',
                }}
              >
                <h1 className='l-title'>{component.title}</h1>
                {replaceLineBreaks(component.headline, 'l-headline')}
                {component.type === "Principle" && (
                  <>
                    <TextWithButtons text={component.paragraph} currentConcept={concept} />
                    <div className='l-concepts-container'>
                      <h1 className='l-title-concepts'>{concept.label}</h1>

                      {concept.index < component.concepts.length - 1 && (
                        <button className="l-arrow-button right" onClick={handleNext}>
                          <ArrowIcon className="l-arrow-icon" />
                        </button>
                      )}
                    </div>
                    <div className="l-text-concepts expanded l-scroller">
                      <p>{concept.paragraph}</p>
                    </div>
                  </>
                )}
                {component.type !== "Principle" && 
                  <>
                    {replaceBolds(component.paragraph, 'l-text', null, 'l-text bold')}
                  </>
                }
              </div>
            </>
          )}
          <Menu />
        </div>

        {imageSrc && (
          <div className="l-image-container">
            <div
              className="color-overlay"
              style={{
                position: 'absolute', // Absolutely position the overlay on top of the image
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors['Wave']['Principle'], // Apply the dynamic color (e.g., "#41ffc9")
                mixBlendMode: 'color', // Use blend mode to tint the image
                pointerEvents: 'none', // Disable interaction with the overlay
                zIndex: 5, // Ensure the overlay is on top
              }}
            />
            <img src={imageSrc} alt={`Background ${component.code}`} className="l-principles-image" />
          </div>
        )}
        {imageSrc === null && (
          <div className="l-image-container">
            <img src={imageSrc} alt={`Background ${component.code}`} className="l-other-components-image" />
          </div>
        )}
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

export default LearnPage;
