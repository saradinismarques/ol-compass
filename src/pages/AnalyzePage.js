import React, {useState, useEffect, useCallback, useMemo} from 'react';
import '../styles/AnalyzePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu'
import { ReactComponent as QuestionIcon } from '../assets/question-icon.svg'; // Adjust the path as necessary

const AnalyzePage = ({colors, setNewCaseStudies}) => {
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
          <QuestionIcon 
            className="question-icon" 
          />
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
            <QuestionIcon 
              className="question-icon" 
            />
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