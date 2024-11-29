import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OLCompass from '../components/OLCompass';
import '../styles/InitialPage.css';

const InitialPage = ({ colors }) => {
    const [frame, setFrame] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function
    
    const initialCounters = {
        Principle: 0,
        Perspective: 0,
        Dimension: 0
    }

    const [opacityCounter, setOpacityCounter] = useState(initialCounters);
    const maxCounters = useMemo(() => ({
        Principle: 6,
        Perspective: 6,
        Dimension: 9
    }), []);

    const [listenersActive, setListenersActive] = useState(true);

    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            setFrame((prevState) => (prevState + 1 <= 8 ? prevState + 1 : 8));
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            setFrame((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
    }, []);

    // useCallback ensures handleClick doesn't change unless its dependencies do
    const handleClick = useCallback((e) => {
        const screenWidth = window.innerWidth;
        const clickPositionX = e.clientX;

        if (clickPositionX > screenWidth / 2) {
            setFrame((prevState) => (prevState + 1 <= 8 ? prevState + 1 : 8));
        } else {
            setFrame((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
        }
    }, []);

    useEffect(() => {   
        const isComplete =
            (frame === 0 || frame === 1) ||
            ((frame === 2 || frame === 3) && opacityCounter.Principle >= maxCounters.Principle) ||
            ((frame === 4 || frame === 5) && opacityCounter.Perspective >= maxCounters.Perspective) ||
            ((frame === 6 || frame === 7) && opacityCounter.Dimension >= maxCounters.Dimension);
        
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
        if (frame === 8) {
            navigate('/home');
        }
    }, [frame, navigate]); // Trigger navigation when state changes to 6

    // Define the action based on the current state
    const actionMap = {
        0: 'initial-0',
        1: 'initial-1',
        2: 'initial-2',
        3: 'initial-3',
        4: 'initial-4',
        5: 'initial-5',
        6: 'initial-6',
        7: 'initial-7',
        8: 'initial-8',
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
                [type]: opacityCounter[type]+1
            });
        }, 300); // Delay for each button (3 seconds between each)
    }

    const getOpacityCounter = () => {
        if(frame === 2 || frame === 3) 
            return opacityCounter['Principle'];
        else if(frame === 4 || frame === 5)
            return opacityCounter['Perspective'] + 7;
        else if(frame === 6 || frame === 7)
            return opacityCounter['Dimension'] + 14;
    }

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (frame === 0) {
            return (
                <>
                <div className='i-title-container'>
                    <p className='i-welcome'>WELCOME TO THE</p>
                    <p className='i-title'>OL-in-One Compass</p>
                </div>
                </>
            );
        } else if (frame === 1) {
            return (
                <>
                <div className='i-explanation-container'>
                    <p className='i-explanation'>
                         Ocean Literacy (OL) 
                        <br></br>

                        is the understanding of 
                        <br></br>

                        the Ocean-humanity  
                        <br></br>

                        mutual influence
                    </p>
                </div>
                </>
            );
        } else if (frame === 2) {
            startOpacityCounter('Principle');
            document.documentElement.style.setProperty('--initial-text-color', colors['Initial Text']['Principle']);
            
            return (
                <>
                <div className='i-text-container'>
                    <span className='i-text'>Ocean Literacy (OL) </span>
                    <br></br>

                    <span className='i-text'>is based on </span>
                    <br></br>

                    <span className='i-text colored'>
                        {opacityCounter['Principle']+1} Scientific 
                    </span>
                    <br></br>

                    <span className='i-text colored'> Principles</span>
                    <span className='i-text'>
                    .
                    </span>
                </div>
                </>
            );
        } else if (frame === 3) {
                startOpacityCounter('Principle');
                document.documentElement.style.setProperty('--initial-text-color', colors['Initial Text']['Principle']);

                return (
                    <>
                    <div className='i-text-container'>
                        <span className='i-text'>See Principles as the </span>
                        <br></br>
                        
                        <span className='i-text'>7 </span>
                        <span className='i-text colored'>
                            macro traits                
                        </span>
                        <br></br>

                        <span className='i-text'> of the Ocean.</span>
                    </div>
                    </>
                );
        } else if(frame === 4) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--initial-text-color', colors['Initial Text']['Perspective']);
            
            return (
                <>
                <div className='i-text-container'>
                    <span className='i-text'>Ocean knowledge </span>
                    <br></br>
                    
                    <span className='i-text'>can be seen through </span>
                    <br></br>
                    
                    <span className='i-text colored'>
                        {opacityCounter['Perspective']+1} Perspectives
                    </span>
                    <span className='i-text'>
                    .
                    </span>
                </div>
                </>
            );
        } else if(frame === 5) {
            startOpacityCounter('Perspective');
            document.documentElement.style.setProperty('--initial-text-color', colors['Initial Text']['Perspective']);

            return (
                <>
                <div className='i-text-container'>
                    <span className='i-text'>See Perspectives as </span>
                    <br></br>
                    
                    <span className='i-text'>the 7 </span>
                    <span className='i-text colored'>
                        points of view
                    </span>
                    <br></br>

                    <span className='i-text'> from which Ocean </span>
                    <br></br>

                    <span className='i-text'>features and challenges </span>
                    <br></br>

                    <span className='i-text'>can be explained </span>
                    <br></br>

                    <span className='i-text'>and contextualised.</span>

                </div>
                </>
            );
        } else if(frame === 6) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--initial-text-color', colors['Initial Text']['Dimension']);
            
            return (
                <>
                <div className='i-text-container'>
                    <span className='i-text'>Ocean knowledge </span>
                    <br></br>

                    <span className='i-text'>can be conveyed </span>
                    <br></br>

                    <span className='i-text'>through </span>
                    <span className='i-text colored'>
                        {opacityCounter['Dimension']+1} Dimensions
                    </span>
                    <span className='i-text'>
                    .
                    </span>
                </div>
                </>
            );
        } else if(frame === 7) {
            startOpacityCounter('Dimension');
            document.documentElement.style.setProperty('--initial-text-color', colors['Initial Text']['Dimension']);

            return (
                <>
                <div className='i-text-container'>
                    <span className='i-text'>See Dimensions as </span>
                    <br></br>
                    
                    <span className='i-text'>the 10 </span>
                    <span className='i-text colored'>
                        approaches
                    </span>
                    <br></br>
                    
                    <span className='i-text'> that can be adopted </span>
                    <br></br>
                    
                    <span className='i-text'>to transfer </span>
                    <br></br>
                   
                    <span className='i-text'>OL Principles </span>
                    <br></br>
                    
                    <span className='i-text'>and Perspectives.</span>
                </div>
                </>
            );
        } 
    };

    return (
        <div>
            <OLCompass 
                colors={colors}
                mode={mode} 
                position="center"
                opacityCounter={getOpacityCounter()}
            /> 
            {getDisplayText()}    
        </div>
    );
};

export default InitialPage;