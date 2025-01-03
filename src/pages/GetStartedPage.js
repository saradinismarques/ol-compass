import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import '../styles/pages/GetStartedPage.css';
import OLCompass from '../components/OLCompass';
import Compass from '../components/Compass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";

const GetStartedPage = () => {
  const {
    colors,
    isExplanationPage,
    setIsExplanationPage,
    allComponents,
  } = useContext(StateContext);

  // Memoize the initialState object
  const initialComponent = useMemo(() => ({
      code: '',
      title: '',
      headline: '',
      paragraph: '',
      type: null,
    }), []);

  const [currentComponent, setCurrentComponent] = useState(initialComponent);
  const [afterSearch, setAfterSearch] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('get-started');
  const [components, setComponents] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const componentsRef = useRef(components);
  const currentIndexRef = useRef(currentIndex);
  const modeRef = useRef(mode);

  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--selection-hover-color', colors['Selection Hover']);
  document.documentElement.style.setProperty('--text-color', colors['Text'][currentComponent.type]);

  const resetState = useCallback(() => {
    setCurrentComponent(initialComponent);
    setAfterSearch(false);
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setMode('get-started');
    modeRef.current = 'get-started';
    setComponents([]);
    componentsRef.current = [];
    setSelectedType(null);
    setIsExplanationPage(true);
  }, [initialComponent, setIsExplanationPage]);

  const handleCompassClick = (code, title, headline, type) => {    
    setSelectedType(type);

    setComponents((prevComponents) => {
      const componentExists = prevComponents.some((component) => component.code === code);

      const updatedComponents = componentExists
        ? prevComponents.filter((component) => component.code !== code)
        : [
            ...prevComponents,
            {
              code,
              title,
              headline,
              type,
            },
          ];

      const sortedComponents = updatedComponents.sort((a, b) => {
        const indexA = allComponents.indexOf(a.code);
        const indexB = allComponents.indexOf(b.code);

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      });

      componentsRef.current = sortedComponents;
      return sortedComponents;
    });

    setIsExplanationPage(false);
    setMode('get-started');
    modeRef.current = 'get-started';
  };

  const handleSearch = useCallback(() => {
    if (componentsRef.current.length === 0) return;

    const currentIndex = 0;
    setCurrentIndex(currentIndex);
    currentIndexRef.current = currentIndex;

    setCurrentComponent((prevCurrentComponent) => {
      const firstComponent = componentsRef.current[currentIndex];
      setSelectedType(firstComponent.type);

      document.documentElement.style.setProperty('--text-color', colors['Text'][firstComponent.type]);
      document.documentElement.style.setProperty('--wave-color', colors['Wave'][firstComponent.type]);

      return firstComponent
        ? {
            ...prevCurrentComponent,
            code: firstComponent.code,
            title: firstComponent.title,
            headline: firstComponent.headline,
            type: firstComponent.type,
          }
        : prevCurrentComponent;
    });

    setMode('get-started-search');
    modeRef.current = 'get-started-search';

    setIsExplanationPage(false);
    setAfterSearch(true);
  }, [setIsExplanationPage, colors]);

  const handleNext = useCallback(() => {
    if (currentIndexRef.current < componentsRef.current.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;

      setCurrentComponent((prevCurrentComponent) => {
        const nextComponent = componentsRef.current[nextIndex];
        setSelectedType(nextComponent.type);
        
        document.documentElement.style.setProperty('--text-color', colors['Text'][nextComponent.type]);
        document.documentElement.style.setProperty('--wave-color', colors['Wave'][nextComponent.type]);

        return nextComponent
          ? {
              ...prevCurrentComponent,
              code: nextComponent.code,
              title: nextComponent.title,
              headline: nextComponent.headline,
              type: nextComponent.type,
            }
          : prevCurrentComponent;
      });
    }
  }, [colors]);

  const handlePrev = useCallback(() => {
    if (currentIndexRef.current > 0) {
      const prevIndex = currentIndexRef.current - 1;
      setCurrentIndex(prevIndex);
      currentIndexRef.current = prevIndex;

      setCurrentComponent((prevCurrentComponent) => {
        const prevComponent = componentsRef.current[prevIndex];
        setSelectedType(prevComponent.type);
        
        document.documentElement.style.setProperty('--text-color', colors['Text'][prevComponent.type]);
        document.documentElement.style.setProperty('--wave-color', colors['Wave'][prevComponent.type]);

        return prevComponent
          ? {
              ...prevCurrentComponent,
              code: prevComponent.code,
              title: prevComponent.title,
              headline: prevComponent.headline,
              type: prevComponent.type,
            }
          : prevCurrentComponent;
      });
    }
  }, [colors]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') handleSearch();
      else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') handlePrev();
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') handleNext();
    },
    [handleSearch, handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const formatWithLineBreaks = (text) => {
    // Split the text by <br> tags
    const parts = text.split('<br>').map(part => part.trim());

    return (
        <>
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part}
                    {index < parts.length - 1 && <br />}
                </React.Fragment>
            ))}
        </>
    );
  };

  return (
    <>
      <div className={`gs-background ${afterSearch ? 'gradient' : ''}`}>
        <Compass
          mode={mode}
          position={afterSearch ? 'left' : 'center'}
          resetState={resetState}
          onButtonClick={handleCompassClick}
          current={currentComponent.code}
        />
        {isExplanationPage && <Description mode={'get-started'} />}

        {!isExplanationPage && (
          <>
            <CompassIcon 
              mode={mode}
              type={selectedType} 
            />

            {afterSearch && (
              <>
                <div className="gs-text-container">
                  <div className="gs-white-line"></div>
                  <h1 className="gs-title">{currentComponent.title}</h1>
                  <h2 className='gs-headline'>{formatWithLineBreaks(currentComponent.headline)}</h2>

                  <button className={'gs-arrow-button down'} onClick={handleNext}>
                    <ArrowIcon className="gs-arrow-icon" />
                  </button>
                </div>
              </>
            )}

            <div className={`gs-search-container ${afterSearch ? 'left' : ''}`}>
              <div className="gs-search-outline">
                <button className="gs-search-button" onClick={handleSearch}>
                  SEARCH
                </button>
              </div>
            </div>
          </>
        )}
        <Menu />
      </div>
    </>
  );
};

export default GetStartedPage;
