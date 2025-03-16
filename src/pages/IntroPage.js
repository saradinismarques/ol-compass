import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
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
        setOpacityCounter,
        randomComponents,
        setRandomComponents
      } = useContext(StateContext);

    const introTexts = getIntroTexts(language);
    const [frame, setFrame] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function
    const [isHoverLeft, setIsHoverLeft] = useState(false);
    const [isHoverRight, setIsHoverRight] = useState(false);
    const [cursorType, setCursorType] = useState("default");
    const [showSkipButtons, setShowSkipButtons] = useState(true);
  
    const showSkipButtonsRef = useRef(showSkipButtons);
    const frameRef = useRef(frame);
    const maxFrame = 17;

    const maxCounters = useMemo(() => ({
        Principle: 6,
        Perspective: 6,
        Dimension: 9
    }), []);

    const [listenersActive, setListenersActive] = useState(true);

    useEffect(() => {
        showSkipButtonsRef.current = showSkipButtons;
    }, [showSkipButtons]);

    useEffect(() => {
        frameRef.current = frame;
    }, [frame]);

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
        setFrame((prevFrame) => {
            const newFrame = prevFrame + 1 <= maxFrame ? prevFrame + 1 : maxFrame;
            frameRef.current = newFrame; // Update the ref
            return newFrame;
        });
    }, [maxFrame]);
    
    const handlePrev = useCallback(() => {
        setFrame((prevFrame) => {
            const newFrame = prevFrame - 1 >= 0 ? prevFrame - 1 : 0;
            frameRef.current = newFrame; // Update the ref
            return newFrame;
        });
    }, []);
    
    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            handleNext()
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            handlePrev()
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

            if (e.clientY < ignoreHeight || showSkipButtonsRef.current) { 
                setCursorType("default");
                return; // Ignore movement in the first 6vh
            }
            
            const isLeft = e.clientX < screenWidth / 2;
            const isRight = e.clientX >= screenWidth / 2;

            if (isLeft && frameRef.current === 0) { 
                setCursorType("default");
                return; // Ignore movement in the first 6vh
            }
            if (isRight && frameRef.current === maxFrame-1) { 
                setCursorType("default");
                return; // Ignore movement in the first 6vh
            }
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
            (frame === 0 || frame === 1 || frame === 2 || frame === 3) ||
            (frame === 4 && opacityCounter.Principle >= maxCounters.Principle) ||
            (frame === 5 && opacityCounter.Perspective >= maxCounters.Perspective) ||
            (frame === 6 && opacityCounter.Dimension >= maxCounters.Dimension) ||
            (frame === 7 || frame === 8 || frame === 9 || frame === 10 || 
            frame === 11 || frame === 12 || frame === 13 || frame === 14 ||
            frame === 15 || frame === 16);
        
        if (isComplete && !showSkipButtons) {
            setListenersActive(true);
        } else {
            setListenersActive(false);
        }
    }, [opacityCounter, frame, maxCounters, showSkipButtons]);

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
        if (frame === maxFrame) {
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
        17: 'intro-17'

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

    // Function to sequentially light up "Principle" buttons
    function startRandomComponentsCounter() {
        setTimeout(() => {
            setRandomComponents(['P2', 'P3', 'P4', 'P6', 'Pe1', 'Pe4', 'Pe5', 'Pe7', 'D3', 'D5', 'D7', 'D8', 'D10']);
        }, 2000); // Delay for each button (3 seconds between each)
    }

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (frame === 0) {
            const title = introTexts.Title;
            return <>{replaceBolds(title, "i-title-container", "i-welcome", "i-title")}</>;
        } else if (frame === 1) {
            const introDef = introTexts.IntroDef;
            return (
                <div className='i-explanation-container'>
                    <div className='i-explanation'>AA</div>
                </div>
            );
        } else if (frame === 2) {
            const introWho = introTexts.IntroWho;
            return (
                <div className='i-explanation-container'>
                    <div className='i-explanation'>BB</div>
                </div>
            );
        } else if (frame === 3) {
            const introSubject = introTexts.IntroSubject;
            return (
                <div className='i-explanation-container'>
                    <div className='i-explanation'>CC</div>
                </div>
            );
        } else if (frame === 4) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const defineP = introTexts.DefineP;
            return (
                <div className="i-text-container">
                    <div className='i-text colored'>DD</div>
                </div>
            );
        } else if (frame === 5) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const clarifyP = introTexts.ClarifyP;
            return (
                <div className="i-text-container">
                    <div className='i-text'>DD</div>
                    <div className='i-text colored'>EE</div>
                </div>
            );
        } else if(frame === 6) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const definePe = introTexts.DefinePe;
            return (
                <div className="i-text-container">
                    <div className='i-text'>DD</div>
                    <div className='i-text'>EE</div>
                    <div className='i-text colored'>FF</div>
                </div>
            );
        } else if(frame === 7) {
            const clarifyPe = introTexts.ClarifyPe;
            return (
                <div className="i-text-container">
                    <div className='i-text'>DD</div>
                    <div className='i-text'>EE</div>
                    <div className='i-text'>FF</div>
                </div>
            );
        } else if(frame === 8) {
            const defineD = introTexts.DefineD;
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            return (
                <div className="i-text-container">
                    <div className='i-text colored'>GG</div>
                </div>
            );
        } else if(frame === 9) {
            const clarifyD = introTexts.ClarifyD;
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            return (
                <div className="i-text-container">
                    <div className='i-text colored'>HH</div>
                </div>
            );
        } else if(frame === 10) {
            const clarifyD = introTexts.ClarifyD;
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            return (
                <div className="i-text-container">
                    <div className='i-text colored'>II</div>
                </div>
            );
        } else if(frame === 11) {
            const clarifyD = introTexts.ClarifyD;
            return (
                <div className="i-text-container">
                    <div className='i-text'>KK</div>
                </div>
            );
        } else if(frame === 12) {
            const clarifyD = introTexts.ClarifyD;
            return (
                <div className="i-text-container">
                    <div className='i-text'>LL</div>
                </div>
            );
        } else if(frame === 13) {
            const clarifyD = introTexts.ClarifyD;
            return (
                <div className="i-explanation-container">
                    <div className='i-explanation'>MM</div>
                </div>
            );
        } else if(frame === 14) {
            startRandomComponentsCounter();
            const clarifyD = introTexts.ClarifyD;
            return (
                <div className="i-explanation-container">
                    <div className='i-explanation'>NN</div>
                </div>
            );
        } else if(frame === 15) {
            const clarifyD = introTexts.ClarifyD;
            return (
                <div className="i-explanation-container">
                    <div className='i-explanation'>OO</div>
                </div>
            );
        } else if(frame === 16) {
            const clarifyD = introTexts.ClarifyD;
            return (
                <div className="i-explanation-container">
                    <div className='i-explanation'>PP</div>
                </div>
            );
        }   
        
    };

    const toggleSkipButton = () => {
        setFrame(maxFrame);
    };

    const toggleStartButton = () => {
        setFrame(maxFrame);
    };

    const toggleDontSkipButton = () => {
        setShowSkipButtons(false);
        showSkipButtonsRef.current = false;
        setFrame(1);
        frameRef.current = 1;
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

            {showSkipButtons &&
                <div className='i-skip-buttons-container'>
                    <button
                        className={'i-dont-skip-button'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click from affecting parent
                            toggleDontSkipButton();
                        }}
                    >
                        WALK ME THROUGH IT
                    </button>
                    <div className='i-dont-skip-message'>
                        it only takes 2 minutes!
                    </div>

                    <button
                        className={'i-skip-button'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click from affecting parent
                            toggleSkipButton();
                        }}
                    >
                        SKIP INTRODUCTION
                    </button>
                </div>
            }
            {!showSkipButtons &&
            <>
                {frame !== 0 && (
                    <button className={`i-arrow-button left ${isHoverLeft ? "hover" : ""}`}>
                        <Arrow2Icon className="i-arrow-icon" />
                    </button>
                )}

                {frame !== maxFrame-1 && (
                    <button className={`i-arrow-button right ${isHoverRight ? "hover" : ""}`}>
                        <Arrow2Icon className="i-arrow-icon" />
                    </button>
                )}
            </>
            }
            {(frame <= 3 || frame >= 13) && 
                <div className='menu-background'></div>
            }
            {frame === maxFrame-1 && 
                <button
                className={'i-start-button'}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click from affecting parent
                    toggleStartButton();
                }}
            >
                YUP, LET'S START!
            </button>
            }
        </div>
    );
};

export default IntroPage;
