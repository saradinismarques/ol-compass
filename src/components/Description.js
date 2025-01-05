import React, { useContext } from 'react';
import { getModeTexts } from '../utils/Data.js'; 
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { ReactComponent as CtaArrow } from '../assets/icons/cta-arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as LockIcon } from '../assets/icons/lock-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import { formatText } from '../utils/Text.js';
import '../styles/components/Description.css';

const Description = ({ mode }) => {
  const {colors} = useContext(StateContext);

  const description = getModeTexts(mode);
  
  // Placeholder-to-Component mapping
  const iconsMap = {
    "[WAVE-I]": <WaveIcon className="text-icon wave" />,
    "[ARROW-I]": <ArrowIcon className="text-icon" />,
    "[BOOKMARK-I]": <BookmarkIcon className="text-icon " />,
    "[CTAARROW-I]": <CtaArrow className="text-icon cta-arrow" />,
    "[LOCK-I]": <LockIcon className="lock-icon" />,
  };

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);

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

  return (
    <div className='description-container'>
      <p className='description-headline'>
        {description.Headline}
      </p>
      {/* Available */}
      {description.Text !== '/' && 
        <>
          {formatText(description.Text, "description-text", null, null, null, true, false)}
          {formatText(description.StartPrompt, "description-start-prompt", null, null, iconsMap, false, true)}
        </>
      }
      {/* Not Available */}
      {description.Text === '/' && 
        <>
          {formatText(description.StartPrompt, "not-available", null, null, iconsMap, false, true)}
        </>
      } 
    </div>
  );
};

export default Description;
