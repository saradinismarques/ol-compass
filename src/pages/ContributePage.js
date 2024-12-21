import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import '../styles/pages/ContributePage.css';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import Message from '../components/Message';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";

const ContributePage = () => {
  const {
    colors,
    firstMessage,
    setFirstMessage,
    isExplanationPage,
    setIsExplanationPage,
    newCaseStudies,
    setNewCaseStudies,
  } = useContext(StateContext);

  // Initial state for the form
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
    components: [],
  }), []);

  const [state, setState] = useState(initialState);
  const [resetCompass, setResetCompass] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [firstClick, setFirstClick] = useState(true);
  const [messageShown, setMessageShown] = useState(false);
  const [components, setComponents] = useState([]);

  const componentsRef = useRef(components);
  const buttonsRef = useRef({}); // Stores button positions for dropdown alignment
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state; // Keep the ref in sync with the latest state
  }, [state]);

  // Reset state and UI elements
  const resetState = useCallback(() => {
    setState(initialState);
    setIsExplanationPage(true);
    setOpenDropdown(null);
    setDropdownPosition({ top: 0, left: 0 });
    setFirstClick(true);
    setMessageShown(false);
  }, [initialState, setIsExplanationPage]);

  // Trigger compass action
  const handleCompassClick = (code) => {
    if (firstClick && firstMessage) {
      setFirstClick(false);
      setMessageShown(true);
    }

    setComponents(prevClickedIds => {
      const newSelectedIds = prevClickedIds.includes(code)
        ? prevClickedIds.filter(buttonId => buttonId !== code) // Remove ID if already clicked
        : [...prevClickedIds, code]; // Add ID if not already clicked
      componentsRef.current = newSelectedIds;
      
      // Return the updated state
      return newSelectedIds;
    });

    setIsExplanationPage(false);
  };

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
      if (e.key !== 'Enter') return;

      if (firstClick && firstMessage) {
        setFirstClick(false);
        setMessageShown(true);
      }
      setIsExplanationPage(false);
      handleEnterClick(componentsRef.current);
    },
    [firstClick, firstMessage, isExplanationPage, setIsExplanationPage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update form state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Reset compass and state
  const resetStateAndCompass = useCallback(() => {
    resetState();
    setResetCompass(true);
    setTimeout(() => setResetCompass(false), 0); // Reset compass trigger
  }, [resetState]);

  // Handle "Enter" button action
  const handleEnterClick = (components) => {
    const newCaseStudy = {
      Title: stateRef.current.title,
      Collection: stateRef.current.collection,
      MainTarget: stateRef.current.mainTarget,
      Age: stateRef.current.age,
      Time: stateRef.current.time,
      Type: stateRef.current.type,
      Languages: stateRef.current.languages,
      Year: stateRef.current.year,
      Description: stateRef.current.description,
      Credits: stateRef.current.credits,
      Components: components,
    };

    setNewCaseStudies((prev) => [...prev, newCaseStudy]);
    resetStateAndCompass();
  };

  // Toggle dropdown visibility
  const toggleDropdown = (dropdownName, button) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      const rect = button.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
      setOpenDropdown(dropdownName);
    }
  };

  // Render dropdown content
  const renderDropdownContent = (dropdownName, options) => (
    <div className="c-dropdown-content" style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
      {options.map(({ label, value }) => (
        <label key={value} className="c-checkbox-label">
          <input
            name={dropdownName}
            type="checkbox"
            className="c-checkbox"
            value={value}
            checked={state[dropdownName] === value}
            onChange={handleInputChange}
          />
          {label}
        </label>
      ))}
    </div>
  );

  // Dropdown options for each category
  const dropdownOptions = {
    type: [
      { label: 'Activity', value: 'activity' },
      { label: 'EU Project', value: 'EU project' },
    ],
    age: [
      { label: '8+', value: '8+' },
      { label: '10+', value: '10+' },
      { label: '12+', value: '12+' },
      { label: '14+', value: '14+' },
      { label: '16+', value: '16+' },
      { label: '18+', value: '18+' },
    ],
    time: [
      { label: "45'", value: "45'" },
      { label: "60'", value: "60'" },
      { label: "90'", value: "90'" },
      { label: "120'", value: "120'" },
      { label: "180'", value: "180'" },
    ],
    languages: [
      { label: 'English [EN]', value: 'EN' },
      { label: 'Español [ES]', value: 'ES' },
      { label: 'Italiano [IT]', value: 'IT' },
      { label: 'Português [PT]', value: 'PT' },
    ],
    mainTarget: [
      { label: 'High-school', value: 'high-school' },
      { label: 'Students', value: 'students' },
      { label: 'Local Community', value: 'local community' },
    ],
    year: [
      { label: '2018', value: '2018' },
      { label: '2019', value: '2019' },
      { label: '2020', value: '2020' },
      { label: '2021', value: '2021' },
      { label: '2022', value: '2022' },
      { label: '2023', value: '2023' },
      { label: '2024', value: '2024' },
    ],
  };

  // Dropdown display labels for each key
  const dropdownLabels = {
    type: 'TYPE',
    age: 'AGE RANGE', // Properly spaced label for rendering
    time: 'DURATION',
    languages: 'LANGUAGE',
    mainTarget: 'MAIN TARGET',
    year: 'YEAR',
  };

  return (
    <>
      <div className={messageShown ? 'blur-background' : ''}>
        <OLCompass
          mode="contribute"
          position={isExplanationPage ? 'center' : 'left'}
          resetState={resetState}
          resetCompass={resetCompass}
          onButtonClick={handleCompassClick}
        />
        {isExplanationPage && <Description mode="contribute" />}

        {!isExplanationPage && (
          <>
            <Message mode="contribute" type="button" setMessageShown={setMessageShown} />
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

              <div className="c-filters">
                {Object.keys(dropdownOptions).map((key) => (
                  <button
                    key={key}
                    ref={(el) => (buttonsRef.current[key] = el)}
                    onClick={(e) => toggleDropdown(key, e.currentTarget)}
                  >
                    {dropdownLabels[key]} {/* Use dropdownLabels for proper display */}
                    <ArrowIcon className={openDropdown === key ? 'c-arrow-icon active' : 'c-arrow-icon'} />
                  </button>
                ))}
              </div>
            </div>

            {openDropdown && renderDropdownContent(openDropdown, dropdownOptions[openDropdown])}
          </>
        )}
        <Menu />
      </div>
      {!isExplanationPage && (
        <Message
          mode="contribute"
          type="message"
          messageShown={messageShown}
          setMessageShown={setMessageShown}
        />
      )}
    </>
  );
};

export default ContributePage;
