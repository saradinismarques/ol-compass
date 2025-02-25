import React from 'react';

export function cleanText(text) {
    return text.replace(/<br>/g, ' ').replace(/<\/?b>/g, ''); // Remove <b> and </b>
}

export function replaceLineBreaks (text, textStyle) {
    // Split the text by <br> tags
    const parts = text.split('<br>').map(part => part.trim());
    return (
        <div className={textStyle}>
            {parts.map((part, index) => (
                <div key={index}>
                    {part}
                    {index < parts.length - 1 && <br />}
                </div>
            ))}
        </div>
    );
};

export function replaceBolds (text, containerStyle, textStyle, boldStyle) {
    // Regex to match text between <b> and </b> tags
    const parts = text.split(/(<b>.*?<\/b>)/g); // Split by <b>...</b> while keeping the tags in the array

    return (
        <div className={containerStyle}>
            {parts.map((part, index) => {
                if (part.startsWith('<b>') && part.endsWith('</b>')) {
                    // Remove the <b> and </b> tags, render the content as bold
                    return (
                        <span key={index} className={boldStyle}>
                            {part.replace('<b>', '').replace('</b>', '')}
                        </span>
                    );
                } else {
                    // Render non-bold text as plain text (no new line)
                    return <span key={index} className={textStyle}>{part}</span>;
                }
            })}
        </div>
    );
};

// Replace placeholders with values from countersMap
const replacePlaceholdersWithCounters = (text, map) => {
    return text.replace(/\[[A-Z-a-z]+\]/g, (match) => {
      return map[match] !== undefined ? map[match] : match; // Replace if in map, else leave as-is
    });
};

// Function to replace placeholders with React components
export function replacePlaceholdersWithIcons (text, textStyle, placeholders) {
    // Use regex to find all placeholders like [PLACEHOLDER]
    const parts = text.split(/(\[[A-Z-]+\])/g); // Splits into text and placeholders

    return (
        <div className={textStyle}>
            {parts.map((part, index) =>
            placeholders[part] ? (
                <React.Fragment key={index}>{placeholders[part]}</React.Fragment> // Render component for placeholder
            ) : (
                <React.Fragment key={index}>{part}</React.Fragment> // Render plain text
            )
            )}
        </div>
    );
};

export function replaceBoldsBreaksPlaceholders(text, containerStyle, textStyle, boldStyle, placeholderMap) {
    // Process the input to replace placeholders
    let textWithouPlaceholders = text;

    if(placeholderMap != null)
        textWithouPlaceholders = replacePlaceholdersWithCounters(text, placeholderMap);

    // Split the string by the <br> tag to handle line breaks
    const parts = textWithouPlaceholders.split('<br>').map(part => part.trim()).filter(part => part !== "");
    let isInsideColoredBlock = false; // Tracks if we are inside a <c> block
    
    return (
        <div className={containerStyle}>
            <p>
                {parts.map((part, index) => {
                    let elements = []; // Collect parts of the current line
                    let remainingText = part;
    
                    // Handle coloring for <c> and </c> tags within the part
                    while (remainingText) {
                        // Check for <c> and </c> tags
                        const startB = remainingText.indexOf('<b>');
                        const endB = remainingText.indexOf('</b>');
    
                        if (startB !== -1 && (endB === -1 || startB < endB)) {
                            // Text before <c> (if any)
                            if (startB > 0) {
                                elements.push(
                                    <span key={`text-before-c-${remainingText}`} className={textStyle}>
                                        {remainingText.slice(0, startB)}
                                    </span>
                                );
                            }
                            // Move inside <c>
                            isInsideColoredBlock = true;
                            remainingText = remainingText.slice(startB + 3); // Remove `<c>`
                        } else if (endB !== -1) {
                            // Inside <c>: Text up to </c>
                            if (isInsideColoredBlock) {
                                elements.push(
                                    <span key={`text-inside-c-${remainingText}`} className={boldStyle}>
                                        {remainingText.slice(0, endB)}
                                    </span>
                                );
                            }
                            // Exit <c>
                            isInsideColoredBlock = false;
                            remainingText = remainingText.slice(endB + 4); // Remove `</c>`
                        } else {
                            // No <c> or </c>: Handle remaining text
                            elements.push(
                                <span key={`text-default-${remainingText}`} className={`${isInsideColoredBlock ? boldStyle : textStyle}`}>
                                    {remainingText}
                                </span>
                            );
                            remainingText = ""; // All done for this part
                        }
                    }
    
                    return (
                        <React.Fragment key={index}>
                            {elements}
                            {/* Add <br /> for line breaks */}
                            {index < parts.length - 1 && <br />}
                        </React.Fragment>
                    );
                })}
            </p>
        </div>
    );
};

export function replaceUnderlines(text, currentConcept, onClickHandler) {
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

export function replaceBoldsUnderlinesHighlights(text, textStyle, boldStyle, underlineStyle, hPStyle, hPeStyle) {
    return (
        <div style={{ display: "inline" }}>
            {text
                .replace(/<b>(.*?)<\/b>/g, "||B||$1||B||")
                .replace(/<i>(.*?)<\/i>/g, "||I||$1||I||")
                .replace(/<hP>(.*?)<\/hP>/g, "||HP||$1||HP||")
                .replace(/<hPe>(.*?)<\/hPe>/g, "||HPE||$1||HPE||")
                .split(/(\|\|B\|\|.*?\|\|B\|\||\|\|I\|\|.*?\|\|I\|\||\|\|HP\|\|.*?\|\|HP\|\||\|\|HPE\|\|.*?\|\|HPE\|\|)/g)
                .map((part, index) => {
                    const uniqueKey = `${Date.now()}-${index}`; // Unique key based on timestamp and index
                    if (part.startsWith("||B||")) {
                        return (
                            <span key={uniqueKey} className={boldStyle} style={{ display: "inline" }}>
                                {part.replace(/\|\|B\|\|/g, "")}
                            </span>
                        );
                    }
                    if (part.startsWith("||I||")) {
                        return (
                            <span key={uniqueKey} className={underlineStyle} style={{ display: "inline" }}>
                                {part.replace(/\|\|I\|\|/g, "")}
                            </span>
                        );
                    }
                    if (part.startsWith("||HP||")) {
                        return (
                            <span key={uniqueKey} className={hPStyle} style={{ display: "inline" }}>
                                {part.replace(/\|\|HP\|\|/g, "")}
                            </span>
                        );
                    }
                    if (part.startsWith("||HPE||")) {
                        return (
                            <span key={uniqueKey} className={hPeStyle} style={{ display: "inline" }}>
                                {part.replace(/\|\|HPE\|\|/g, "")}
                            </span>
                        );
                    }
                    return (
                        <span key={uniqueKey} className={textStyle} style={{ display: "inline" }}>
                            {part}
                        </span>
                    );
                })}
        </div>
    );
}

