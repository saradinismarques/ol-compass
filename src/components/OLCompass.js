// src/components/OLCompass.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, Layer, Shape, Label, Text, Tag } from 'react-konva';
import { getPrinciplesData, getPerspectivesData, getDimensionsData } from '../utils/Data.js'; 
import Lines from '../components/Lines';

// Sizes and positions 
const size = window.innerHeight / 1.59;
const waveDims = {
    "Principle": { Width: size / 3.78, Height: size / 5.3, CornerRadius: size / 18 },
    "Perspective": { Width: size / 2.98, Height: size / 7.33, CornerRadius: size / 8.6 },
    "Dimension": { Width: size / 3.2, Height: size / 6.6, CornerRadius: size / 9.2 }
};

const getCenter = (action) => {
    if (action.startsWith("initial")) {
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    } else if (action === "default-center") {
        return { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
    } else {
        return { x: window.innerWidth * 0.35, y: window.innerHeight * 0.45 };
    }
};

const menuArea = 130;

const OLCompass = ({colors, action, onButtonClick, onClickOutside, resetState, savedComponents }) => {
    const center = getCenter(action);

    // Dictionary with all information
    const principles = getPrinciples(getPrinciplesData(), center);
    const perspectives = getPerspectives(getPerspectivesData(), center);
    const dimensions = getDimensions(getDimensionsData(), center);

    const components = principles.concat(perspectives, dimensions);

    // State of clicks and hovers
    const [hoveredId, setHoveredId] = useState(null);
    const [clickedIds, setClickedIds] = useState([]);
    
    // Only for the 'ideate' action
    const [lines, setLines] = useState([]);  // Array of lines, each line is an array of points
    const [currentLine, setCurrentLine] = useState([]);  // Points for the current line being drawn
    const lineColors = useMemo(() => ['#f5b24e', '#f34be6', '#996dab', '#b2d260', '#b2d260'], []);  // Memoize lineColors
    const [colorIndex, setColorIndex] = useState(0);  // Index to track the current color
    const [lineIds, setLineIds] = useState([]);  // Keep which IDs are already part of some line
    const [currentLineIds, setCurrentLineIds] = useState([]);  // IDs used in the current line
    const [isInside, setIsInside] = useState(false); // If is inside compass area
    const [initialState, setInitialState] = useState(true);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    
    // Compass area
    const circleRef = useRef({
        x: center.x, // Example center x
        y: center.y, // Example center y
        radius: size/2 + waveDims.Dimension.Height/2// Example radius
    });

    // Refs to update the state instantly
    const clickedIdsRef = useRef(clickedIds);
    const hoveredIdRef = useRef(hoveredId);
    const currentLineRef = useRef(currentLine);
    const colorIndexRef = useRef(colorIndex);
    const currentLineIdsRef = useRef(currentLineIds);
    const isInsideRef = useRef(isInside);

    // Update the ref whenever changes
    useEffect(() => {
        clickedIdsRef.current = clickedIds;
    }, [clickedIds]);

    useEffect(() => {
        hoveredIdRef.current = hoveredId;
    }, [hoveredId]);

    useEffect(() => {
        currentLineRef.current = currentLine;
    }, [currentLine]);

    useEffect(() => {
        colorIndexRef.current = colorIndex;
    }, [colorIndex]);

    useEffect(() => {
        currentLineIdsRef.current = currentLineIds;
    }, [currentLineIds]);

    useEffect(() => {
        isInsideRef.current = isInside;
    }, [isInside]);

    const handleClick = (e) => {
        const id = parseInt(e.target.id(), 10);
        
        if (action.startsWith("initial") || action.startsWith("default"))
            return;
        
        else if(action === "learn") {
            setInitialState(false);
            setClickedIds([id]);
            const title = convertLabel(components[id].Code);

            if (onButtonClick) {
                onButtonClick(components[id].Code, title, components[id].Headline, components[id].Paragraph, components[id].ShowMoreText, components[id].DesignPrompt, components[id].Type);
            }
        } else if(action === "get-inspired" || action === "analyze" || action === "ideate") {
            setClickedIds(prevClickedIds => 
                prevClickedIds.includes(id)
                ? prevClickedIds.filter(buttonId => buttonId !== id) // Remove ID if already clicked
                : [...prevClickedIds, id] // Add ID if not already clicked
            );
        } 
        
        if(action === "ideate") {
            let x = components[id].x;
            let y = components[id].y;
            
            setCurrentLine(prevLinePoints => {
                // Check if the point already exists in the array
                const pointIndex = prevLinePoints.findIndex((_, idx) => {
                    return idx % 2 === 0 && prevLinePoints[idx] === x && prevLinePoints[idx + 1] === y;
                });

                if (pointIndex !== -1) {
                    return prevLinePoints.filter((_, idx) => idx !== pointIndex && idx !== pointIndex + 1);
                } else {
                    // Point does not exist, add it
                    return [...prevLinePoints, x, y];
                }
            });
            setCurrentLineIds(prev => {
                // Check if the ID is already in the array
                if (prev.includes(id)) {
                    // Remove the ID if it already exists
                    return prev.filter(existingId => existingId !== id);
                } else {
                    // Add the ID if it does not exist
                    return [...prev, id];
                }
            });
        }
    };

    const handleMouseEnter = (e) => {
        if (action.startsWith("initial") || action.startsWith("default"))
            return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'pointer';

        const id = parseInt(e.target.id(), 10);
        setHoveredId(id);

        if(action === "learn") {
            const mousePos = stage.getPointerPosition();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            setTooltipPos({ x: mousePos.x, y: mousePos.y });
            setTooltipText(components[id].Tooltip); // Add a tooltipText property to the component object
            setTooltipVisible(true);
        }
    };

    const handleMouseLeave = (e) => {
        //const isInside = isInsideRef.current;
        if (action.startsWith("initial") || action.startsWith("default"))
            return;
        else if(action === "ideate" && !isInside) 
            return;
        const stage = e.target.getStage();
        stage.container().style.cursor = 'default';

        setHoveredId(null);

        if(action === "learn") {
            setTooltipVisible(false);
        }
    };

    // Memoize handleKeyDown to avoid creating a new reference on each render
    const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
            setClickedIds([]);
            setHoveredId(null);
            setCurrentLine([]);
            setCurrentLineIds([]);
            setInitialState(true);
            
            if(resetState)
                resetState();
        } else if (e.key === 'Enter' && action === "get-inspired") {
            if (onButtonClick) {
                let codes = clickedIdsRef.current.map(id => components[id].Code);
                onButtonClick(codes);
            }
        }
    }, [action, onButtonClick, resetState, components]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Dependency array includes handleKeyDown

    useEffect(() => {
        const handleMouseMove = (event) => {
            const currentLine = currentLineRef.current;
            
            if(action !== "ideate")
                return;

            const { x, y, radius } = circleRef.current;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const distance = Math.sqrt(
                Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
            );

            if (distance > radius && mouseY <= window.innerHeight - menuArea) {
                if(currentLine.length > 0)  {
                    document.body.style.cursor = 'pointer';
                }
                setIsInside(false);
            } else {
                setIsInside(true);
            }
        };

        const handleClickOutside = (event) => {
            const currentLine = currentLineRef.current;
            
            if(action !== "ideate" || currentLine.length === 0)
                return;

            const { x, y, radius } = circleRef.current;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const distance = Math.sqrt(
                Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
            );

            if (distance > radius && mouseY <= window.innerHeight - menuArea) {
                if (onClickOutside) {
                    onClickOutside({ x: mouseX, y: mouseY });
                }
                
                const currentLine = currentLineRef.current;
                const colorIndex = colorIndexRef.current;
                const currentLineIds = currentLineIdsRef.current;

                setLines(prevLines => [...prevLines, { points: [...currentLine, mouseX, mouseY], color: lineColors[colorIndex] }]);
                setCurrentLine([]);
                setColorIndex((prevIndex) => (prevIndex + 1) % lineColors.length);
                setLineIds(prevLineIds => [...prevLineIds, ...currentLineIds]);
                setCurrentLineIds([])
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [action, lineColors, onClickOutside]);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} style={{ zIndex: 30 }}>
            <Layer>
                {components.map((c, i) => (
                    <Shape
                        key={String(i)}
                        sceneFunc={(context, shape) => {
                        drawWaveButton(c, action, context, shape, savedComponents, initialState);
                        }}
                        id={String(i)}
                        fillLinearGradientStartPoint={{ x: window.innerWidth / 2, y: -waveDims[c.Type].Height/1.5 }}
                        fillLinearGradientEndPoint={{ x: window.innerWidth / 2, y: waveDims[c.Type].Height/1.5 }}
                        fillLinearGradientColorStops={getGradientColor(c.Code, c.Type, colors)}
                        stroke={colors[c.Type]}
                        strokeWidth={0.01}
                        opacity={getOpacity(clickedIds, lineIds, hoveredId, i, c.Type, action)}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                ))} 

                {/* Tooltip */}
                {/* {action ==="learn" && tooltipVisible && (
                <Label x={tooltipPos.x} y={tooltipPos.y} opacity={0.75}>
                    <Tag
                        fill="black" // Background color for the tooltip
                        pointerDirection="down" // Direction of the pointer triangle
                        pointerWidth={10} // Width of the pointer triangle
                        pointerHeight={10} // Height of the pointer triangle
                        cornerRadius={5} // Rounded corners for the tooltip box
                    />
                    <Text
                        text={tooltipText}
                        fontFamily='Manrope'
                        fontSize={16}
                        padding={10} // Adding some padding inside the tooltip
                        fill="white" // Text color
                    />
                </Label>
                )} */}

                {action === "ideate" &&
                 <Lines
                    lines={lines}
                    currentLine={currentLine}
                    lineColors={lineColors}
                    colorIndex={colorIndex}
                />
                }
            </Layer>   
        </Stage>
    );
}

function getPrinciples(principlesData, center) {
    const x = center.x;
    const y = center.y;

    const width = waveDims.Principle.Width;
    const height = waveDims.Principle.Height;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const margin = 0.7;
    const angle = 0;

    principlesData[0] = { ...principlesData[0], x: x, y: y, angle: angle };
    principlesData[1] = { ...principlesData[1], x: x - halfWidth - margin, y: y - halfHeight - margin, angle: angle };
    principlesData[2] = { ...principlesData[2], x: x + halfWidth + margin, y: y - halfHeight - margin, angle: angle };
    principlesData[3] = { ...principlesData[3], x: x, y: y - height - 2 * margin, angle: angle };
    principlesData[4] = { ...principlesData[4], x: x - halfWidth - margin, y: y + halfHeight + margin, angle: angle };
    principlesData[5] = { ...principlesData[5], x: x + halfWidth + margin, y: y + halfHeight + margin, angle: angle };
    principlesData[6] = { ...principlesData[6], x: x, y: y + height + 2 * margin, angle: angle };

    return principlesData;
}

function getPerspectives(perspectivesData, center) {
    const x = center.x;
    const y = center.y;
    const radius = size/2.77;
    const numPerspectives = 7;

    const perspectives = calculateAroundCirclePositions(perspectivesData, x, y, radius, numPerspectives);
    
    return perspectives;
}

function getDimensions(dimensionsData, center) {
    const x = center.x;
    const y = center.y;
    const radius = size/2;
    const numDimensions = 10;

    const positions = calculateAroundCirclePositions(dimensionsData, x, y, radius, numDimensions);
       
    return positions;
}

function calculateAroundCirclePositions(arr, centerX, centerY, radius, numberOfComponents) {
    const angleStep = (2 * Math.PI) / numberOfComponents;
    const StartAngle = -Math.PI/2;
    
    for (let i = 0; i < numberOfComponents; i++) {
      let angle = i * angleStep + StartAngle;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      angle = angle + Math.PI / 2;

      arr[i]["x"] = x;
      arr[i]["y"] = y;
      arr[i]["angle"] = angle;
    }

    return arr;
};

function drawWaveButton(component, action, context, shape, savedComponents, initialState) { 
    const x = component.x;
    const y = component.y;
    const angle = component.angle;

    const dims = waveDims[component.Type];
    const width = dims.Width;
    const height = dims.Height;
    const cornerRadius = dims.CornerRadius;

    // Save the current state of the canvas
    context.save();
    // Translate to the position where you want to draw the button
    context.translate(x, y);
    // Rotate the canvas context to the calculated angle (in radians)
    context.rotate(angle);

    const halfWidth =  width / 2;
    const halfHeight =  height / 2;

    const top = { x: 0, y: -halfHeight };
    const right = { x: halfWidth, y: 0 };
    const bottom = { x: 0, y: halfHeight };
    const left = { x: -halfWidth, y: 0 };

    // Shape 
    context.beginPath();
    context.moveTo(left.x, left.y);
    context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
    context.lineTo(right.x, right.y);
    context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
    context.closePath();
    context.fillStrokeShape(shape);

    drawText(component, action, context);
    
    // Check if this component has been saved (exists in savedComponents)
    // if(action === "learn" && !initialState && savedComponents.includes(component.Code)) {    
    //     // Draw a circle around the component or at its position
    //     context.beginPath();
    //     context.arc(-halfWidth+20, 0, 6, 0, 2 * Math.PI);  // Adjust the radius (30) as needed
    //     context.fillStyle = '#b93179';  // Color of the circle (can adjust)
    //     context.fill();  
    // }
}

function drawText(component, action, context) {
    // Text
    if (action === "initial-0" || action === "initial-1") {
        return
    } else if (action === "initial-2" || action === "initial-3") {
        if(component.Type !== "Principle")
            return
    } else if (action === "initial-4") {
        if(component.Type === "Dimension")
            return 
    }

    let color;
    if(component.Type === "Principle")
        color = '#269c76';
    else
        color = 'white';

    const flippedTexts = ['Pe3', 'Pe4', 'Pe5', 'Pe6', 'D4', 'D5', 'D6', 'D7', 'D8'];
    
    if(flippedTexts.includes(component.Code))
        context.rotate(Math.PI);
    // Draw main text
    // Calculate font size based on dimension
    const fontSize = size / 39; // Adjust as needed
    context.font = `500 ${fontSize}px Manrope`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Find the index of the first space
    const firstIndex = component.Label.indexOf(' ');
    const lastIndex = component.Label.lastIndexOf(' ');

    let firstPart, secondPart;
    if(component.Code === "P1") {
        firstPart = component.Label.substring(0, lastIndex);
        secondPart = component.Label.substring(lastIndex + 1);
    } else {
        // Split the string into two parts based on the first space
        firstPart = component.Label.substring(0, firstIndex);
        secondPart = component.Label.substring(firstIndex + 1);
    }

    if(firstPart.length < 5)
        context.fillText(component.Label, 0, 0);
    else{
        context.fillText(firstPart, 0, -6);
        context.fillText(secondPart, 0, 6);
    }

    let topSpace;
    if(component.Type === "Principle")
        topSpace = -22;
    else if(component.Type === "Perspective")
        topSpace = -16;
    else if(component.Type === "Dimension")
        topSpace = -18;

    // Draw identifier
    const LabelFontSize = size / 50; // Adjust as needed
    context.fillStyle = color;
    context.font = `200 ${LabelFontSize}px Manrope`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(component.Code, 0, topSpace);
    
}

const getOpacity = (clickedIds, lineIds, hoveredId, currentId, type, action) => {
    if (action === "initial-0" || action === "initial-1") {
        return 0.4
    } else if (action === "initial-2" || action === "initial-3") {
        if(type === "Principle")
            return 1
        else 
            return 0.4
    } else if (action === "initial-4") {
        if(type === "Dimension")
            return 0.4
        else
            return 1
    } else if (action === "initial-5")
        return 1

    if (clickedIds.includes(currentId) || lineIds.includes(currentId)) 
        return 1;
    if (hoveredId === currentId) 
        return 0.8;
    if (action ==="ideate" && clickedIds.length === 0) 
        return 0.4;  
    if(clickedIds.length === 0)
        return 1;
    return 0.4;
};

const getGradientColor = (code, type, colors) => {
    if (code === 'Pe1')
        return [0, colors.Perspective, 1, colors.Principle];
    else if(code === 'D1')
        return [0, colors.Dimension, 1, colors.Perspective];
    else if (type === 'Principle')
        return [0, colors.Principle, 1, colors.Principle];  
    else if (type === 'Perspective')
        return [0, colors.Perspective, 1, colors.Perspective];  
    else if (type === 'Dimension')
        return [0, colors.Dimension, 1, colors.Dimension];   
    
}

function convertLabel(label) {
    // Define a mapping of prefixes to their corresponding full names
    const prefixMap = {
        "D": "Dimension",
        "Pe": "Perspective",
        "P": "Principle"
    };

    // Use a regular expression to capture the prefix and the number
    const regex = /^([A-Za-z]+)(\d+)$/;
    const match = label.match(regex);

    if (match) {
        const prefix = match[1];
        const number = match[2];

        // Find the corresponding full name for the prefix
        const fullName = prefixMap[prefix];

        if (fullName) {
            return `${fullName} ${number}`;
        }
    }

    // If the label doesn't match the expected pattern, return it unchanged
    return label;
}

export default OLCompass;
