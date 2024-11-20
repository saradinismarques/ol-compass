import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OLCompass from '../components/OLCompass';
import { getIntroTexts } from '../utils/Data.js'; 
import '../styles/InitialPage.css';

const colors = {
    Principle: "#41ffc9",
    Perspective: "#41e092",
    Dimension: "#41c4e0"
};

const InitialPage = () => {
    const [state, setState] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function

    const introTexts = getIntroTexts();

    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            setState((prevState) => (prevState + 1 <= 5 ? prevState + 1 : 5));
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            setState((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
    }, []);

    // useCallback ensures handleClick doesn't change unless its dependencies do
    const handleClick = useCallback((e) => {
        const screenWidth = window.innerWidth;
        const clickPositionX = e.clientX;

        if (clickPositionX > screenWidth / 2) {
            setState((prevState) => (prevState + 1 <= 5 ? prevState + 1 : 5));
        } else {
            setState((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
        }
    }, []);

    useEffect(() => {
        // Add the event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClick);
        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClick);

        };
    }, [handleKeyDown, handleClick]); // Add handleKeyPress to the dependency array

    useEffect(() => {
        if (state === 5) {
            console.log("AAA")
            navigate('/home');
        }
    }, [state, navigate]); // Trigger navigation when state changes to 6

    // Define the action based on the current state
    const actionMap = {
        0: 'initial-0',
        1: 'initial-1',
        2: 'initial-2',
        3: 'initial-3',
        4: 'initial-4',
        5: 'initial-5',
    };

    // Determine the action based on the current state
    const action = actionMap[state];

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (state === 0) {
            // Split the title by the <b> tag and render parts in different components
            const title = introTexts['English'].Title;

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
        } else if (state === 1) {
            const introDef = introTexts['English'].IntroDef;

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
        } else if (state === 2) {
            const introP = introTexts['English'].IntroP;

            // Split the string by the <br> tag to handle line breaks
            const partsWithBr = introP.split('<br>').map(part => part.trim()).filter(part => part !== "");

            return (
                <div className="i-text-container">
                    {partsWithBr.map((part, index) => {
                        // Split the part further if it contains the <c> tag
                        const parts = part.split('<c>').map(p => p.trim()).filter(p => p !== "");
                        console.log(parts)
                        return (
                            <React.Fragment key={index}>
                                {parts.map((subPart, subIndex) => {
                                    // Check if the subPart contains the </c> tag (for coloring)
                                    if (subPart.includes('</c>')) {
                                        const [coloredText, rest] = subPart.split('</c>');
                                        return (
                                            <React.Fragment key={subIndex}>
                                                <span className="i-text colored" style={{ color: colors.Principle }}>
                                                    {coloredText}
                                                </span>
                                                <span className="i-text">
                                                    {rest}
                                                </span>
                                                <span className="i-text"> </span>
                                            </React.Fragment>
                                        );
                                    } else {
                                        return (
                                            <React.Fragment key={subIndex}>
                                                <span key={subIndex} className="i-text">
                                                    {subPart}
                                                </span>
                                                <span className="i-text"> </span>
                                            </React.Fragment>                                            
                                        );
                                    }
                                })}
                                {/* Add <br /> for line breaks */}
                                {index < partsWithBr.length - 1 && <br />}
                            </React.Fragment>
                        );
                    })}
                </div>
            );
        } else if (state === 4) {
            return (
                <>
                <div className='i-text-container'>
                    <span className='i-text'>Ocean Literacy is based on </span>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        7 scientific Principles
                    </span>
                    <span className='i-text'>
                    .
                    </span>
                    <p className='i-space'></p>
                    <span className='i-text'>Science is just one of the </span>
                    <span className='i-text colored' style={{color: colors.Perspective}}>
                        7 Perspectives
                    </span>
                    <span className='i-text'> from which OL can be seen.</span>
                    <p className='i-space'></p>
                    <span className='i-text'>Knowledge is just one of the </span>
                    <span className='i-text colored' style={{color: colors.Dimension}}>
                        10 Dimensions
                    </span>
                    <span className='i-text'> through which OL can be pursued.</span>
                </div>
                </>
            );
        }
    };

    return (
        <div>
            <OLCompass 
                action={action} 
                position="center"
            /> 
            {getDisplayText()}    
        </div>
    );
};

export default InitialPage;
