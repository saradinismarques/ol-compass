import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OLDiagram from '../components/OLDiagram';
import '../styles/Text.css';

const InitialPage = ({ colors }) => {
    const texts = {
        title: 'THE',
        title2: 'OL-in-One Compass',
        explanation: 'Ocean Literacy (OL) is the understanding of the Ocean-humanity mutual influence.',
        textPrinciples: 'OL is based on',
        textPrinciples2: '7 principles',
        textConcepts: ' which summarize ',
        textConcepts2: '45 scientific concepts',
        textConcepts3: '.',
        textPerspectives: 'Science is just one of the ',
        textPerspectives2: '7 Perspectives',
        textPerspectives3: ' from which OL can be expressed.',
        textDimensions: ' As Knowledge is one of the ',
        textDimensions2: '10 Dimensions',
        textDimensions3: ' through which OL can be pursued.'
    };

    const [state, setState] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function

    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') 
            setState((prevState) => prevState + 1);
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') 
            setState((prevState) => (prevState - 1 >= 0 ? prevState - 1 : 0));
    }, []);

    useEffect(() => {
        // Add the event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Add handleKeyPress to the dependency array

    useEffect(() => {
        if (state === 6) {
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
        6: 'initial-6',
    };

    // Determine the action based on the current state
    const action = actionMap[state];

    // Determine the text to display based on the current state
    const getDisplayText = () => {
        if (state === 0) {
            return (
                <>
                <p className='title-deter-initial'>THE</p>
                <div className='initial-title-container'>
                    <p className='title-initial'>OL-in-One Compass</p>
                </div>
                </>
            );
        } else if (state === 1) {
            return (
                <>
                <div className='initial-title-container'>
                    <p className='explanation-initial'>
                        Ocean Literacy (OL) is the understanding of the Ocean-humanity mutual influence.
                    </p>
                </div>
                </>
            );
        } else if (state === 2) {
            return (
                <>
                <div className='initial-text-container'>
                    <p className='text-initial'>OL is based on&nbsp;</p>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        7 principles
                    </span>
                </div>
                </>
            );
        } else if (state === 3) {
            return (
                <>
                <div className='initial-text-container'>
                    <p className='text-initial'>OL is based on&nbsp;</p>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        7 principles
                    </span>
                    <p className='text-initial'>which summarize&nbsp;</p>
                    <p className='text-initial'>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        45 scientific concepts
                    </span>
                    .
                    </p>
                </div>
                </>
            );
        } else if (state === 4) {
            return (
                <>
                <div className='initial-text-container'>
                    <p className='text-initial'>OL is based on&nbsp;</p>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        7 Principles
                    </span>
                    <p className='text-initial'>which summarize&nbsp;</p>
                    <p className='text-initial'>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        45 scientific concepts
                    </span>
                    .
                    </p>
                    <p className='text-initial'>
                        Science is just one of the&nbsp;
                    <span className='text-initial' style={{color: colors.Perspective, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        7 Perspectives
                    </span>
                    </p>
                    <p className='text-initial'>
                        from which OL can be expressed.
                    </p>
                </div>
                </>
            );
        } else if (state === 5) {
            return (
                <>
                <div className='initial-text-container'>
                    <p className='text-initial'>OL is based on&nbsp;</p>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        7 principles
                    </span>
                    <p className='text-initial'>which summarize&nbsp;</p>
                    <p className='text-initial'>
                    <span className='text-initial' style={{color: colors.Principle, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        45 scientific concepts
                    </span>
                    .
                    </p>
                    <p className='text-initial'>
                        Science is just one of the&nbsp;
                    <span className='text-initial' style={{color: colors.Perspective, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        7 Perspectives
                    </span>
                    </p>
                    <p className='text-initial'>
                        from which OL can be expressed.
                    </p>
                    <p className='text-initial'>
                        As Knowledge is one of the&nbsp;
                    <span className='text-initial' style={{color: colors.Dimension, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        10 Dimensions
                    </span>
                    </p>
                    <p className='text-initial'>x
                        through which OL can be pursued.
                    </p>
                </div>
                </>
            );
        }
    };

    return (
        <div>
            <OLDiagram size="450" colors={colors} position="center" action={action} buttonsActive={false} />
            {getDisplayText()}    
        </div>
    );
};

export default InitialPage;
