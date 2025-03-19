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

export function replaceBoldsHighlights(text, textStyle, boldStyle, italicStyle, hPStyle, hPeStyle) {
    const parseText = (input) => {
        const tagRegex = /(<(b|i|hP|hPe)>(.*?)<\/\2>)/g;
        let elements = [];
        let lastIndex = 0;
        
        input.replace(tagRegex, (match, fullMatch, tag, content, offset) => {
            // Push plain text before the match
            if (lastIndex < offset) {
                elements.push(input.slice(lastIndex, offset));
            }
            
            // Recursively parse nested content
            let parsedContent = parseText(content);
            
            // Wrap parsed content in appropriate tag components
            let component;
            switch (tag) {
                case 'b':
                    component = <span key={offset} className={boldStyle}>{parsedContent}</span>;
                    break;
                case 'i':
                    component = <span key={offset} className={italicStyle} style={{ fontStyle: "italic" }}>{parsedContent}</span>;
                    break;
                case 'hP':
                    component = <span key={offset} className={hPStyle}>{parsedContent}</span>;
                    break;
                case 'hPe':
                    component = <span key={offset} className={hPeStyle}>{parsedContent}</span>;
                    break;
                default:
                    component = parsedContent;
            }
            
            elements.push(component);
            lastIndex = offset + fullMatch.length;
        });
        
        // Push remaining plain text after the last match
        if (lastIndex < input.length) {
            elements.push(input.slice(lastIndex));
        }
        
        return elements;
    };

    return (
        <div style={{ display: "inline" }} className={textStyle}>
            {parseText(text)}
        </div>
    );
}

export function replaceBoldsColoredBreaks(text, textStyle, boldStyle, colorStyle) {
    return (
        <div style={{ display: "block" }}>
            {text
                .replace(/<br>\s*<br>/g, "||DOUBLE_BR||") // Replace double line breaks first
                .replace(/<b>(.*?)<\/b>/g, "||B||$1||B||") // Mark <b> tags
                .replace(/<c>(.*?)<\/c>/g, "||C||$1||C||") // Mark <c> tags
                .split(/(?:\|\|DOUBLE_BR\|\|)/g) // Now properly split only on double line breaks
                .map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`} style={{ marginBottom: "4vh" }}> {/* Bigger space for double breaks */}
                        {section.split(/<br>/g).map((paragraph, paragraphIndex) => (
                            <p key={`paragraph-${sectionIndex}-${paragraphIndex}`} style={{ marginBottom: "-2vh" }}> {/* Normal space for single break */}
                                {paragraph
                                    .split(/(\|\|B\|\|.*?\|\|B\|\||\|\|C\|\|.*?\|\|C\|\|)/g) // Handle bold & colored text
                                    .map((part, index) => {
                                        if (part.startsWith("||B||")) {
                                            return <span key={index} className={boldStyle}>{part.replace(/\|\|B\|\|/g, "")}</span>;
                                        }
                                        if (part.startsWith("||C||")) {
                                            return <span key={index} className={colorStyle}>{part.replace(/\|\|C\|\|/g, "")}</span>;
                                        }
                                        return <span key={index} className={textStyle}>{part}</span>;
                                    })}
                            </p>
                        ))}
                    </div>
                ))}
        </div>
    );
}

export function replaceHighlightsPlaceholders(text, textStyle, hPStyle, hPeStyle, hDStyle, iconsMap) {
    return (
        <div style={{ display: "block" }}>
            {text
                .replace(/<hP>(.*?)<\/hP>/g, "||HP||$1||HP||") // Replace <hP> with markers
                .replace(/<hPe>(.*?)<\/hPe>/g, "||HPE||$1||HPE||") // Replace <hPe> with markers
                .replace(/<hD>(.*?)<\/hD>/g, "||HD||$1||HD||") // Replace <hD> with markers
                .split(/<br>/g) // Split text by <br> tags to create separate paragraphs
                .map((paragraph, index) => {
                    const uniqueKey = `${Date.now()}-${index}`; // Unique key based on timestamp and index
                    
                    return (
                        <p key={uniqueKey} style={{ margin: "2vh 0", display: "block" }}> {/* Adds space between paragraphs */}
                            {paragraph
                                .split(/(\|\|HP\|\|.*?\|\|HP\|\||\|\|HPE\|\|.*?\|\|HPE\|\||\|\|HD\|\|.*?\|\|HD\|\||\[[A-Z-]+\])/g) // Split placeholders and icons
                                .map((part, index2) => {
                                    const uniquePartKey = `${uniqueKey}-${index2}`; // Unique key for each part

                                    if (part.startsWith("||HP||")) {
                                        return (
                                            <span key={uniquePartKey} className={hPStyle} style={{ display: "inline" }}>
                                                {part.replace(/\|\|HP\|\|/g, "")}
                                            </span>
                                        );
                                    }
                                    if (part.startsWith("||HPE||")) {
                                        return (
                                            <span key={uniquePartKey} className={hPeStyle} style={{ display: "inline" }}>
                                                {part.replace(/\|\|HPE\|\|/g, "")}
                                            </span>
                                        );
                                    }
                                    if (part.startsWith("||HD||")) {
                                        return (
                                            <span key={uniquePartKey} className={hDStyle} style={{ display: "inline" }}>
                                                {part.replace(/\|\|HD\|\|/g, "")}
                                            </span>
                                        );
                                    }
                                    if (iconsMap[part]) {
                                        return <React.Fragment key={uniquePartKey}>{iconsMap[part]}</React.Fragment>;
                                    }
                                    
                                    return (
                                        <span key={uniquePartKey} className={textStyle} style={{ display: "inline" }}>
                                            {part}
                                        </span>
                                    );
                                })}
                        </p>
                    );
                })}
        </div>
    );
}
