import React from 'react';

// Replace placeholders with values from countersMap
const replacePlaceholders = (text, map) => {
    return text.replace(/\[[A-Z-a-z]+\]/g, (match) => {
      return map[match] !== undefined ? map[match] : match; // Replace if in map, else leave as-is
    });
};

export function formatText(text, containerStyle, textStyle, boldStyle, PlaceholderMap) {
    // Process the input to replace placeholders
    let textWithouPlaceholders = text;

    if(PlaceholderMap != null)
        textWithouPlaceholders = replacePlaceholders(text, PlaceholderMap);

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
                                    <span key={`text-before-c-${index}`} className={textStyle}>
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
                                    <span key={`text-inside-c-${index}`} className={boldStyle}>
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
                                <span key={`text-default-${index}`} className={`${isInsideColoredBlock ? boldStyle : textStyle}`}>
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


