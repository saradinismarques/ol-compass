import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OLCompass from '../components/OLCompass.js';
import { getIntroTexts } from '../utils/Data.js';
import { replaceBolds, replaceBoldsBreaksPlaceholders } from '../utils/TextFormatting.js';
import { StateContext } from "../State";
import '../styles/pages/IntroPage.css';

const IntroPage = () => {
    const {
        colors,
        opacityCounter,
        setOpacityCounter
      } = useContext(StateContext);

    const introTexts = getIntroTexts('English');
    const [frame, setFrame] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function
    
    const maxCounters = useMemo(() => ({
        Principle: 6,
        Perspective: 6,
        Dimension: 9
    }), []);

    const [listenersActive, setListenersActive] = useState(true);

    // Placeholder-to-Counter mapping
    const countersMap = {
        "[COUNTER-P]": opacityCounter['Principle'] + 1,
        "[COUNTER-Pe]": opacityCounter['Perspective'] + 1,
        "[COUNTER-D]": opacityCounter['Dimension'] + 1,
    };
    
    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            setFrame((prevFrame) => (prevFrame + 1 <= 10 ? prevFrame + 1 : 10));
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            setFrame((prevFrame) => (prevFrame - 1 >= 0 ? prevFrame - 1 : 0));
    }, []);

    // useCallback ensures handleClick doesn't change unless its dependencies do
    const handleClick = useCallback((e) => {
        const screenWidth = window.innerWidth;
        const clickPositionX = e.clientX;

        if (clickPositionX > screenWidth / 2) {
            setFrame((prevFrame) => (prevFrame + 1 <= 10 ? prevFrame + 1 : 10));
        } else {
            setFrame((prevFrame) => (prevFrame - 1 >= 0 ? prevFrame - 1 : 0));
        }
    }, []);

    useEffect(() => {   
        const isComplete =
            (frame === 0 || frame === 1) ||
            (frame === 2 || frame === 3) ||
            ((frame === 4 || frame === 5) && opacityCounter.Principle >= maxCounters.Principle) ||
            ((frame === 6 || frame === 7) && opacityCounter.Perspective >= maxCounters.Perspective) ||
            ((frame === 8 || frame === 9) && opacityCounter.Dimension >= maxCounters.Dimension);
        
        if (isComplete) {
            setListenersActive(true);
        } else {
            setListenersActive(false);
        }
    }, [opacityCounter, frame, maxCounters]);

    useEffect(() => {
        if (listenersActive) {
            // Add event listeners
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('click', handleClick);
        } else {
            // Remove event listeners if they are active
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClick);
        }
            
        // Cleanup on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClick);
        };
    }, [listenersActive, handleKeyDown, handleClick]); // Add handleKeyPress to the dependency array

    useEffect(() => {
        if (frame === 10) {
            navigate('/home');
        }
    }, [frame, navigate]); // Trigger navigation when state changes to 6

    // Define the action based on the current state
    const actionMap = {
        0: 'intro-0',
        1: 'intro-1',
        2: 'intro-2',
        3: 'intro-3',
        4: 'intro-4',
        5: 'intro-5',
        6: 'intro-6',
        7: 'intro-7',
        8: 'intro-8',
        9: 'intro-9',
        10: 'intro-10',

    };

    // Determine the action based on the current state
    const mode = actionMap[frame];

    // Function to sequentially light up "Principle" buttons
    function startOpacityCounter(type) {
        if ((type === 'Principle' && opacityCounter[type] >= maxCounters.Principle) ||
            (type === 'Perspective' && opacityCounter[type] >= maxCounters.Perspective) ||
            (type === 'Dimension' && opacityCounter[type] >= maxCounters.Dimension)) 
            return;
        
        setTimeout(() => {
            setOpacityCounter({
                ...opacityCounter,
                [type]: opacityCounter[type] + 1
            });
        }, 300); // Delay for each button (3 seconds between each)
    }

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (frame === 0) {
            const title = introTexts.Title;
            return <>{replaceBolds(title, "i-title-container", "i-welcome", "i-title")}</>;
        
        } else if (frame === 1) {
            const introDef = introTexts.IntroDef;
            return <>{replaceBoldsBreaksPlaceholders(introDef, "i-explanation-container", "i-explanation", null)}</>;
        
        } else if (frame === 2) {
            const introWho = introTexts.IntroWho;
            return <>{replaceBoldsBreaksPlaceholders(introWho, "i-explanation-container", "i-subjects", "i-subjects bold", null)}</>;
        
        } else if (frame === 3) {
            const introSubject = introTexts.IntroSubject;
            return <>{replaceBoldsBreaksPlaceholders(introSubject, "i-explanation-container", "i-subjects", "i-subjects bold", null)}</>;
        
        } else if (frame === 4) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const defineP = introTexts.DefineP;
            return <>{replaceBoldsBreaksPlaceholders(defineP, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if (frame === 5) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const clarifyP = introTexts.ClarifyP;
            return <>{replaceBoldsBreaksPlaceholders(clarifyP, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if(frame === 6) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const definePe = introTexts.DefinePe;
            return <>{replaceBoldsBreaksPlaceholders(definePe, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if(frame === 7) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const clarifyPe = introTexts.ClarifyPe;
            return <>{replaceBoldsBreaksPlaceholders(clarifyPe, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if(frame === 8) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const defineD = introTexts.DefineD;
            return <>{replaceBoldsBreaksPlaceholders(defineD, "i-text-container", "i-text", "i-text colored", countersMap)}</>;
            
        } else if(frame === 9) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders(clarifyD, "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } 
    };

    return (
        <div>
            <OLCompass 
                mode={mode} 
                position="center"
            /> 
            {getDisplayText()}    
        </div>
    );
};

export default IntroPage;
