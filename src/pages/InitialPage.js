import React, { useEffect } from 'react';
import OLDiagram from '../components/OLDiagram'
import '../styles/Text.css';

const InitialPage = ({colors}) => {
    const initialText = {
        title: 'THE OL-in-One Compass',
        explanation: 'Ocean Literacy (OL) is the understanding of the Ocean-humanity mutual influence.',
        textPrinciples: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        textConcepts: 'Click on any element',
        textPerspectives: 'Click on any element',
        textDimensions: 'Click on any element'
    };

    // Function to handle key presses
    const handleKeyPress = (event) => {
        console.log(`Key pressed: ${event.key}`);
        // You can add more logic here based on the key pressed
    };

    useEffect(() => {
        // Add the event listener when the component mounts
        window.addEventListener('keydown', handleKeyPress);

        // Remove the event listener when the component unmounts
        return () => {
        window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

    
    return (
        <div>

            <OLDiagram size="450" colors={colors} position="center" buttonsActive={false}/>
        </div>
    );
};

export default InitialPage;