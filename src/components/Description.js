import React from 'react';
import { getModeTexts } from '../utils/Data.js'; 
import '../styles/components/Description.css';
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { ReactComponent as CtaArrow } from '../assets/icons/cta-arrow-icon.svg'; // Adjust the path as necessary

const Description = ({ colors, mode }) => {
  const description = getModeTexts(mode);

  const textLines = description.Text.split("<br>");
  
  console.log(textLines);
  // Placeholder-to-Component mapping
  const iconsMap = {
    "[WAVE-I]": <WaveIcon className="text-icon wave" />,
    "[ARROW-I]": <ArrowIcon className="text-icon" />,
    "[BOOKMARK-I]": <BookmarkIcon className="text-icon " />,
    "[CTAARROW-I]": <CtaArrow className="text-icon cta-arrow" />,
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
      <div className='description-text'>
        {textLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      <p className='description-start-prompt'>
        {renderTextWithIcons(description.StartPrompt, iconsMap)}  
      </p>
      </div>
    </div>
  );
};

export default Description;
