import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OLCompass from '../components/OLCompass';
import '../styles/InitialPage.css';

const InitialPage = ({ colors }) => {
    const [state, setState] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function

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
            navigate('/ol-compass/home');
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
            return (
                <>
                <div className='i-title-container'>
                    <p className='i-welcome'>WELCOME TO THE</p>
                    <p className='i-title'>OL-in-One Compass</p>
                </div>
                </>
            );
        } else if (state === 1) {
            return (
                <>
                <div className='i-explanation-container'>
                    <p className='i-explanation'>
                        Ocean Literacy (OL) 
                        <br></br>
                        is understanding our
                        <br></br>
                        influence on the Ocean, 
                        <br></br>
                        and the Ocean's 
                        <br></br>
                        influence on us.
                    </p>
                </div>
                </>
            );
        } else if (state === 2) {
            return (
                <>
                <div className='i-text-container'>
                    <p className='i-text'>OL is based on&nbsp;</p>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        7 Principles
                    </span>
                    <p className='i-text'>which summarize&nbsp;</p>
                    <p className='i-text'>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        45 scientific concepts
                    </span>
                    .
                    </p>
                </div>
                </>
            );
        } else if (state === 3) {
            return (
                <>
                <div className='i-text-container'>
                    <p className='i-text'>OL is based on&nbsp;</p>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        7 Principles
                    </span>
                    <p className='i-text'>which summarize&nbsp;</p>
                    <p className='i-text'>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        45 scientific concepts
                    </span>
                    .
                    </p>
                    <p className='i-text'>
                        Science is just one of the&nbsp;
                    <span className='i-text colored' style={{color: colors.Perspective}}>
                        7 Perspectives
                    </span>
                    </p>
                    <p className='i-text'>
                        from which OL can be seen.
                    </p>
                </div>
                </>
            );
        } else if (state === 4) {
            return (
                <>
                <div className='i-text-container'>
                    <p className='i-text'>OL is based on&nbsp;</p>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        7 Principles
                    </span>
                    <p className='i-text'>which summarize&nbsp;</p>
                    <p className='i-text'>
                    <span className='i-text colored' style={{color: colors.Principle}}>
                        45 scientific concepts
                    </span>
                    .
                    </p>
                    <p className='i-text'>
                        Science is just one of the&nbsp;
                    <span className='i-text colored' style={{color: colors.Perspective}}>
                        7 Perspectives
                    </span>
                    </p>
                    <p className='i-text'>
                        from which OL can be seen.
                    </p>
                    <p className='i-text'>
                        Knowledge is just one of the&nbsp;
                    <span className='i-text colored' style={{color: colors.Dimension}}>
                        10 Dimensions
                    </span>
                    </p>
                    <p className='i-text'>
                        through which OL can be pursued.
                    </p>
                </div>
                </>
            );
        }
    };

    return (
        <div>
            <OLCompass colors={colors} action={action} />
            {getDisplayText()}    
        </div>
    );
};

export default InitialPage;
