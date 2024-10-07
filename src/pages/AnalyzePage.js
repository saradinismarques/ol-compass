import React, {useState, useEffect, useCallback, useMemo} from 'react';
import '../styles/AnalyzePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu'


const AnalyzePage = ({colors, newCaseStudies, setNewCaseStudies}) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '',
    shortDescription: '',
    credits: '',
    components: [], // Use an array to hold selected components
    initialState: true,
    firstClick: true,
    showMessage: false
  }), []);

  const [state, setState] = useState(initialState);
  const [resetCompass, setResetCompass] = useState(false);
  const [fetchData, setFetchData] = useState(false); // State to trigger data fetching
  const [selectedComponents, setSelectedComponents] = useState([]);
  
  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleCompassClick = () => {
    if(state.firstClick) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
        initialState: false
      }));
    }
  };

  const handleKeyDown = useCallback((e) => {
    //for the initial state
    if(e.key !== 'Enter') return;
    if (!state.initialState) return;

    if(state.firstClick) {
      setState((prevState) => ({
        ...prevState,
        firstClick: false,
        showMessage: true,
      }));
    }

    setState((prevState) => ({
      ...prevState,
      initialState: false,
    }));

  }, [state.initialState, state.firstClick]);

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

  const addNewCaseStudy = (components) => {
    // Process the case study data from the state
    const newCaseStudy = {
      Title: state.title,
      ShortDescription: state.shortDescription,
      Credits: state.credits,
      Components: components // assuming this is an array you will populate based on user input
    };

    // Update the newCaseStudies array with the new entry
    setNewCaseStudies((prevStudies) => [...prevStudies, newCaseStudy]);
    setState((prevState) => ({
      ...prevState,
      title: '',
      shortDescription: '',
      credits: '',
      components: [],
      initialState: false,
      firstClick: false,
      showMessage: false
    }));
    // Trigger OLCompass reset
    setResetCompass(true);

    // Set it back to false after the reset
    setTimeout(() => {
      setResetCompass(false);
    }, 0);
  }
  // Callback function to receive data from OLCompass
  const handleDataFromOLCompass  = useCallback((data) => {
    setSelectedComponents(data);
  }, []); // Empty dependency array to ensure it doesn't change

  const handleSubmitClick = () => {
    // You can now use compassData or perform any action with it
    setFetchData(true);

    // Set it back to false after the reset
    setTimeout(() => {
      setFetchData(false);
    }, 0);

   addNewCaseStudy(selectedComponents);
  };

  const handleEnterClick = (components) => {
    // for the rest of the interaction
    // Process the case study data from the state
    if (state.initialState) return;

    addNewCaseStudy(components);
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
  };

  return (
    <div>
    <div className={`${state.showMessage ? "blur-background" : ""}`}>
      <OLCompass 
        colors={colors} 
        position="left" 
        action="analyze"
        onEnterClick={handleEnterClick} 
        resetState={resetState} 
        resetCompass={resetCompass}
        onSubmitClick={handleDataFromOLCompass}
        fetchData={fetchData} 
        onButtonClick={handleCompassClick}
      />
        {state.initialState && (
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

        {!state.initialState && (
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
        <div className="a-text-container">
          <div className="a-title">
              <input 
                name="title"
                className="a-placeholder" 
                type="text" 
                placeholder="Insert Title"  
                value={state.title} 
                onChange={handleInputChange}
              />
          </div>
          <div className='a-text'>
              <p className='a-small-instruction'>Select all relevant elements</p>
              <div className='a-instruction-container'>
                  <p className='a-instruction'>Click again to deselect</p>
                  <p className='a-instruction'>Long press to recall description</p>
              </div>
              <div className='a-question-container'>
                  <p className='a-question'>Which principles does your case address?</p>
                  <p className='a-question'>Which perspective(s) does it express?</p>
                  <p className='a-question'>Which dimension(s) does it pertain?</p>
              </div>
          </div>
          <div className="a-description">
              <textarea 
                name="shortDescription"
                className="a-placeholder" 
                placeholder="Insert Description"
                value={state.shortDescription}
                onChange={handleInputChange}
              ></textarea>
          </div>
          <div className="a-insert-sources">
              <input 
                name="credits"
                type="text"
                className="a-placeholder" 
                placeholder="Insert Credits" 
                value={state.credits}
                onChange={handleInputChange}
                />
          </div>
          <button className="a-submit-button" onClick={handleSubmitClick}>
            Submit
          </button>
        </div>
        </>
        )}  
        <Menu />
    </div>
    {!state.initialState && state.showMessage && (
      <>
      <div className="message-box" style={{ width: 290 }}>
        <div className="question-circle">
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

export default AnalyzePage;