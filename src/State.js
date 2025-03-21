import React, { createContext, useMemo, useState, useEffect } from 'react';
import { getColorPallete } from './utils/DataExtraction.js'; 
import { ReactComponent as WaveIcon } from './assets/icons/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from './assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from './assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { ReactComponent as CtaArrow } from './assets/icons/cta-arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as LockIcon } from './assets/icons/lock-icon.svg'; // Adjust the path as necessary

// Create the context
export const StateContext = createContext();

// Create a provider component
export const State = ({ children }) => {
    // Global
    const [colors, setColors] = useState(getColorPallete(1));
    document.documentElement.style.setProperty('--selection-color', colors['Selection']);
    document.documentElement.style.setProperty('--gray-color', colors['Gray']);
    document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);
  
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);
    
    const [showExplanation, setShowExplanation] = useState(true);
    const [showInstruction, setShowInstruction] = useState(false);

    // Home
    const initialFirstUse = useMemo(
        () => ({
          "intro": true,
          "home": true,
          "get-started": true,
          "learn": true,
          "get-inspired": true,
          "map": true,
        }), []
      );

    const [showStudyInstruction, setShowStudyInstruction] = useState(false);
    
    const [firstUse, setFirstUse] = useState(initialFirstUse);
   
    const allComponents = [
        'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7',
        'Pe1', 'Pe2', 'Pe3', 'Pe4', 'Pe5', 'Pe6', 'Pe7',
        'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
    ];
    // Learn
    const [savedComponents, setSavedComponents] = useState([]);
    const [learnComponent, setLearnComponent] = useState(null);

    // Get Inspired
    const [savedCaseStudies, setSavedCaseStudies] = useState([]);
    const [currentCaseStudy, setCurrentCaseStudy] = useState();
    const [caseStudies, setCaseStudies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState('get-inspired-carousel');
    const [resultsNumber, setResultsNumber] = useState(-1);
    const [searchLogic, setSearchLogic] = useState('OR');
    const [giComponents, setGIComponents] = useState([]);
    const [currentGIComponents, setCurrentGIComponents] = useState([]);
    
    // Contribute
    const [newCaseStudies, setNewCaseStudies] = useState([]);

    // Map 2
    const [mapComponents, setMapComponents] = useState([]);
    const [mapProjectName, setMapProjectName] = useState('');
    const [mapCurrentType, setMapCurrentType] = useState('Principle');
    const [mapAllComponents, setMapAllComponents] = useState(
        allComponents.reduce((acc, code) => {
          acc[code] = ""; // Default value is an empty string
          return acc;
        }, {})
    );
    
    const initialTypeState = useMemo(
        () => ({
        "Principle": false,
        "Perspective": false,
        "Dimension": false,
        }), []
    );
    const [typeComplete, setTypeComplete] = useState(initialTypeState);



    // Icons
    const iconsMap = {
        "[WAVE-I]": <WaveIcon className="text-icon wave" />,
        "[ARROW-I]": <ArrowIcon className="text-icon" />,
        "[BOOKMARK-I]": <BookmarkIcon className="text-icon " />,
        "[CTAARROW-I]": <CtaArrow className="text-icon cta-arrow" />,
        "[LOCK-I]": <LockIcon className="lock-icon" />,
    };

    // Intro
    const initialCounters = {
        Principle: 0,
        Perspective: 0,
        Dimension: 0
    };
    const [opacityCounter, setOpacityCounter] = useState(initialCounters);
    const [randomComponents, setRandomComponents] = useState(['P1', 'P3', 'P5', 'P6', 'Pe3', 'Pe4', 'Pe6', 'D1', 'D3', 'D4', 'D6', 'D8']);

    return (
        <StateContext.Provider
            value={{
                colors,
                setColors,
                language,
                setLanguage,
                firstUse,
                setFirstUse,
                showExplanation,
                setShowExplanation,
                showInstruction,
                setShowInstruction,
                learnComponent,
                setLearnComponent,
                savedComponents,
                setSavedComponents,
                savedCaseStudies,
                setSavedCaseStudies,
                newCaseStudies,
                setNewCaseStudies,
                mapComponents,
                setMapComponents,
                mapProjectName,
                setMapProjectName,
                allComponents,
                opacityCounter,
                setOpacityCounter,
                currentCaseStudy,
                setCurrentCaseStudy,
                caseStudies,
                setCaseStudies,
                currentIndex,
                setCurrentIndex,
                mode,
                setMode,
                resultsNumber,
                setResultsNumber,
                searchLogic,
                setSearchLogic,
                giComponents,
                setGIComponents,
                currentGIComponents,
                setCurrentGIComponents,
                randomComponents,
                setRandomComponents,
                iconsMap,
                showStudyInstruction,
                setShowStudyInstruction,
                mapCurrentType,
                setMapCurrentType,
                typeComplete,
                setTypeComplete,
                mapAllComponents,
                setMapAllComponents
                // Add other global states here as needed
            }}
        >
            {children}
        </StateContext.Provider>
    );
};