import React, { createContext, useMemo, useState } from 'react';
import { getColorPallete } from './utils/DataExtraction.js'; 

// Create the context
export const StateContext = createContext();

// Create a provider component
export const State = ({ children }) => {
    // Global
    const [colors, setColors] = useState(getColorPallete(2));
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

