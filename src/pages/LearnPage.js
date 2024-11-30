import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/pages/LearnPage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import P1Image from '../assets/images/P1.png';
import P2Image from '../assets/images/P2.png';
import P3Image from '../assets/images/P3.png';
import P4Image from '../assets/images/P4.png';
import P5Image from '../assets/images/P5.png';
import P6Image from '../assets/images/P6.png';
import P7Image from '../assets/images/P7.png';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';

const LearnPage = ({ colors, savedComponents, setSavedComponents, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
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
  const [messageShown, setMessageShown] = useState(false);

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][state.type]);

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
    setFirstClick(true);
    setMessageShown(false);
  }, [initialState, setIsExplanationPage]);

  const getBookmarkState = useCallback((code) => {
    return savedComponents.length !== 0 && savedComponents.includes(code);
  }, [savedComponents]);

  const handleCompassClick = (code, title, headline, paragraph, type, concepts) => {
    if (firstClick && firstMessage) {
      setFirstClick(false);
      setMessageShown(true);
    }

    if (code === null) {
      setState(initialState);
      setIsExplanationPage(true);
      return;
    }

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

    if (concepts !== null) {
      setConcept({
        code: concepts[0].Code,
        label: concepts[0].Label,
        paragraph: concepts[0].Paragraph,
        linkedTo: concepts[0].LinkedTo,
        index: 0,
      });
    }
  };

  const toggleBookmark = () => {
    setSavedComponents((prevSavedComponents) => {
      if (prevSavedComponents.includes(state.code)) {
        return prevSavedComponents.filter((item) => item !== state.code);
      }
      return [...prevSavedComponents, state.code];
    });

    setState((prevState) => ({
      ...prevState,
      bookmark: !prevState.bookmark,
    }));
  };

  const handleNext = () => {
    if (concept.index < state.concepts.length - 1) {
      const nextIndex = concept.index + 1;

      setConcept({
        code: state.concepts[nextIndex].Code,
        label: state.concepts[nextIndex].Label,
        paragraph: state.concepts[nextIndex].Paragraph,
        linkedTo: state.concepts[nextIndex].LinkedTo,
        index: nextIndex,
      });
    }
  };

  const replaceUnderlinesWithButtons = (text, currentConcept) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text.trim();
    const underlines = tempDiv.querySelectorAll('u');

    underlines.forEach((underline, index) => {
      const button = document.createElement('button');
      button.textContent = underline.textContent;

      if (currentConcept.linkedTo.toLowerCase().includes(button.textContent.toLowerCase())) {
        button.style.fontWeight = 500;
      }

      button.setAttribute('data-index', index);
      underline.replaceWith(button);
    });

    return tempDiv.innerHTML;
  };

  const DynamicText = ({ text, currentConcept }) => {
    useEffect(() => {
      const buttons = document.querySelectorAll('.l-text button');

      const handleButtonClick = (buttonText) => {
        const matchingIndex = state.concepts.findIndex(
          (concept) => concept.LinkedTo.toLowerCase().includes(buttonText.toLowerCase())
        );

        if (matchingIndex !== -1) {
          const matchingConcept = state.concepts[matchingIndex];
          setConcept({
            code: matchingConcept.Code,
            label: matchingConcept.Label,
            paragraph: matchingConcept.Paragraph,
            linkedTo: matchingConcept.LinkedTo,
            index: matchingIndex,
          });
        } else {
          setConcept(initialConcept);
        }
      };

      buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
          handleButtonClick(e.target.textContent);
        });
      });

      return () => {
        buttons.forEach((button) => {
          button.removeEventListener('click', () => {});
        });
      };
    }, [text]);

    return (
      <div className="l-text">
        <p dangerouslySetInnerHTML={{ __html: replaceUnderlinesWithButtons(text, currentConcept) }}></p>
      </div>
    );
  };

  const imageSrc =
    state.code === 'P1'
      ? P1Image
      : state.code === 'P2'
      ? P2Image
      : state.code === 'P3'
      ? P3Image
      : state.code === 'P4'
      ? P4Image
      : state.code === 'P5'
      ? P5Image
      : state.code === 'P6'
      ? P6Image
      : state.code === 'P7'
      ? P7Image
      : null;

  return (
    <>
      <div className={`${messageShown ? "blur-background" : ""}`}>
        <div className={`l-background ${isExplanationPage ? '' : 'gradient'}`}>
          <OLCompass
            colors={colors}
            mode="learn"
            position={isExplanationPage ? "center" : "left"}
            onButtonClick={handleCompassClick}
            resetState={resetState}
            savedComponents={savedComponents}
          />
          {isExplanationPage && <Description colors={colors} mode={'learn'} />}

          {!isExplanationPage && (
            <>
              <Message
                mode={'learn'}
                type={'button'}
                setMessageShown={setMessageShown}
              />

              <div className='l-bookmark-container'>
                <div className="l-white-line"></div>
                <button
                  onClick={toggleBookmark}
                  className={`l-bookmark-button ${state.bookmark ? 'active' : ''}`}
                >
                  <BookmarkIcon className="l-bookmark-icon" />
                </button>
              </div>

              <div
                className="l-text-container"
                style={{
                  width:
                    state.code === 'P3' ? '369px' : state.code === 'P7' ? '369px' : '350px',
                }}
              >
                <h1 className='l-title'>{state.title}</h1>
                <h2 className='l-headline' dangerouslySetInnerHTML={{ __html: state.headline }}></h2>
                {state.type === "Principle" && (
                  <>
                    <DynamicText text={state.paragraph} currentConcept={concept} />
                    <div className='l-concepts-container'>
                      <h1 className='l-title-concepts'>{concept.label}</h1>

                      {concept.index < state.concepts.length - 1 && (
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
                {state.type !== "Principle" && (
                  <div className="l-text">
                    <p dangerouslySetInnerHTML={{ __html: state.paragraph }}></p>
                  </div>
                )}
              </div>
            </>
          )}
          <Menu isExplanationPage={isExplanationPage} />
        </div>

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

      {!isExplanationPage && (
        <Message
          mode={'learn'}
          type={'message'}
          messageShown={messageShown}
          setMessageShown={setMessageShown}
          firstMessage={firstMessage}
          setFirstMessage={setFirstMessage}
        />
      )}
    </>
  );
};

export default LearnPage;
