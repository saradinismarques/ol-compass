import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass.js';
import { getIntroTexts } from '../utils/DataExtraction.js';
import { replaceBolds, replaceBoldsBreaksPlaceholders } from '../utils/TextFormatting.js';
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import '../styles/pages/IntroPage.css';

const IntroPage = () => {
    const {
        colors,
        language,
        setLanguage,
        opacityCounter,
        setOpacityCounter
      } = useContext(StateContext);

    const introTexts = getIntroTexts(language);
    const [frame, setFrame] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function
    const [isHoverLeft, setIsHoverLeft] = useState(false);
    const [isHoverRight, setIsHoverRight] = useState(false);
    const [cursorType, setCursorType] = useState("default");

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
    
    document.documentElement.style.setProperty('--gray-color', colors['Gray']);
    document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

    // Handlers
    const handleNext = useCallback(() => {
        setFrame((prevFrame) => (prevFrame + 1 <= 17 ? prevFrame + 1 : 17));
    }, []);

    const handlePrev = useCallback(() => {
        setFrame((prevFrame) => (prevFrame - 1 >= 0 ? prevFrame - 1 : 0));
    }, []);

    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            setFrame((prevFrame) => (prevFrame + 1 <= 17 ? prevFrame + 1 : 17));
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            setFrame((prevFrame) => (prevFrame - 1 >= 0 ? prevFrame - 1 : 0));
    }, []);

    // useCallback ensures handleClick doesn't change unless its dependencies do
    const handleClick = useCallback((e) => {
        let clickPositionX, clickPositionY;

        // Determine whether it's a mouse click or touch event
        if (e.type === "click") {
            clickPositionX = e.clientX;
            clickPositionY = e.clientY;
        } else if (e.type === "touchstart") {
            clickPositionX = e.touches[0].clientX;
            clickPositionY = e.touches[0].clientY;
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const ignoreHeight = (15 / 100) * screenHeight; // Convert 6vh to pixels

        if (clickPositionY < ignoreHeight) return; // Ignore clicks/touches in the first 6vh

        if (clickPositionX > screenWidth / 2) {
            handleNext();
        } else {
            handlePrev();
        }
    }, [handleNext, handlePrev]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const ignoreHeight = (15 / 100) * screenHeight; // Convert 6vh to pixels

            if (e.clientY < ignoreHeight) { 
                setCursorType("default");
                return; // Ignore movement in the first 6vh
            }
            
            const isLeft = e.clientX < screenWidth / 2;
            const isRight = e.clientX >= screenWidth / 2;

            setIsHoverLeft(isLeft);
            setIsHoverRight(isRight);
            // Change cursor type based on screen side
            setCursorType(isLeft || isRight ? "pointer" : "default");
        };
    
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        document.body.style.cursor = cursorType;
        return () => {
            document.body.style.cursor = "default"; // Reset cursor when component unmounts
        };
    }, [cursorType]);
    
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
          // Add event listeners for both desktop and mobile interactions
          window.addEventListener("keydown", handleKeyDown);
          window.addEventListener("click", handleClick);
          window.addEventListener("touchstart", handleClick);
        } else {
          // Remove event listeners when they are not active
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("click", handleClick);
          window.removeEventListener("touchstart", handleClick);
        }
    
        return () => {
          // Cleanup event listeners
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("click", handleClick);
          window.removeEventListener("touchstart", handleClick);
        };
    }, [listenersActive, handleKeyDown, handleClick]);

    useEffect(() => {
        if (frame === 17) {
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
        11: 'intro-11',
        12: 'intro-12',
        13: 'intro-13',
        14: 'intro-14',
        15: 'intro-15',
        16: 'intro-16',

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
            return <>{replaceBoldsBreaksPlaceholders("AA", "i-explanation-container", "i-explanation", null)}</>;
        } else if (frame === 2) {
            const introWho = introTexts.IntroWho;
            return <>{replaceBoldsBreaksPlaceholders("BB", "i-explanation-container", "i-subjects", "i-subjects bold", null)}</>;
        } else if (frame === 3) {
            const introSubject = introTexts.IntroSubject;
            return <>{replaceBoldsBreaksPlaceholders("CC", "i-explanation-container", "i-subjects", "i-subjects bold", null)}</>;  
        } else if (frame === 4) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const defineP = introTexts.DefineP;
            return <>{replaceBoldsBreaksPlaceholders("DD", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if (frame === 5) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const clarifyP = introTexts.ClarifyP;
            return <>{replaceBoldsBreaksPlaceholders("EE", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 6) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const definePe = introTexts.DefinePe;
            return <>{replaceBoldsBreaksPlaceholders("FF", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 7) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const clarifyPe = introTexts.ClarifyPe;
            return <>{replaceBoldsBreaksPlaceholders("GG", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 8) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const defineD = introTexts.DefineD;
            return <>{replaceBoldsBreaksPlaceholders("HH", "i-text-container", "i-text", "i-text colored", countersMap)}</>;   
        } else if(frame === 9) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("II", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 10) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("JJ", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 11) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("KK", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 12) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("LL", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 13) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("MM", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 14) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("NN", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 15) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("OO", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        } else if(frame === 16) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;
            return <>{replaceBoldsBreaksPlaceholders("PP", "i-text-container", "i-text", "i-text colored", countersMap)}</>;
        }   
        
    };

    const toggleSkipButton = () => {
        setFrame(17);
    };

    const toggleLanguageButton = (lan) => {
        setLanguage(lan);
    };

    return (
        <div>
            <Compass 
                mode={mode} 
                position="fixed"
            /> 
            {getDisplayText()} 
            <div className={'i-language-container'}>
            <button
                className={`i-language-button ${language === "en" ? "active" : ""}`}
                onClick={() => toggleLanguageButton('en')}
            >
                EN
            </button> 
            <span> | </span>
            <button
                className={`i-language-button ${language === "en" ? "" : "active"}`}
                onClick={() => toggleLanguageButton('pt')}
            >
                PT
            </button> 
            </div> 

            <button
                className={'i-skip-button'}
                onClick={toggleSkipButton}
            >
                skip
            </button>  

            {frame !== 0 && (
                <button className={`i-arrow-button left ${isHoverLeft ? "hover" : ""}`}>
                    <Arrow2Icon className="i-arrow-icon" />
                </button>
            )}

            {frame !== 10 && (
                <button className={`i-arrow-button right ${isHoverRight ? "hover" : ""}`}>
                    <Arrow2Icon className="i-arrow-icon" />
                </button>
            )}
        </div>
    );
};

export default IntroPage;
