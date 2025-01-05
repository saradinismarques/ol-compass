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

const replaceBoldsNoLineBreaks = (text) => {
    // Regex to match text between <b> and </b> tags
    const parts = text.split(/(<b>.*?<\/b>)/g); // Split by <b>...</b> while keeping the tags in the array

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('<b>') && part.endsWith('</b>')) {
                    // Remove the <b> and </b> tags, render the content as bold
                    return (
                        <b key={index}>
                            {part.replace('<b>', '').replace('</b>', '')}
                        </b>
                    );
                } else {
                    // Render non-bold text as plain text
                    return <span key={index}>{part}</span>;
                }
            })}
        </>
    );
  };

export function formatText(text, containerStyle, textStyle, boldStyle, placeholderMap, hasParagraph, hasIcons) {
    if (placeholderMap != null && !hasIcons) 
        text = replacePlaceholders(text, placeholderMap);

    // If `boldStyle` is `null`, skip bold processing
    const processText = (part) => {
        if(boldStyle !== null && !hasNoLineBreaks) 
            return replaceBolds(part, textStyle, boldStyle)
        else if(boldStyle !== null && hasNoLineBreaks)
            return replaceBoldsNoLineBreaks(part, textStyle, boldStyle)
        else if(hasIcons && hasNoLineBreaks)
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
    const hasNoLineBreaks = parts.length === 1;

    return (
        <div className={containerStyle}>
            <>
                {!hasNoLineBreaks &&
                    <>
                        {parts.map((part, index) => (
                        <React.Fragment key={`line-${index}`}>
                            {processText(part)}
                            {/* Add <br /> for line breaks */}
                            {!hasParagraph && index < parts.length - 1 && <br />}
                        </React.Fragment>
                        ))}
                    </>
                }
                {hasNoLineBreaks &&
                    <>
                        {processText(text)}
                    </>
                }     
            </>
        </div>
    );
}

export function formatButtons(text, currentConcept, onClickHandler) {
    // Split the text by <br> to handle line breaks
    const lineParts = text.split('<br>');

    return lineParts.map((line, lineIndex) => {
        // Handle <u> tags within each line
        const parts = line.split(/(<u>.*?<\/u>)/g);

        return (
            <React.Fragment key={lineIndex}>
                {parts.map((part, partIndex) => {
                    if (part.startsWith('<u>') && part.endsWith('</u>')) {
                        // Extract the content inside <u>...</u>
                        const buttonText = part.replace('<u>', '').replace('</u>', '');

                        // Check if the buttonText matches the currentConcept's linkedTo
                        const isHighlighted = currentConcept.linkedTo
                            .toLowerCase()
                            .includes(buttonText.toLowerCase());

                        return (
                            <button
                                key={partIndex}
                                style={{ fontWeight: isHighlighted ? 500 : 300 }}
                                onClick={() => onClickHandler(buttonText)}
                            >
                                {buttonText}
                            </button>
                        );
                    } else {
                        // Render normal text
                        return <span key={partIndex}>{part}</span>;
                    }
                })}
                {/* Add a line break after each line, except the last one */}
                {lineIndex < lineParts.length - 1 && <br />}
            </React.Fragment>
        );
    });
};

