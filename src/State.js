import React, { createContext, useMemo, useState } from 'react';
import { getColorPallete } from './utils/DataExtraction.js'; 

// Create the context
export const StateContext = createContext();

// Create a provider component
export const State = ({ children }) => {
    // Global
    const [colors, setColors] = useState(getColorPallete(1));
    document.documentElement.style.setProperty('--selection-color', colors['Selection']);

    const initialFirstMessage = useMemo(
        () => ({
          "get-started": true,
          learn: true,
          "get-inspired": true,
          analyse: true,
          contribute: true,
        }), []
      );

    const [firstMessage, setFirstMessage] = useState(initialFirstMessage);
    const [isExplanationPage, setIsExplanationPage] = useState(true);

    // Learn
    const [savedComponents, setSavedComponents] = useState([]);
    
    // Get Inspired
    const [savedCaseStudies, setSavedCaseStudies] = useState([]);
    
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

    return (
        <StateContext.Provider
            value={{
                colors,
                setColors,
                firstMessage,
                setFirstMessage,
                isExplanationPage,
                setIsExplanationPage,
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
                // Add other global states here as needed
            }}
        >
            {children}
        </StateContext.Provider>
    );
};