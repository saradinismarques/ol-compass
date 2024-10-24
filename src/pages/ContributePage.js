import React, {useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../styles/ContributePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu'


const ContibutePage = ({ setNewCaseStudies, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '',
    shortDescription: '',
    credits: '',
    components: [], // Use an array to hold selected components
    firstClick: true,
    showMessage: false,
  }), []);

  const [state, setState] = useState(initialState);
  const [resetCompass, setResetCompass] = useState(false);

  // Process the case study data from the state
  const initialNewCS = {
    Title: '',
    ShortDescription: '',
    Credits: '',
    Components: [] // assuming this is an array you will populate based on user input
  };

  const [newCS, setNewCS] = useState(initialNewCS);
  const newCSRef = useRef(newCS);

  useEffect(() => {
    newCSRef.current = newCS;
}, [newCS]);

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
  }, [initialState, setIsExplanationPage]);

  const handleCompassClick = () => {
    if(state.firstClick && firstMessage) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
      }));
    }
    setIsExplanationPage(false);
  };

  const handleKeyDown = useCallback((e) => {
    //for the initial state
    if(e.key !== 'Enter') return;
    if (!isExplanationPage) return;

    if(state.firstClick && firstMessage) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
      }));
    }
    setIsExplanationPage(false);

  }, [state.firstClick, firstMessage, isExplanationPage, setIsExplanationPage]);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetStateAndCompass = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      title: '',
      shortDescription: '',
      credits: '',
      components: [],
      firstClick: false,
      showMessage: false
    }));
    // Trigger OLCompass reset
    setResetCompass(true);
    setIsExplanationPage(false);
    // Set it back to false after the reset
    setTimeout(() => {
      setResetCompass(false);
    }, 0);
  }, [setState, setResetCompass, setIsExplanationPage]);

  // Callback function to receive data from OLCompass
  const handleDataFromOLCompass  = useCallback((data) => {
    const newCaseStudy = {
      Title: newCSRef.current.Title,
      ShortDescription: newCSRef.current.ShortDescription,
      Credits: newCSRef.current.Credits,
      Components: data // assuming this is an array you will populate based on user input
    };

    // Update the newCaseStudies array with the new entry
    setNewCaseStudies((prevStudies) => [...prevStudies, newCaseStudy]);

    resetStateAndCompass();
  }, [resetStateAndCompass, setNewCaseStudies]); // Empty dependency array to ensure it doesn't change

  const handleEnterClick = (components) => {
    // for the rest of the interaction
    // Process the case study data from the state

    const newCaseStudy = {
      Title: state.title,
      ShortDescription: state.shortDescription,
      Credits: state.credits,
      Components: components // assuming this is an array you will populate based on user input
    };

    // Update the newCaseStudies array with the new entry
    setNewCaseStudies((prevStudies) => [...prevStudies, newCaseStudy]);

    resetStateAndCompass();
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
        contribute: false,
      }));
    }
  };

  return (
    <div>
    <div className={`${state.showMessage ? "blur-background" : ""}`}>
      <OLCompass 
        action="contribute"
        position={isExplanationPage ? "center" : "left"}
        onEnterClick={handleEnterClick} 
        resetState={resetState} 
        resetCompass={resetCompass}
        onSubmitClick={handleDataFromOLCompass}
        onButtonClick={handleCompassClick}
      />
        {isExplanationPage && (
        <>
        <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Understand and share your own OL practice
            </p>
            <div className='text'>
              You want to make sense of an OL resource/experience you developed?
              <br></br>
              In the ANALYSE mode the Compass provides you with a structured way to see and record your own OL contents or initiatives, for future personal or public use.
              <p className='instruction'>
                Press 'Enter' to start the analysis.
              </p>
            </div>
        </div>
        </>
        )} 

        {!isExplanationPage && (
        <>
        <button onClick={showMessage} className="question-button">
              <svg 
                className="question-icon" 
                fill="currentcolor" 
                stroke="currentcolor" /* Adds stroke color */
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="-1 109 35 35"  
                >
                <path d="m14.01,133.19c0-1.09.05-2.04.16-2.87.1-.83.38-1.66.82-2.5.42-.79.93-1.45,1.55-1.97.61-.52,1.25-1.02,1.92-1.48.67-.47,1.3-1.02,1.9-1.66.54-.63.91-1.26,1.09-1.9s.27-1.32.27-2.03-.09-1.34-.26-1.9c-.17-.56-.44-1.04-.8-1.44-.56-.68-1.24-1.15-2.05-1.4s-1.65-.38-2.53-.38-1.67.12-2.41.37c-.75.24-1.36.62-1.85,1.12-.47.45-.82.98-1.03,1.61-.22.63-.32,1.29-.32,1.98h-3.17c.06-1.1.3-2.18.72-3.23.42-1.05,1.05-1.93,1.87-2.64.82-.75,1.78-1.3,2.87-1.64,1.09-.34,2.2-.51,3.31-.51,1.36,0,2.66.21,3.88.62,1.23.41,2.26,1.1,3.09,2.06.67.71,1.16,1.52,1.47,2.43.31.91.47,1.88.47,2.91,0,1.16-.22,2.24-.65,3.26-.43,1.02-1.04,1.92-1.82,2.72-.47.52-1.01.99-1.61,1.43-.6.44-1.17.89-1.72,1.36-.55.47-.97.97-1.26,1.51-.36.67-.56,1.3-.6,1.9-.03.6-.05,1.36-.05,2.28h-3.26Zm.02,8.21v-4.09h3.24v4.09h-3.24Z"/>
              </svg>
            </button>
        <div className='c-text-container'>
          <div className="c-textarea-container">
            <div className="c-title">
                <textarea 
                  name="title"
                  className="c-placeholder" 
                  type="text" 
                  placeholder="Insert Title"  
                  value={state.title} 
                  onChange={handleInputChange}
                ></textarea>
            </div>
            <div className="c-description">
                <textarea 
                  name="shortDescription"
                  className="c-placeholder" 
                  placeholder="Insert Description"
                  value={state.shortDescription}
                  onChange={handleInputChange}
                ></textarea>
            </div>
            <div className="c-insert-sources">
                <input 
                  name="credits"
                  type="text"
                  className="c-placeholder" 
                  placeholder="Insert Source/Credits" 
                  value={state.credits}
                  onChange={handleInputChange}
                />
            </div>
          </div>

          {/* Add your select boxes and language checkboxes below this point */}
          <div className="c-filters">
            <select name="type" value={state.type}>
              <option value="">TYPE</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>

            <select name="ageRange" value={state.ageRange}>
              <option value="">AGE RANGE</option>
              <option value="children">Children</option>
              <option value="teen">Teen</option>
              <option value="adult">Adult</option>
            </select>

            <select name="duration" value={state.duration}>
              <option value="">DURATION</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>

            <select name="mainTarget" value={state.mainTarget}>
              <option value="">MAIN TARGET</option>
              <option value="all">All</option>
              <option value="specific">Specific Audience</option>
            </select>

            <select name="year" value={state.year}>
              <option value="">YEAR</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

          </div>
        </div>
        </>
        )}  
        <Menu isExplanationPage={isExplanationPage} />
    </div>
    {!isExplanationPage && state.showMessage && (
      <>
      <div className="message-box" style={{ width: 290 }}>
        <div className="question-circle message">
            <svg 
                className="question-icon" 
                fill="currentcolor" 
                stroke="currentcolor" /* Adds stroke color */
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="-1 109 35 35"  
              >
              <path d="m14.01,133.19c0-1.09.05-2.04.16-2.87.1-.83.38-1.66.82-2.5.42-.79.93-1.45,1.55-1.97.61-.52,1.25-1.02,1.92-1.48.67-.47,1.3-1.02,1.9-1.66.54-.63.91-1.26,1.09-1.9s.27-1.32.27-2.03-.09-1.34-.26-1.9c-.17-.56-.44-1.04-.8-1.44-.56-.68-1.24-1.15-2.05-1.4s-1.65-.38-2.53-.38-1.67.12-2.41.37c-.75.24-1.36.62-1.85,1.12-.47.45-.82.98-1.03,1.61-.22.63-.32,1.29-.32,1.98h-3.17c.06-1.1.3-2.18.72-3.23.42-1.05,1.05-1.93,1.87-2.64.82-.75,1.78-1.3,2.87-1.64,1.09-.34,2.2-.51,3.31-.51,1.36,0,2.66.21,3.88.62,1.23.41,2.26,1.1,3.09,2.06.67.71,1.16,1.52,1.47,2.43.31.91.47,1.88.47,2.91,0,1.16-.22,2.24-.65,3.26-.43,1.02-1.04,1.92-1.82,2.72-.47.52-1.01.99-1.61,1.43-.6.44-1.17.89-1.72,1.36-.55.47-.97.97-1.26,1.51-.36.67-.56,1.3-.6,1.9-.03.6-.05,1.36-.05,2.28h-3.26Zm.02,8.21v-4.09h3.24v4.09h-3.24Z"/>
            </svg>
          </div>
        <p className="message-text">
          Fill the form with information about your OL content/initiative, select all the Principles/Perspectives/Dimensions it addresses and press 'Enter' to save it.
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

export default ContibutePage;