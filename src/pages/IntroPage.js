import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Compass from '../components/Compass.js';
import { getIntroTexts, getLabelsTexts } from '../utils/DataExtraction.js';
import { replaceBoldsBreaks, replaceBoldsBreaksPlaceholders, replaceBoldsItalicBreaks1, replaceBoldsItalicBreaks2, replaceHighlightsBoldsPlaceholdersItalics, replaceHighlightsBoldsPlaceholders } from '../utils/TextFormatting.js';
import { ReactComponent as Arrow2Icon } from '../assets/icons/arrow2-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import Frame11Image from '../assets/images/intro/frame-11.png';
import Frame12Image from '../assets/images/intro/frame-12.png';

import '../styles/pages/IntroPage.css';

const IntroPage = () => {
    const {
        colors,
        language,
        setLanguage,
        opacityCounter,
        firstUse,
        setFirstUse,
        setRandomComponents
      } = useContext(StateContext);

    const introTexts = getIntroTexts(language);
    const labelsTexts = getLabelsTexts(language, "intro");
    const [frame, setFrame] = useState(0);
    const [isHoverLeft, setIsHoverLeft] = useState(false);
    const [isHoverRight, setIsHoverRight] = useState(false);
    const [cursorType, setCursorType] = useState("default");
    const [showSkipButtons, setShowSkipButtons] = useState(true);
    const [clickLocked, setClickLocked] = useState(false);

    const navigate = useNavigate(); // Initialize the navigate function

    const showSkipButtonsRef = useRef(showSkipButtons);
    const frameRef = useRef(frame);
    const maxFrame = 16;
    const firstUseRef = useRef(firstUse);
    const timeoutRef = useRef(null);

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
        firstUseRef.current = firstUse;
    }, [firstUse]);

    useEffect(() => {
        frameRef.current = frame;
    }, [frame]);

    useEffect(() => {
        if (frame === 14) {
            if (timeoutRef.current) clearInterval(timeoutRef.current); // Clear any previous intervals
    
            let toggle = false; // Track which set to use
            timeoutRef.current = setInterval(() => {
                setRandomComponents(toggle 
                    ? ['P2', 'P3', 'P4', 'P6', 'Pe1', 'Pe4', 'Pe5', 'Pe7', 'D3', 'D5', 'D7', 'D8', 'D10']
                    : ['P1', 'P3', 'P5', 'P6', 'Pe3', 'Pe4', 'Pe6', 'D1', 'D3', 'D4', 'D6', 'D8']
                );
                toggle = !toggle; // Switch for next interval
            }, 1200); // Change every second
    
            return () => clearInterval(timeoutRef.current); // Cleanup when frame changes
        }
    }, [frame, setRandomComponents]); // Runs only when `frame` changes
    
    document.documentElement.style.setProperty('--highlightP-color-intro', colors['Intro Text']['Principle']);
    document.documentElement.style.setProperty('--highlightPe-color-intro', colors['Intro Text']['Perspective']);
    document.documentElement.style.setProperty('--highlightD-color-intro', colors['Intro Text']['Dimension']);

    // Handlers
    const handleNext = useCallback(() => {
        if(frameRef.current === 3 && !firstUseRef.current['intro']) {
            setFrame(8);
            frameRef.current = 8; // Update the ref
        } else {
            setFrame((prevFrame) => {
                const newFrame = prevFrame + 1 <= maxFrame ? prevFrame + 1 : maxFrame;
                frameRef.current = newFrame; // Update the ref
                return newFrame;
            });
        }
    }, [maxFrame]);
    
    const handlePrev = useCallback(() => {
        if(frameRef.current === 8) {
            setFrame(3)
            frameRef.current = 3; // Update the ref
        } else {
            setFrame((prevFrame) => {
                const newFrame = prevFrame - 1 >= 0 ? prevFrame - 1 : 0;
                frameRef.current = newFrame; // Update the ref
                return newFrame;
            });
        }
    }, []);
    
    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            handleNext()
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            handlePrev()
    }, [handleNext, handlePrev]);

    // useCallback ensures handleClick doesn't change unless its dependencies do
    const handleClick = useCallback((e) => {
        if (clickLocked) return;
        setClickLocked(true);
        
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
        
        if (clickPositionX > screenWidth / 2 && (frameRef.current === maxFrame-1 || frameRef.current === 4 || frameRef.current === 5 || frameRef.current === 6 || frameRef.current === 7)) 
            return; // Ignore movement in the first 6vh
        
        if (clickPositionY < ignoreHeight) return; // Ignore clicks/touches in the first 6vh

        if (clickPositionX > screenWidth / 2) {
            handleNext();
        } else {
            handlePrev();
        }
        setTimeout(() => setClickLocked(false), 300); // Prevent spamming
    }, [handleNext, handlePrev, clickLocked]);

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

            if (isLeft && (frameRef.current === 0 || frameRef.current === 4 || frameRef.current === 5 || frameRef.current === 6 || frameRef.current === 7)) { 
                setCursorType("default");
                return; // Ignore movement in the first 6vh
            }
            if (isRight && (frameRef.current === maxFrame-1 || frameRef.current === 4 || frameRef.current === 5 || frameRef.current === 6 || frameRef.current === 7)) { 
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
            (frameRef.current === 0 || frameRef.current === 1 || frameRef.current === 2 || frameRef.current === 3) ||
            (frameRef.current === 8 || frameRef.current === 9 || frameRef.current === 10 || 
            frameRef.current === 11 || frameRef.current === 12 || frameRef.current === 13 || frameRef.current === 14 ||
            frameRef.current === 15 || frameRef.current === 16);
        
        if (isComplete && !showSkipButtons && frameRef.current !== 4 && frameRef.current !== 5 && frameRef.current !== 6 && frameRef.current !== 7) {
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
        if (frameRef.current === maxFrame) {
            navigate('/home');
        }
    }, [frame, navigate]); // Trigger navigation when state changes to 6

    useEffect(() => {
        if (frameRef.current === 8) {
            setFirstUse(prevState => {
                const newState = {
                    ...prevState, // Keep all existing attributes
                    intro: false  // Update only 'learn'
                };
                firstUseRef.current = newState;
                return newState;
            });
        }
    }, [frame, setFirstUse]);
    
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
    const mode = actionMap[frameRef.current];

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (frame === 0) {
            return (
                <div className="i-title-container">
                    {replaceBoldsBreaks(introTexts.Frame0, 'i-welcome', 'i-title')}
                </div>
            );
        } else if (frame === 1) {
            return (
                <div className='i-explanation-container'>
                    {replaceBoldsItalicBreaks1(introTexts.Frame1, 'i-explanation', 'i-explanation bold', 'i-explanation italic')}
                </div>
            );
        } else if (frame === 2) {
            return (
                <div className='i-explanation-container'>
                    {replaceBoldsItalicBreaks1(introTexts.Frame2, 'i-explanation', 'i-explanation bold', 'i-explanation italic')}
                </div>
            );
        } else if (frame === 3) {
            return (
                <div className='i-explanation-container'>
                    {replaceBoldsItalicBreaks1(introTexts.Frame3, 'i-explanation', 'i-explanation bold', 'i-explanation italic')}
                </div>
            );
        } else if (frame === 4) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            if (timeoutRef.current) 
                clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setFrame(5);
                frameRef.current = 5;
                timeoutRef.current = null; // Reset after execution
            }, 1200);

            return <>{replaceBoldsBreaksPlaceholders(introTexts.Frame4, "i-text-container", "i-text", "i-text colored", null)}</>;
        } else if (frame === 5) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            if (timeoutRef.current) 
                clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setFrame(6);
                frameRef.current = 6;
                timeoutRef.current = null; // Reset after execution
            }, 1200);
            
            return <>{replaceBoldsBreaksPlaceholders(introTexts.Frame5, "i-text-container", "i-text", "i-text colored", null)}</>;
        } else if(frame === 6) {
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setFrame(7);
                frameRef.current = 7;
                timeoutRef.current = null; // Reset after execution
            }, 1200);
            return <>{replaceBoldsBreaksPlaceholders(introTexts.Frame6, "i-text-container", "i-text", "i-text colored", null)}</>;
        } else if(frame === 7) {
            if (timeoutRef.current) 
                clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setFrame(8);
                frameRef.current = 8;
                timeoutRef.current = null; // Reset after execution
            }, 1200);

            return <>{replaceBoldsBreaksPlaceholders(introTexts.Frame7, "i-text-container", "i-text", "i-text", null)}</>;
        } else if(frame === 8) {
            return (
                <div className="i-text-container">
                    {replaceHighlightsBoldsPlaceholders(introTexts.Frame8, 'i-text', 'i-text bold', 'i-text hP', 'i-text hPe', 'i-text hD', null)}
                </div>
            );
        } else if(frame === 9) {
            return (
                <div className="i-text-container">
                    {replaceHighlightsBoldsPlaceholders(introTexts.Frame9, 'i-text', 'i-text bold', 'i-text hP', 'i-text hPe', 'i-text hD', null)}
                </div>
            );
        } else if(frame === 10) {
            return (
                <div className="i-text-container">
                    {replaceHighlightsBoldsPlaceholders(introTexts.Frame10, 'i-text', 'i-text bold', 'i-text hP', 'i-text hPe', 'i-text hD', null)}
                </div>
            );
        } else if(frame === 11) {
            return (
                <div className="i-text-container">
                    {replaceBoldsItalicBreaks2(introTexts.Frame11, 'i-text', 'i-text bold', 'i-text italic')}
                </div>
            );
        } else if(frame === 12) {
            return (
                <div className="i-text-container">
                    {replaceHighlightsBoldsPlaceholdersItalics(introTexts.Frame12, 'i-text', 'i-text bold', 'i-text hP', 'i-text hPe', 'i-text hD', 'i-text hP italic', 'i-text hPe italic', 'i-text hD italic', null)}
                </div>
            );
        } else if(frame === 13) {
            return (
                <div className="i-explanation-container">
                    {replaceBoldsItalicBreaks2(introTexts.Frame13, 'i-explanation', 'i-explanation bold', 'i-explanation italic')}
                </div>
            );
        } else if(frame === 14) {
            return (
                <div className="i-explanation-container">
                    {replaceBoldsItalicBreaks2(introTexts.Frame14, 'i-explanation', 'i-explanation bold italic', 'i-explanation italic')}
                </div>
            );
        } else if(frame === 15) {
            return (
                <div className="i-explanation-container">
                    {replaceBoldsItalicBreaks2(introTexts.Frame15, 'i-explanation', 'i-explanation bold', 'i-explanation italic')}
                </div>
            );
        }
    };

    const toggleSkipButton = () => {
        setFrame(maxFrame);
        frameRef.current = maxFrame;
    };

    const toggleStartButton = () => {
        setFrame(maxFrame);
        frameRef.current = maxFrame;
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
                        {labelsTexts["walk-me-through-it"]}
                    </button>
                    <div className='i-dont-skip-message'>
                        {labelsTexts["only-2-minutes"]}
                    </div>

                    <button
                        className={'i-skip-button'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click from affecting parent
                            toggleSkipButton();
                        }}
                    >
                        {labelsTexts["skip-introduction"]}
                    </button>
                </div>
            }
            {!showSkipButtons &&
            <>
                {frame !== 0 && frame !== 4 && frame !== 5 && frame !== 6 && frame !== 7 && (
                    <button className={`i-arrow-button left ${isHoverLeft ? "hover" : ""}`}>
                        <Arrow2Icon className="i-arrow-icon" />
                    </button>
                )}

                {frame !== maxFrame-1 && frame !== 4 && frame !== 5 && frame !== 6 && frame !== 7 && (
                    <button className={`i-arrow-button right ${isHoverRight ? "hover" : ""}`}>
                        <Arrow2Icon className="i-arrow-icon" />
                    </button>
                )}
            </>
            }
            {(frame <= 3 || frame >= 13) && 
                <div className='menu-background'></div>
            }
            {frame === 11 && 
                <div className="i-frame-11-container">
                    <div className='i-frame-11-image-container'>
                        <img 
                            src={Frame11Image} 
                            alt={'OL Timeline'} 
                            className="i-frame-11-image" 
                        />
                    </div>
                    <div className='i-frame-11-text'>
                        <div className='i-frame-11-line'>
                            {labelsTexts["timeline-2005"]}
                        </div>
                        <div className='i-frame-11-line'>
                            {labelsTexts["timeline-2017"]}
                        </div>
                        <div className='i-frame-11-line'>
                            {labelsTexts["timeline-2022"]}
                        </div>
                    </div>
                </div>
            }
            {frame === 12 && 
                <div className="i-frame-12-container">
                    <div className='i-frame-12-image-container'>
                        <img 
                            src={Frame12Image} 
                            alt={'What/How'} 
                            className="i-frame-12-image" 
                        />
                    </div>
                    <div className='i-frame-12-text'>
                        <div className='i-frame-12-line-1'>
                            {labelsTexts["questions-what"]}
                        </div>
                        <div className='i-frame-12-line-2'>
                            {labelsTexts["questions-do-you-want"]}
                        </div>
                        <div className='i-frame-12-line-3'>
                            {labelsTexts["questions-from-what-angle"]}
                        </div>
                        <div className='i-frame-12-line-4'>
                            {labelsTexts["questions-how"]}
                        </div>
                    </div>
                </div>
            }
            {frame === maxFrame-1 && 
                <button
                className={'i-start-button'}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click from affecting parent
                    toggleStartButton();
                }}
            >
                {labelsTexts["yup-lets-start"]}
            </button>
            }
        </div>
    );
};

export default IntroPage;
