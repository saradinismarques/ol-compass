import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OLCompass from '../components/OLCompass';
import '../styles/InitialPage.css';

const colors = {
    Principle: "#41ffc9",
    Perspective: "#41e092",
    Dimension: "#41c4e0"
};

const InitialPage = () => {
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
                        is the understating of
                        <br></br>
                        the Ocean-humanity 
                        <br></br>
                        mutual influence.
                    </p>
                </div>
                </>
            );
        } else if (state === 2) {
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
                </div>
                </>
            );
        } else if (state === 3) {
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
                </div>
                </>
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
