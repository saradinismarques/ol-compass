import React, { useContext, useCallback } from 'react';
import { getModeTexts, getLabelsTexts } from '../utils/DataExtraction.js'; 
import { StateContext } from "../State";
import { replaceLineBreaks, replacePlaceholdersWithIcons } from '../utils/TextFormatting.js';
import '../styles/components/Description.css';

const Description = ({ mode }) => {
  const {
    language,
    setShowExplanation,
    setShowInstruction,
    firstUse,
    iconsMap
  } = useContext(StateContext);

  const labelsTexts = getLabelsTexts(language, "description");
  const description = getModeTexts(mode, language);

  const handleStartButton = useCallback(() => {
    setShowExplanation(false);
    if(firstUse[mode] && mode !== 'map')
      setShowInstruction(true);
    else
      setShowInstruction(false);
  }, [firstUse, setShowExplanation, setShowInstruction, mode]);

  document.documentElement.style.setProperty('--headline-font-size', language === "pt" ? "5.6vh" : "6vh");

  if(!description) 
    return null;
  return (
    <div className='description-container'>
      {mode !== 'home' &&
        <>
          {replaceLineBreaks(description.Headline, "description-headline")}
        </>
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
