import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../styles/GetStartedPage.css';
import OLCompass from '../components/OLCompass';
import CompassIcon from '../components/CompassIcon';
import Menu from '../components/Menu';
import P1Image from '../images/P1.png';
import P2Image from '../images/P2.png';
import P3Image from '../images/P3.png';
import P4Image from '../images/P4.png';
import P5Image from '../images/P5.png';
import P6Image from '../images/P6.png';
import P7Image from '../images/P7.png';
import { ReactComponent as WaveIcon } from '../assets/wave-icon.svg'; // Adjust the path as necessary

const colors = {
  Principle: "#41ffc9",
  Perspective: "#41e092",
  Dimension: "#41c4e0"
};

const GetStartedPage = ({ savedComponents, setSavedComponents, isExplanationPage, setIsExplanationPage }) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    code: '',
    title: '',
    headline: '',
    paragraph: '',
    type: null,
    gradientColor: null,
    textColor: null,
  }), []);

  const [state, setState] = useState(initialState);
  const [components, setComponents] = useState([]);
  const [afterSearch, setAfterSearch] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedComponent, setSelectedComponent] = useState();
  const [action, setAction] = useState('get-started');

  const componentsRef = useRef(components);
  const currentIndexRef = useRef(currentIndex);
  const actionRef = useRef(action);

  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
    setAfterSearch(false);
    setCurrentIndex(-1);
    setComponents([]);

    setAction('get-started');
    actionRef.current = 'get-started';

  }, [initialState, setIsExplanationPage]);

  const handleCompassClick = (code, title, headline, paragraph, type) => {
    let tColor;
    if(type === 'Principle') tColor = "#218065"
    else if(type === 'Perspective') tColor = "#1c633e"
    else if(type === 'Dimension') tColor = "#216270"

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
            paragraph,
            type,
            gradientColor: colors[type],
            textColor: tColor,
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

    setAction('get-started');
    actionRef.current = 'get-started';
  };

  const handleSearch = useCallback(() => {
    let currentIndex = currentIndexRef.current;
    
    if(componentsRef.current.length === 0) {
      setCurrentIndex(-1);
      currentIndexRef.current = -1;
      return;
    }

    if(currentIndexRef.current === -1) {
      currentIndex = 0;
      setCurrentIndex(currentIndex);
      currentIndexRef.current = currentIndex;
    }
    console.log(componentsRef.current[currentIndex]);
    setState((prevState) => {
        const firstComponent = componentsRef.current[currentIndex];
        return firstComponent
          ? {
              ...prevState,
              code: firstComponent.code,
              title: firstComponent.title,
              headline: firstComponent.headline,
              paragraph: firstComponent.paragraph,
              type: firstComponent.type,
              gradientColor: firstComponent.gradientColor,
              textColor: firstComponent.textColor,
            }
          : prevState;
    });


    const code = componentsRef.current[currentIndex].code;
    setSelectedComponent(code);

    setAction('get-started-search');
    actionRef.current = 'get-started-search';

    setIsExplanationPage(false);
    setAfterSearch(true);

  }, [setIsExplanationPage]);
  
  const handleNext = useCallback(() => {
    const nextIndex = (currentIndexRef.current + 1) % componentsRef.current.length;
    setCurrentIndex(nextIndex);
    currentIndexRef.current = nextIndex;

    console.log(componentsRef.current[nextIndex]);
    setState((prevState) => {
      const nextComponent = componentsRef.current[nextIndex];
      return nextComponent
        ? {
          ...prevState,
          code: nextComponent.code,
          title: nextComponent.title,
          headline: nextComponent.headline,
          paragraph: nextComponent.paragraph,
          type: nextComponent.type,
          gradientColor: nextComponent.gradientColor,
          textColor: nextComponent.textColor,
        }
        : prevState;
    });

    const code = componentsRef.current[nextIndex].code;
    setSelectedComponent(code);
  }, []);

  const handlePrev = useCallback(() => {
      let prevIndex;
      if(currentIndexRef.current === 0)
        prevIndex = componentsRef.current.length - 1;
      else {
        prevIndex = currentIndexRef.current - 1;
      }
      setCurrentIndex(prevIndex);
      currentIndexRef.current = prevIndex;
      console.log(componentsRef.current[prevIndex]);

      setState((prevState) => {
        const prevComponent = componentsRef.current[prevIndex];
        return prevComponent
            ? {
                  ...prevState,
                  code: prevComponent.code,
                  title: prevComponent.title,
                  headline: prevComponent.headline,
                  paragraph: prevComponent.paragraph,
                  type: prevComponent.type,
                  gradientColor: prevComponent.gradientColor,
                  textColor: prevComponent.textColor,
              }
            : prevState;
       });
      const code = componentsRef.current[prevIndex].code;
      setSelectedComponent(code);
  }, []);

  // Keyboard event handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') 
      handleSearch();
    else if (e.key === 'ArrowUp') 
      handlePrev();
    else if (e.key === 'ArrowDown')
      handleNext();
}, [handleSearch, handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]); // Dependency array includes carouselHandleEnterClick

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

    <div className={'container'}>
      <div className='gs-gradient-background'
        style={{
          background: isExplanationPage
            ? 'none'
            : `linear-gradient(to right, transparent 25%, ${state.gradientColor} 100%)`,
        }}
      >
        <OLCompass 
          action={action} 
          position={afterSearch ? "center-left" : "center"}
          resetState={resetState}  // Passing resetState to OLCompass
          onButtonClick={handleCompassClick} 
          savedComponents={savedComponents}
          selectedComponents={selectedComponent}
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
                    className="text-icon wave" // Apply your CSS class
                  />
                  ).
                  </p>
                </div>
              </div>
            </>
          )}

          {!isExplanationPage && (
            <>
            {afterSearch && (
              <CompassIcon type ={state.type} />
            )}
            
            <div className="gs-text-container">
                <h1 className='gs-title'>{state.title}</h1>
                <h2 className='gs-headline' dangerouslySetInnerHTML={{ __html: state.headline }}></h2>
                <div className="gs-text" style={{ color: state.textColor }}>
                  <p dangerouslySetInnerHTML={{ __html: state.paragraph }}></p>
                </div>
            </div>

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
      {/* Conditionally render the image if an image source is set */}
      {!isExplanationPage && imageSrc && (
        <div className="gs-image-container">
          <img src={imageSrc} alt={`Background ${state.code}`} className="gs-principles-image" />
        </div>
      )}
      {!isExplanationPage && imageSrc === null && (
        <div className="gs-image-container">
          <img src={imageSrc} alt={`Background ${state.code}`} className="gs-other-components-image" />
        </div>
      )}
    </div>
</div>
  );
};

export default GetStartedPage;
