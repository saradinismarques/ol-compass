import React from 'react';
import { getModeTexts } from '../utils/Data.js'; 
import '../styles/components/Message.css';
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { ReactComponent as QuestionIcon } from '../assets/icons/question-icon.svg'; // Adjust the path as necessary

const Message = ({ mode, type, messageShown, setMessageShown, firstMessage, setFirstMessage }) => {
  const message = getModeTexts(mode).Message;
  
  let width;

  if(mode === 'learn') width = '200px';
  else if(mode === 'get-inspired') width = '290px';
  else if(mode === 'contribute') width = '290px';
  else width = '200px'

  // Placeholder-to-Component mapping
  const iconsMap = {
    "[WAVE-I]": <WaveIcon className="message-icon wave" />,
    "[ARROW-I]": <ArrowIcon className="message-icon smaller" />,
    "[BOOKMARK-I]": <BookmarkIcon className="message-icon smaller" />,
  };

  // Function to replace placeholders with React components
  const renderTextWithIcons = (text, placeholders) => {
    // Use regex to find all placeholders like [PLACEHOLDER]
    const parts = text.split(/(\[[A-Z-]+\])/g); // Splits into text and placeholders

    return (
      <>
        {parts.map((part, index) =>
          placeholders[part] ? (
            <React.Fragment key={index}>{placeholders[part]}</React.Fragment> // Render component for placeholder
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment> // Render plain text
          )
        )}
      </>
    );
  };

  const showMessage = () => {
    setMessageShown(true);
  };

  const removeMessage = () => {
    setMessageShown(false);

    if(firstMessage) {
      setFirstMessage((prevState) => ({
        ...prevState,
        [mode]: false,
      }));
    }
  };

  if(type === 'button') {
    return (
      <button onClick={showMessage} className="question-button">
        <QuestionIcon 
          className="question-icon" // Apply your CSS class
        />
      </button>
    );
  } else {
    return (
      <>
        {messageShown && 
          <>        
            <div className="message-box" style={{ width: width }}>
              <div className="message-question">
                <QuestionIcon 
                  className="question-icon message" // Apply your CSS class
                />
              </div>
              <p className="message-text">
                {renderTextWithIcons(message, iconsMap)}
              </p>
              <button className="got-it-button" onClick={removeMessage}>
                Ok, got it!
              </button>
            </div>
          </>
        }
      </>
    )
  }
};

export default Message;
