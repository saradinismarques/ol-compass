import React, {useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../styles/ContributePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu'
import { ReactComponent as ArrowIcon } from '../assets/arrow-icon.svg'; // Adjust the path as necessary

const ContibutePage = ({ setNewCaseStudies, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
  // Memoize the initialState object
  const initialState = useMemo(() => ({
    title: '', 
    collection: '',
    mainTarget: '',
    age: '',
    time: '',
    type: '',
    languages: '',
    year: '',
    description: '',
    credits: '',
    components: [], // Use an array to hold selected components
    firstClick: true,
    showMessage: false,
  }), []);

  const [state, setState] = useState(initialState);
  const [resetCompass, setResetCompass] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonsRef = useRef({}); // Create a ref to store button positions

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
    setOpenDropdown(null);
    setDropdownPosition({ top: 0, left: 0 }); 
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
      collection: '',
      mainTarget: '',
      age: '',
      time: '',
      type: '',
      languages: '',
      year: '',
      description: '',
      credits: '',
      components: [],
      firstClick: false,
      showMessage: false
    }));

    setOpenDropdown(null);
    setDropdownPosition({ top: 0, left: 0 }); // Set dropdown position
    // Trigger OLCompass reset
    setResetCompass(true);
    setIsExplanationPage(false);
    // Set it back to false after the reset
    setTimeout(() => {
      setResetCompass(false);
    }, 0);
  }, [setState, setResetCompass, setIsExplanationPage]);

  const handleEnterClick = (components) => {
    // for the rest of the interaction
    // Process the case study data from the state
    const newCaseStudy = {
      Title: state.title,
      Collection: state.collection,
      MainTarget: state.mainTarget,
      Age: state.age,
      Time: state.time,
      Type: state.type,
      Languages: state.languages,
      Year: state.year,
      Description: state.description,
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

  // Function to toggle the dropdowns
  const toggleDropdown = (dropdownName, button) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      const rect = button.getBoundingClientRect(); // Get button position
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left }); // Set dropdown position
      setOpenDropdown(dropdownName);
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
                  name="description"
                  className="c-placeholder" 
                  placeholder="Insert Description"
                  value={state.description}
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
          {/* Dropdown Buttons */}
          <div className="c-filters">
            <button ref={el => (buttonsRef.current.type = el)} onClick={e => toggleDropdown('type', e.currentTarget)}>
              TYPE
              <ArrowIcon 
                className={openDropdown === 'type' ? 'c-arrow-icon active' : 'c-arrow-icon'}
              />
            </button>
            <button ref={el => (buttonsRef.current.ageRange = el)} onClick={e => toggleDropdown('ageRange', e.currentTarget)}>
              AGE RANGE
              <ArrowIcon 
                className={openDropdown === 'ageRange' ? 'c-arrow-icon active' : 'c-arrow-icon'}
              />
            </button>
            <button ref={el => (buttonsRef.current.duration = el)} onClick={e => toggleDropdown('duration', e.currentTarget)}>
              DURATION
              <ArrowIcon 
                className={openDropdown === 'duration' ? 'c-arrow-icon active' : 'c-arrow-icon'}
              />
            </button>
            <button ref={el => (buttonsRef.current.language = el)} onClick={e => toggleDropdown('language', e.currentTarget)}>
              LANGUAGE
              <ArrowIcon 
                className={openDropdown === 'language' ? 'c-arrow-icon active' : 'c-arrow-icon'}
              />
            </button>
            <button ref={el => (buttonsRef.current.mainTarget = el)} onClick={e => toggleDropdown('mainTarget', e.currentTarget)}>
              MAIN TARGET
              <ArrowIcon 
                className={openDropdown === 'mainTarget' ? 'c-arrow-icon active' : 'c-arrow-icon'}
              />
            </button>
            <button ref={el => (buttonsRef.current.year = el)} onClick={e => toggleDropdown('year', e.currentTarget)}>
              YEAR
              <ArrowIcon 
                className={openDropdown === 'year' ? 'c-arrow-icon active' : 'c-arrow-icon'}
              />
            </button>
          </div>
        </div>

        {openDropdown === 'type' && (
          <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <label className="c-checkbox-label">
              <input 
                name="type"
                type="checkbox" 
                className="c-checkbox" 
                value="activity" 
                checked={state.type.includes('activity')}
                onChange={handleInputChange}
              /> 
              Activity
            </label>
            <label className="c-checkbox-label">
              <input 
                name="type"
                type="checkbox" 
                className="c-checkbox" 
                value="EU project" 
                checked={state.type.includes('EU project')}
                onChange={handleInputChange}
              /> 
              EU Project
            </label>
          </div>
        )}
        {openDropdown === 'ageRange' && (
          <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <label className="c-checkbox-label">
              <input 
                name="age"
                type="checkbox" 
                className="c-checkbox" 
                value="8+" 
                checked={state.age.includes('8+')}
                onChange={handleInputChange}
              /> 8+
            </label>
            <label className="c-checkbox-label">
              <input 
                name="age"
                type="checkbox" 
                className="c-checkbox" 
                value="10+" 
                checked={state.age.includes('10+')}
                onChange={handleInputChange}
              /> 10+
            </label>
            <label className="c-checkbox-label">
              <input 
                name="age"
                type="checkbox" 
                className="c-checkbox" 
                value="12+" 
                checked={state.age.includes('12+')}
                onChange={handleInputChange}
              /> 12+
            </label>
            <label className="c-checkbox-label">
              <input 
                name="age"
                type="checkbox" 
                className="c-checkbox" 
                value="14+" 
                checked={state.age.includes('14+')}
                onChange={handleInputChange}
              /> 14+
            </label>
            <label className="c-checkbox-label">
              <input 
                name="age"
                type="checkbox" 
                className="c-checkbox" 
                value="16+" 
                checked={state.age.includes('16+')}
                onChange={handleInputChange}
              /> 16+
            </label>
            <label className="c-checkbox-label">
              <input 
                name="age"
                type="checkbox" 
                className="c-checkbox" 
                value="18+" 
                checked={state.age.includes('18+')}
                onChange={handleInputChange}
              /> 18+
            </label>
          </div>
        )}
        {openDropdown === 'duration' && (
          <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <label className="c-checkbox-label">
              <input 
                name="time"
                type="checkbox" 
                className="c-checkbox" 
                value="45'" 
                checked={state.time.includes(`45'`)}
                onChange={handleInputChange}
              /> 45'
            </label>
            <label className="c-checkbox-label">
              <input 
                name="time"
                type="checkbox" 
                className="c-checkbox" 
                value="60'" 
                checked={state.time.includes(`60'`)}
                onChange={handleInputChange}
              /> 60'
            </label>
            <label className="c-checkbox-label">
              <input 
                name="time"
                type="checkbox" 
                className="c-checkbox" 
                value="90'" 
                checked={state.time.includes(`90'`)}
                onChange={handleInputChange}
              /> 90'
            </label>
            <label className="c-checkbox-label">
              <input 
                name="time"
                type="checkbox" 
                className="c-checkbox" 
                value="120'" 
                checked={state.time.includes(`120'`)}
                onChange={handleInputChange}
              /> 120'
            </label>
            <label className="c-checkbox-label">
              <input 
                name="time"
                type="checkbox" 
                className="c-checkbox" 
                value="180'" 
                checked={state.time.includes(`180'`)}
                onChange={handleInputChange}
              /> 180'
            </label>
          </div>
        )}
        {openDropdown === 'language' && (
          <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <label className="c-checkbox-label">
              <input 
                name="languages"
                type="checkbox" 
                className="c-checkbox" 
                value="EN" 
                checked={state.languages.includes('EN')}
                onChange={handleInputChange}
              /> ENGLISH [EN]
            </label>
            <label className="c-checkbox-label">
              <input 
                name="languages"
                type="checkbox" 
                className="c-checkbox" 
                value="ES" 
                checked={state.languages.includes('ES')}
                onChange={handleInputChange}
              /> ESPANOL [ES]
            </label>
            <label className="c-checkbox-label">
              <input 
                name="languages"
                type="checkbox" 
                className="c-checkbox" 
                value="IT" 
                checked={state.languages.includes('IT')}
                onChange={handleInputChange}
              /> ITALIANO [IT]
            </label>
            <label className="c-checkbox-label">
              <input 
                name="languages"
                type="checkbox" 
                className="c-checkbox" 
                value="PT" 
                checked={state.languages.includes('PT')}
                onChange={handleInputChange}
              /> PORTUGUES [PT]
            </label>
          </div>
        )}
        {openDropdown === 'mainTarget' && (
          <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <label className="c-checkbox-label">
              <input 
                name="mainTarget"
                type="checkbox" 
                className="c-checkbox" 
                value="high-school" 
                checked={state.mainTarget.includes('high-school')}
                onChange={handleInputChange}
              /> High-school
            </label>
            <label className="c-checkbox-label">
              <input 
                name="mainTarget"
                type="checkbox" 
                className="c-checkbox" 
                value="students" 
                checked={state.mainTarget.includes('students')}
                onChange={handleInputChange}
              /> Students
            </label>
            <label className="c-checkbox-label">
              <input 
                name="mainTarget"
                type="checkbox" 
                className="c-checkbox" 
                value="local community" 
                checked={state.mainTarget.includes('local community')}
                onChange={handleInputChange}
              /> Local Community
            </label>
          </div>
        )}
        {openDropdown === 'year' && (
          <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2018" 
                checked={state.year.includes('2018')}
                onChange={handleInputChange}
              /> 2018
            </label>
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2019" 
                checked={state.year.includes('2019')}
                onChange={handleInputChange}
              /> 2019
            </label>
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2020" 
                checked={state.year.includes('2020')}
                onChange={handleInputChange}
              /> 2020
            </label>
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2021" 
                checked={state.year.includes('2021')}
                onChange={handleInputChange}
              /> 2021
            </label>
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2022" 
                checked={state.year.includes('2022')}
                onChange={handleInputChange}
              />2022
            </label> 
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2023" 
                checked={state.year.includes('2023')}
                onChange={handleInputChange}
              /> 2023
            </label> 
            <label className="c-checkbox-label">
              <input 
                name="year"
                type="checkbox" 
                className="c-checkbox" 
                value="2024" 
                checked={state.year.includes('2024')}
                onChange={handleInputChange}
              /> 2024
            </label> 
          </div>
        )}
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