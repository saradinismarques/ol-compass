import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OLDiagram from '../components/OLDiagram';
import '../styles/Text.css';

const InitialPage = ({ colors }) => {
    const texts = {
        title: 'THE',
        title2: 'OL-in-One Compass',
        explanation: 'Ocean Literacy (OL) is the understanding of the Ocean-humanity mutual influence.',
        textPrinciples: 'OL is based on ',
        textPrinciplesColored: '7 principles',
        textConcepts: ' which summarize ',
        textConceptsColored: '45 scientific concepts',
        textConcepts2: '.',
        textPerspectives: ' Science is just one of the ',
        textPerspectivesColored: '7 Perspectives',
        textPerspectives2: ' from which OL can be expressed.',
        textDimensions: ' As Knowledge is one of the ',
        textDimensionsColored: '10 Dimensions',
        textDimensions2: ' through which OL can be pursued.'
    };

    const [state, setState] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function

    // useCallback ensures handleKeyPress doesn't change unless its dependencies do
    const handleKeyPress = useCallback(() => {
        setState((prevState) => prevState + 1);
    }, []);

    useEffect(() => {
        // Add the event listener when the component mounts
        window.addEventListener('keydown', handleKeyPress);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]); // Add handleKeyPress to the dependency array

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

    return (
        <div>
            <OLDiagram size="450" colors={colors} position="center" action={action} buttonsActive={false} />
            <p className='title-deter-initial'>{texts.title}</p>
            <div className='initial-container'>
                <p className='title-initial'>{texts.title2}</p>
            </div>
        </div>
    );
};

export default InitialPage;
