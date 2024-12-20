import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OLCompass from '../components/OLCompass';
import { getIntroTexts } from '../utils/Data.js';
import { formatText } from '../utils/Text.js';
import '../styles/pages/IntroPage.css';
import { StateContext } from "../State";

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
            setFrame((prevState) => (prevState + 1 <= 10 ? prevState + 1 : 10));
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            setFrame((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
    }, []);

    // useCallback ensures handleClick doesn't change unless its dependencies do
    const handleClick = useCallback((e) => {
        const screenWidth = window.innerWidth;
        const clickPositionX = e.clientX;

        if (clickPositionX > screenWidth / 2) {
            setFrame((prevState) => (prevState + 1 <= 10 ? prevState + 1 : 10));
        } else {
            setFrame((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
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

    // Replace placeholders with values from countersMap
    // const replacePlaceholders = (text) => {
    //     return text.replace(/\[COUNTER-[a-zA-Z]+\]/g, (match) => {
    //         // Look up the placeholder in countersMap
    //         return countersMap[match] !== undefined ? countersMap[match] : match;
    //     });
    // };

    // const formatText = (text) => {
    //     // Process the input to replace placeholders
    //     let textWithouPlaceholders = text;

    //     if(frame === 4 || frame === 6 || frame === 8)
    //         textWithouPlaceholders = replacePlaceholders(text);

    //     // Split the string by the <br> tag to handle line breaks
    //     const parts = textWithouPlaceholders.split('<br>').map(part => part.trim()).filter(part => part !== "");
    //     let isInsideColoredBlock = false; // Tracks if we are inside a <c> block
        
    //     return (
    //         <div className="i-text-container">
    //             <p>
    //                 {parts.map((part, index) => {
    //                     let elements = []; // Collect parts of the current line
    //                     let remainingText = part;
        
    //                     // Handle coloring for <c> and </c> tags within the part
    //                     while (remainingText) {
    //                         // Check for <c> and </c> tags
    //                         const startC = remainingText.indexOf('<b>');
    //                         const endC = remainingText.indexOf('</b>');
        
    //                         if (startC !== -1 && (endC === -1 || startC < endC)) {
    //                             // Text before <c> (if any)
    //                             if (startC > 0) {
    //                                 elements.push(
    //                                     <span key={`text-before-c-${index}`} className="i-text">
    //                                         {remainingText.slice(0, startC)}
    //                                     </span>
    //                                 );
    //                             }
    //                             // Move inside <c>
    //                             isInsideColoredBlock = true;
    //                             remainingText = remainingText.slice(startC + 3); // Remove `<c>`
    //                         } else if (endC !== -1) {
    //                             // Inside <c>: Text up to </c>
    //                             if (isInsideColoredBlock) {
    //                                 elements.push(
    //                                     <span key={`text-inside-c-${index}`} className="i-text colored">
    //                                         {remainingText.slice(0, endC)}
    //                                     </span>
    //                                 );
    //                             }
    //                             // Exit <c>
    //                             isInsideColoredBlock = false;
    //                             remainingText = remainingText.slice(endC + 4); // Remove `</c>`
    //                         } else {
    //                             // No <c> or </c>: Handle remaining text
    //                             elements.push(
    //                                 <span key={`text-default-${index}`} className={`i-text ${isInsideColoredBlock ? 'colored' : ''}`}>
    //                                     {remainingText}
    //                                 </span>
    //                             );
    //                             remainingText = ""; // All done for this part
    //                         }
    //                     }
        
    //                     return (
    //                         <React.Fragment key={index}>
    //                             {elements}
    //                             {/* Add <br /> for line breaks */}
    //                             {index < parts.length - 1 && <br />}
    //                         </React.Fragment>
    //                     );
    //                 })}
    //             </p>
    //         </div>
    //     );
    // };

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (frame === 0) {
            // Split the title by the <b> tag and render parts in different components
            const title = introTexts.Title;
            // Split the title by <b> tags and ensure we only get the relevant parts
            const parts = title.split(/(<b>.*?<\/b>)/).filter(part => part.trim() !== "");

            return (
                <div className="i-title-container">
                    {parts.map((part, index) => {
                        if (part.startsWith('<b>')) {
                            // Remove the <b> tags and render the text inside it with class "i-title"
                            const cleanText = part.replace(/<\/?b>/g, ''); // Remove <b> and </b>
                            return <p key={index} className="i-title">{cleanText}</p>;
                        } else {
                            // Render the normal text parts inside a <p> with class "i-welcome"
                            return <p key={index} className="i-welcome">{part}</p>;
                        }
                    })}
                </div>
            );
        } else if (frame === 1) {
            const introDef = introTexts.IntroDef;
            // Split the string by the <br> tag to handle each segment
            const parts = introDef.split('<br>').map(part => part.trim()).filter(part => part !== "");

            return (
                <div className="i-explanation-container">
                    {parts.map((part, index) => {
                        return (
                            <p key={index} className="i-explanation">
                                {part}
                            </p>
                        );
                    })}
                </div>
            );
        } else if (frame === 2) {
            const introWho = introTexts.IntroWho;
            // Split the string by the <br> tag to handle each segment
            const lineParts = introWho.split('<br>').map(part => part.trim()).filter(part => part !== "");

            return (
                <div className="i-explanation-container">
                    {lineParts.map((line, lineIndex) => {
                        // Split by <b> tags within each line
                        const parts = line.split(/(<b>.*?<\/b>)/g);
        
                        return (
                            <p key={lineIndex} className="i-explanation smaller">
                                {parts.map((part, partIndex) => {
                                    // Check if the part is bold text
                                    if (part.startsWith('<b>') && part.endsWith('</b>')) {
                                        // Extract bold content
                                        const boldText = part.replace('<b>', '').replace('</b>', '');
                                        return (
                                            <strong key={partIndex} className="i-bold-text">
                                                {boldText}
                                            </strong>
                                        );
                                    } else {
                                        // Render normal text
                                        return <span key={partIndex}>{part}</span>;
                                    }
                                })}
                            </p>
                        );
                    })}
                </div>
            );
        } else if (frame === 3) {
            const introSubject = introTexts.IntroSubject;
            // Split the string by the <br> tag to handle each segment
            const lineParts = introSubject.split('<br>').map(part => part.trim()).filter(part => part !== "");

            return (
                <div className="i-explanation-container">
                    {lineParts.map((line, lineIndex) => {
                        // Split by <b> tags within each line
                        const parts = line.split(/(<b>.*?<\/b>)/g);
        
                        return (
                            <p key={lineIndex} className="i-explanation smaller">
                                {parts.map((part, partIndex) => {
                                    // Check if the part is bold text
                                    if (part.startsWith('<b>') && part.endsWith('</b>')) {
                                        // Extract bold content
                                        const boldText = part.replace('<b>', '').replace('</b>', '');
                                        return (
                                            <strong key={partIndex} className="i-bold-text">
                                                {boldText}
                                            </strong>
                                        );
                                    } else {
                                        // Render normal text
                                        return <span key={partIndex}>{part}</span>;
                                    }
                                })}
                            </p>
                        );
                    })}
                </div>
            );
        } else if (frame === 4) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const defineP = introTexts.DefineP;
            
            return <>{formatText(defineP, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if (frame === 5) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Principle']);
            const clarifyP = introTexts.ClarifyP;

            return <>{formatText(clarifyP, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if(frame === 6) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const definePe = introTexts.DefinePe;
            
            return <>{formatText(definePe, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if(frame === 7) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Perspective']);
            const clarifyPe = introTexts.ClarifyPe;
            
            return <>{formatText(clarifyPe, "i-text-container", "i-text", "i-text colored", countersMap)}</>;

        } else if(frame === 8) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const defineD = introTexts.DefineD;
            
            return <>{formatText(defineD, "i-text-container", "i-text", "i-text colored", countersMap)}</>;
            
        } else if(frame === 9) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--intro-text-color', colors['Intro Text']['Dimension']);
            const clarifyD = introTexts.ClarifyD;

            return <>{formatText(clarifyD, "i-text-container", "i-text", "i-text colored", countersMap)}</>;
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
