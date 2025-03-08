import React, { useCallback, useEffect, useContext } from 'react';
import { getModeTexts } from '../utils/DataExtraction.js'; 
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { ReactComponent as QuestionIcon } from '../assets/icons/question-icon.svg';
import { StateContext } from "../State";
import { replacePlaceholdersWithIcons } from '../utils/TextFormatting.js';
import '../styles/components/Message.css';

const Message = ({ mode, type, showMessage, messageStateChange }) => {
  const { 
    colors, 
    language,
    firstMessage, 
    setFirstMessage,
   } = useContext(StateContext);

  const modeTexts = getModeTexts(mode, language);
  const message = modeTexts ? modeTexts.Message : null; // Check if modeTexts exists

  let width;
  if (mode === 'learn') width = '30vh';
  else if (mode === 'get-inspired') width = '41vh';
  else if (mode === 'contribute') width = '42vh';
  else width = '200px';

  const iconsMap = {
    "[WAVE-I]": <WaveIcon className="message-icon wave" />,
    "[ARROW-I]": <ArrowIcon className="message-icon" />,
    "[BOOKMARK-I]": <BookmarkIcon className="message-icon" />,
  };

  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

  const handleShowMessage = () => {
    if (messageStateChange) {
      messageStateChange(true);
    }
  };

  const handleRemoveMessage = useCallback(() => {
    if (firstMessage) {
      setFirstMessage((prevState) => ({
        ...prevState,
        [mode]: false,
      }));
    }

    if (messageStateChange) {
      messageStateChange(false);
    }
  }, [firstMessage, messageStateChange, mode, setFirstMessage]);

  // Handle Enter key (active only when showMessage is true)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && showMessage) {
        e.preventDefault();
        handleRemoveMessage(); // Close the message
      }
    }, [showMessage, handleRemoveMessage]);

  // Attach listener only when showMessage is true
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if(!message)
    return null;
  if (type === 'button') {
    return (
      <button onClick={handleShowMessage} className="question-button" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} >
        <QuestionIcon className="question-icon" />
      </button>
    );
  } else {
    return (
      <>
        {showMessage && (
          <div className="message-box" style={{ width: width }}>
            <div className="message-question">
              <QuestionIcon className="question-icon message" />
            </div>
            
            {replacePlaceholdersWithIcons(message, "message-text", iconsMap)}

            <button className="got-it-button" onClick={handleRemoveMessage}>
              Ok, got it!
            </button>
          </div>
        )}
      </>
    );
  }
};

export default Message;
