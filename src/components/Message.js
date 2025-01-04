import React, { useCallback, useEffect, useContext } from 'react';
import { getModeTexts } from '../utils/Data.js'; 
import '../styles/components/Message.css';
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg';
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg';
import { ReactComponent as QuestionIcon } from '../assets/icons/question-icon.svg';
import { StateContext } from "../State";

const Message = ({ mode, type, showMessage, messageStateChange }) => {
  const { firstMessage, setFirstMessage } = useContext(StateContext);
  const message = getModeTexts(mode).Message;

  let width;
  if (mode === 'learn') width = '200px';
  else if (mode === 'get-inspired') width = '290px';
  else if (mode === 'contribute') width = '290px';
  else width = '200px';

  const iconsMap = {
    "[WAVE-I]": <WaveIcon className="message-icon wave" />,
    "[ARROW-I]": <ArrowIcon className="message-icon smaller" />,
    "[BOOKMARK-I]": <BookmarkIcon className="message-icon smaller" />,
  };

  const renderTextWithIcons = (text, placeholders) => {
    const parts = text.split(/(\[[A-Z-]+\])/g);
    return (
      <>
        {parts.map((part, index) =>
          placeholders[part] ? (
            <React.Fragment key={index}>{placeholders[part]}</React.Fragment>
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
          )
        )}
      </>
    );
  };

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
            <p className="message-text">
              {renderTextWithIcons(message, iconsMap)}
            </p>
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
