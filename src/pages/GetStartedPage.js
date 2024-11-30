import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../styles/pages/GetStartedPage.css';
import OLCompass from '../components/OLCompass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import Description from '../components/Description';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary

const GetStartedPage = ({ colors, isExplanationPage, setIsExplanationPage }) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    code: '',
    title: '',
    headline: '',
    paragraph: '',
    type: null,
  }), []);

  const [state, setState] = useState(initialState);
  const [components, setComponents] = useState([]);
  const [afterSearch, setAfterSearch] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState();
  const [mode, setMode] = useState('get-started');

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
  document.documentElement.style.setProperty('--text-color', colors['Text'][state.type]);

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
    setAfterSearch(false);
    setCurrentIndex(0);
    setComponents([]);
    setMode('get-started');
    modeRef.current = 'get-started';

  }, [initialState, setIsExplanationPage]);

  const handleCompassClick = (code, title, headline, type) => {
    setComponents((prevComponents) => {
      // Check if the component with the specified code exists
      const componentExists = prevComponents.some(component => component.code === code);

      // If it exists, remove it; if not, add the new component
      const updatedComponents = componentExists 
        ? prevComponents.filter(component => component.code !== code) 
        : [
          ...prevComponents,
          {
            code,
            title,
            headline,
            type,
          }
        ];
    
      // Sort updatedComponents according to the order in componentsOrdered
      const componentsOrdered = [
        'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7',
        'Pe1', 'Pe2', 'Pe3', 'Pe4', 'Pe5', 'Pe6', 'Pe7',
        'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'
      ];

      const sortedComponents = updatedComponents.sort((a, b) => {
          const indexA = componentsOrdered.indexOf(a.code);
          const indexB = componentsOrdered.indexOf(b.code);
          
          // If the code is not found in componentsOrdered, it goes to the end
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
      });

      componentsRef.current = sortedComponents; // Update the ref as well
      return sortedComponents;
    });

    setIsExplanationPage(false);

    setMode('get-started');
    modeRef.current = 'get-started';
  };

  const handleSearch = useCallback(() => {
    if(componentsRef.current.length === 0)
      return;
    const currentIndex = 0
    setCurrentIndex(currentIndex);
    currentIndexRef.current = currentIndex;

    setState((prevState) => {
        const firstComponent = componentsRef.current[currentIndex];
        document.documentElement.style.setProperty('--text-color', colors['Text'][firstComponent.type]);
        document.documentElement.style.setProperty('--wave-color', colors['Wave'][firstComponent.type]);
        
        return firstComponent
          ? {
              ...prevState,
              code: firstComponent.code,
              title: firstComponent.title,
              headline: firstComponent.headline,
              type: firstComponent.type,
            }
          : prevState;
    });


    const code = componentsRef.current[currentIndex].code;
    setSelectedComponent(code);

    setMode('get-started-search');
    modeRef.current = 'get-started-search';

    setIsExplanationPage(false);
    setAfterSearch(true);
  }, [setIsExplanationPage, colors]);
  
  const handleNext = useCallback(() => {
    if(currentIndexRef.current < componentsRef.current.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
      
      setState((prevState) => {
        const nextComponent = componentsRef.current[nextIndex];
        document.documentElement.style.setProperty('--text-color', colors['Text'][nextComponent.type]);
        document.documentElement.style.setProperty('--wave-color', colors['Wave'][nextComponent.type]);
        
        return nextComponent
          ? {
            ...prevState,
            code: nextComponent.code,
            title: nextComponent.title,
            headline: nextComponent.headline,
            type: nextComponent.type,
          }
          : prevState;
      });
      const code = componentsRef.current[nextIndex].code;
      setSelectedComponent(code);
    }; 
  }, [colors]);

  const handlePrev = useCallback(() => {     
      if(currentIndexRef.current > 0) {
        const prevIndex = currentIndexRef.current - 1;
        setCurrentIndex(prevIndex);
        currentIndexRef.current = prevIndex;

        setState((prevState) => {
          const prevComponent = componentsRef.current[prevIndex];
          document.documentElement.style.setProperty('--text-color', colors['Text'][prevComponent.type]);
          document.documentElement.style.setProperty('--wave-color', colors['Wave'][prevComponent.type]);
          
          return prevComponent
              ? {
                    ...prevState,
                    code: prevComponent.code,
                    title: prevComponent.title,
                    headline: prevComponent.headline,
                    type: prevComponent.type,
                }
              : prevState;
        });
        const code = componentsRef.current[prevIndex].code;
        setSelectedComponent(code);
      }
  }, [colors]);

  // Keyboard event handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') 
      handleSearch();
    else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
      handlePrev();
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft')
      handleNext();
}, [handleSearch, handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]); // Dependency array includes carouselHandleEnterClick

  return (
    <div>
      <div className={`gs-background ${afterSearch ? 'gradient' : ''}`}>
        <OLCompass 
          colors={colors}
          mode={mode} 
          position={afterSearch ? "left" : "center"}
          resetState={resetState}  // Passing resetState to OLCompass
          onButtonClick={handleCompassClick} 
          selectedComponents={selectedComponent}
        />  
        {isExplanationPage && 
          <Description colors={colors} mode={'get-started'} />
        }

          {!isExplanationPage && (
            <>
            {afterSearch && (
              <>
              <CompassIcon colors={colors} type ={state.type} />
              <div className="gs-text-container">
                <div className="gs-white-line"></div>
                <h1 className='gs-title'>{state.title}</h1>
                <h2 className='gs-headline' dangerouslySetInnerHTML={{ __html: state.headline }}></h2>

                <button className={'gs-arrow-button down'} onClick={handleNext}>
                  <ArrowIcon 
                    className='gs-arrow-icon'
                />
                </button>
              </div>
              </>
            )}
            
            

            <div className={`gs-search-container ${afterSearch ? 'left' : ''}`}>
              <div className="gs-search-outline">
                <button 
                  className="gs-search-button"
                  onClick={handleSearch}
                >
                  SEARCH
                </button>
              </div>
            </div>
            </>
          )} 
          <Menu isExplanationPage={isExplanationPage}/>
      </div>
    </div>
  );
};

export default GetStartedPage;
