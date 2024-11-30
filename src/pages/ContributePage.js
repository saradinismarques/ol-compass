import React, {useState, useEffect, useCallback, useMemo, useRef } from 'react';
import '../styles/pages/ContributePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu'
import Description from '../components/Description';
import Message from '../components/Message';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary

const ContibutePage = ({ colors, setNewCaseStudies, firstMessage, setFirstMessage, isExplanationPage, setIsExplanationPage }) => {
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
  }), []);

  const [state, setState] = useState(initialState);
  const [resetCompass, setResetCompass] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [firstClick, setFirstClick] = useState(true);
  const [messageShown, setMessageShown] = useState(false);
  
  const buttonsRef = useRef({}); // Create a ref to store button positions

  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
    setOpenDropdown(null);
    setDropdownPosition({ top: 0, left: 0 }); 

    setFirstClick(true);
    setMessageShown(false);
  }, [initialState, setIsExplanationPage]);

  const handleCompassClick = () => {
    if(firstClick && firstMessage) {
      setFirstClick(false);
      setMessageShown(true);
    }
    setIsExplanationPage(false);
  };

  const handleKeyDown = useCallback((e) => {
    //for the initial state
    if(e.key !== 'Enter') return;
    if (!isExplanationPage) return;

    if(firstClick && firstMessage) {
      setFirstClick(false);
      setMessageShown(true);
    }
    setIsExplanationPage(false);

  }, [firstClick, firstMessage, isExplanationPage, setIsExplanationPage]);


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
    setState(initialState);
    setFirstClick(false);
    setMessageShown(false);

    setOpenDropdown(null);
    setDropdownPosition({ top: 0, left: 0 }); // Set dropdown position
    // Trigger OLCompass reset
    setResetCompass(true);
    setIsExplanationPage(false);
    // Set it back to false after the reset
    setTimeout(() => {
      setResetCompass(false);
    }, 0);
  }, [setState, setResetCompass, setIsExplanationPage, initialState]);

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
      <div className={`${messageShown ? "blur-background" : ""}`}>
      <OLCompass 
        colors={colors}
        mode="contribute"
        position={isExplanationPage ? "center" : "left"}
        onEnterClick={handleEnterClick} 
        resetState={resetState} 
        resetCompass={resetCompass}
        onButtonClick={handleCompassClick}
      /> 
        {isExplanationPage && (
          <Description colors={colors} mode={'contribute'} />
        )} 

        {!isExplanationPage && (
        <>
         <Message
            mode={'contribute'}
            type={'button'}
            setMessageShown={setMessageShown} // Pass the setter to control it
          />
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
    {!isExplanationPage && 
      <Message
        mode={'contribute'}
        type={'message'}
        messageShown={messageShown} // Pass whether to show the message
        setMessageShown={setMessageShown} // Pass the setter to control it
        firstMessage={firstMessage}
        setFirstMessage={setFirstMessage}
      />
    }
    </div>
  );
};

export default ContibutePage;