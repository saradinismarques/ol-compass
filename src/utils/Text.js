import React from 'react';
import '../styles/pages/IntroPage.css';

// Replace placeholders with values from countersMap
const replacePlaceholders = (text, map) => {
    return text.replace(/\[[A-Z-a-z]+\]/g, (match) => {
      return map[match] !== undefined ? map[match] : match; // Replace if in map, else leave as-is
    });
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


const replaceBolds = (text, textStyle, boldStyle) => {
    let elements = [];
    let remainingText = text;
    let isInsideBold = false;

    while (remainingText) {
        const startB = remainingText.indexOf('<b>');
        const endB = remainingText.indexOf('</b>');

        if (startB !== -1 && (endB === -1 || startB < endB)) {
            // Text before <b> (if any)
            if (startB > 0) {
                elements.push(
                    <span key={`before-${remainingText.slice(0, startB)}`} className={textStyle}>
                        {remainingText.slice(0, startB)}
                    </span>
                );
            }
            // Move into bold
            isInsideBold = true;
            remainingText = remainingText.slice(startB + 3); // Skip `<b>`
        } else if (endB !== -1) {
            // Text inside <b> until </b>
            if (isInsideBold) {
                elements.push(
                    <span key={`inside-${remainingText.slice(0, endB)}`} className={boldStyle}>
                        {remainingText.slice(0, endB)}
                    </span>
                );
            }
            // Exit bold
            isInsideBold = false;
            remainingText = remainingText.slice(endB + 4); // Skip `</b>`
        } else {
            // Handle remaining text (no <b> or </b>)
            elements.push(
                <span key={`remaining-${remainingText}`} className={isInsideBold ? boldStyle : textStyle}>
                    {remainingText}
                </span>
            );
            remainingText = ""; // Done with this part
        }
    }

    return elements;
};

export function formatText(text, containerStyle, textStyle, boldStyle, placeholderMap, hasParagraph, hasIcons) {
    if (placeholderMap != null && !hasIcons) 
        text = replacePlaceholders(text, placeholderMap);

    // If `boldStyle` is `null`, skip bold processing
    const processText = (part) => {
        if(boldStyle !== null) 
            return replaceBolds(part, textStyle, boldStyle)
        else if(hasIcons)
            return (
                <>
                {renderTextWithIcons(text, placeholderMap)}  
                </>
            );
        else if(hasParagraph)
            return (
                <p key={part} className={textStyle}>
                    {part}
                </p>
            );
        else 
            return (
                <span key={part} className={textStyle}>
                    {part}
                </span>
            );
    };

    // Split the string by the <br> tag to handle line breaks
    const parts = text.split('<br>').map(part => part.trim()).filter(part => part !== "");

    return (
        <div className={containerStyle}>
            <p>
                {parts.map((part, index) => (
                    <React.Fragment key={`line-${index}`}>
                        {processText(part)}
                        {/* Add <br /> for line breaks */}
                        {!hasParagraph && index < parts.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </p>
        </div>
    );
}

