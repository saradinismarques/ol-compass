import React, { useContext, useCallback } from 'react';
import { getModeTexts, getLabelsTexts } from '../utils/DataExtraction.js'; 
import { ReactComponent as WaveIcon } from '../assets/icons/wave-icon.svg'; // Adjust the path as necessary
import { ReactComponent as ArrowIcon } from '../assets/icons/arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { ReactComponent as CtaArrow } from '../assets/icons/cta-arrow-icon.svg'; // Adjust the path as necessary
import { ReactComponent as LockIcon } from '../assets/icons/lock-icon.svg'; // Adjust the path as necessary
import { StateContext } from "../State";
import { replaceLineBreaks, replacePlaceholdersWithIcons } from '../utils/TextFormatting.js';
import '../styles/components/Description.css';

const Description = ({ mode }) => {
  const {
    colors,
    language,
    setShowExplanation,
    setShowInstruction,
    firstUse,
  } = useContext(StateContext);

  const labelsTexts = getLabelsTexts(language, "description");
  const description = getModeTexts(mode, language);

  // Placeholder-to-Component mapping
  const iconsMap = {
    "[WAVE-I]": <WaveIcon className="text-icon wave" />,
    "[ARROW-I]": <ArrowIcon className="text-icon" />,
    "[BOOKMARK-I]": <BookmarkIcon className="text-icon " />,
    "[CTAARROW-I]": <CtaArrow className="text-icon cta-arrow" />,
    "[LOCK-I]": <LockIcon className="lock-icon" />,
  };

  document.documentElement.style.setProperty('--selection-color', colors['Selection']);
  document.documentElement.style.setProperty('--gray-color', colors['Gray']);

  const handleStartButton = useCallback(() => {
    setShowExplanation(false);
    if(mode === 'learn' && !firstUse[mode])
      setShowInstruction(false);
    else
      setShowInstruction(true);
  }, [firstUse, setShowExplanation, setShowInstruction, mode]);

  if(!description) 
    return null;
  return (
    <div className='description-container'>
      {mode !== 'home' &&
        <p className='description-headline'>
          {description.Headline}
        </p>
      }
      {/* Available */}
      {description.Text !== '/' && 
        <>
          {replaceLineBreaks(description.Text, "description-text")}
          {mode !== 'home' &&
            <button 
              className='description-start-button'
              onClick={handleStartButton}
            >
              {firstUse[mode] ? labelsTexts["start"] : labelsTexts["continue"]}
            </button>
          }
        </>
      }
      {/* Not Available */}
      {description.Text === '/' && 
        <>
          {replacePlaceholdersWithIcons(description.StartPrompt, "not-available", iconsMap)}
        </>
      } 
    </div>
  );
};

export default Description;
