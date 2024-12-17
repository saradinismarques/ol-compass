import React, { createContext, useMemo, useState, useRef, useEffect } from 'react';
import { getColorPallete } from './utils/Data.js'; 

// Create the context
export const StateContext = createContext();

// Create a provider component
export const State = ({ children }) => {
    // Global
    const [colors, setColors] = useState(getColorPallete(1));
    document.documentElement.style.setProperty('--selection-color', colors['Selection']);

    const initialFirstMessage = useMemo(
        () => ({
          getStarted: true,
          learn: true,
          getInspired: true,
          analyse: true,
          contribute: true,
        }), []
      );

    const [firstMessage, setFirstMessage] = useState(initialFirstMessage);
    const [isExplanationPage, setIsExplanationPage] = useState(true);

    const [savedComponents, setSavedComponents] = useState([]);
    const [savedCaseStudies, setSavedCaseStudies] = useState([]);
    const [newCaseStudies, setNewCaseStudies] = useState([]);

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

    // Get Started
    const [GSCurrentComponent, setGSCurrentComponent] = useState([]);
    const [GSComponents, setGSComponents] = useState([]);

    // Learn
    const [LComponent, setLComponent] = useState([]);

    // Get Inspired
    const [GICurrentComponents, setGICurrentComponents] = useState([]);
    const [GIComponents, setGIComponents] = useState([]);
    const GIComponentsRef = useRef(GIComponents);
  
    // Update the ref whenever changes
    useEffect(() => {
        GIComponentsRef.current = GIComponents;
    }, [GIComponents]);

    // Analyse
    const [AComponents, setAComponents] = useState([]);
    const [addedComponents, setAddedComponents] = useState([]);
    const [removedComponents, setRemovedComponents] = useState([]);

    // Contribute
    const [CComponents, setCComponents] = useState([]);
    const CComponentsRef = useRef(GIComponents);
  
    // Update the ref whenever changes
    useEffect(() => {
        CComponentsRef.current = CComponents;
    }, [CComponents]);

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
                allComponents,
                opacityCounter,
                setOpacityCounter,
                GSComponents,
                setGSComponents,
                GSCurrentComponent,
                setGSCurrentComponent,
                LComponent,
                setLComponent,
                GIComponents,
                setGIComponents,
                GIComponentsRef,
                GICurrentComponents,
                setGICurrentComponents,
                AComponents,
                setAComponents,
                addedComponents,
                setAddedComponents,
                removedComponents,
                setRemovedComponents,
                CComponents,
                setCComponents,
                CComponentsRef
                // Add other global states here as needed
            }}
        >
            {children}
        </StateContext.Provider>
    );
};


// import React, { useContext } from 'react';
// import { GlobalProvider, GlobalContext } from './Context';
// import AnotherPage from './AnotherPage';

// const App = () => {
//   const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

//   return (
//     <div>
//       <h1>App Page</h1>
//       <p>Global Variable: {globalVariable}</p>
//       <button onClick={() => setGlobalVariable('Updated from App.js')}>
//         Update from App
//       </button>
//       <AnotherPage />
//     </div>
//   );
// };

// const WrappedApp = () => (
//   <GlobalProvider>
//     <App />
//   </GlobalProvider>
// );

// export default WrappedApp;

// import React, { useContext } from 'react';
// import { GlobalContext } from './Context';

// const AnotherPage = () => {
//   const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

//   return (
//     <div>
//       <h2>Another Page</h2>
//       <p>Global Variable: {globalVariable}</p>
//       <button onClick={() => setGlobalVariable('Updated from Another Page')}>
//         Update from Another Page
//       </button>
//     </div>
//   );
// };

// export default AnotherPage;

