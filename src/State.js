    import React, { createContext, useMemo, useState } from 'react';
import { getColorPallete } from './utils/DataExtraction.js'; 

// Create the context
export const StateContext = createContext();

// Create a provider component
export const State = ({ children }) => {
    // Global
    const [colors, setColors] = useState(getColorPallete(1));
    document.documentElement.style.setProperty('--selection-color', colors['Selection']);
    document.documentElement.style.setProperty('--gray-color', colors['Gray']);
    document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);
  
    const [language, setLanguage] = useState('en');

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

    const [firstUse, setFirstUse] = useState(initialFirstUse);

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

    const allComponents = [
        'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7',
        'Pe1', 'Pe2', 'Pe3', 'Pe4', 'Pe5', 'Pe6', 'Pe7',
        'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
    ];

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
                setRandomComponents
                // Add other global states here as needed
            }}
        >
            {children}
        </StateContext.Provider>
    );
};