// src/components/OLCompass.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, Layer, Shape, Label, Text, Tag } from 'react-konva';
import { getPrinciplesData, getPerspectivesData, getDimensionsData, getConceptsData } from '../utils/Data.js'; 
import Lines from './Lines.js';
import * as d3 from 'd3';

// Sizes and positions 
const size = 420;
const waveWidth = 420;
const waveHeight = 140;
const waveRadius = 130;

const colors = {
    Principle: "#41ffc9",
    Perspective: "#41e092",
    Dimension: "#41c4e0"
};

const pinkColor = "#e6007e";

const menuArea = 130;

const OLCompass = ({action, position, onButtonClick, onClickOutside, resetState, savedComponents, selectedComponents, onEnterClick, resetCompass, onSearchClick, onSubmitClick, fetchData }) => {
    const getCenter = (position) => {
        if (position === "center") {
            return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        } else if (position === "left") {
            return { x: window.innerWidth * 0.33, y: window.innerHeight * 0.46 };
        }
    };
    const center = getCenter(position);

    // Dictionary with all information
    const principles = getPrinciples(getPrinciplesData(), center);
    const perspectives = getPerspectives(getPerspectivesData(), center);
    const dimensions = getDimensions(getDimensionsData(), center);

    const components = principles.concat(perspectives, dimensions);
    const concepts = getConceptsData();
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
    
    // Declare a timeout variable to store the reference to the timeout
    let tooltipTimeout = null;

    // Compass area
    const circleRef = useRef({
        x: center.x, // Example center x
        y: center.y, // Example center y
        radius: size/2 + waveHeight/2// Example radius
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

    // Effect to handle reset
    useEffect(() => {
        if (resetCompass) {
        // Clear the selected buttons or reset the state
            setClickedIds([]);
            setHoveredId(null);
            setCurrentLine([]);
            setCurrentLineIds([]);
            setInitialState(true);
        }
    }, [resetCompass]);

    useEffect(() => {
        if (fetchData && onSubmitClick) {
            let codes = clickedIdsRef.current.map(id => components[id].Code);
            onSubmitClick(codes);
        }
    }, [fetchData, onSubmitClick, components]);

    useEffect(() => {
        if (fetchData && onSearchClick) {
            let codes = clickedIdsRef.current.map(id => components[id].Code);
            onSearchClick(codes);
        }
    }, [fetchData, onSearchClick, components]);

    const handleClick = (e) => {
        const id = parseInt(e.target.id(), 10);
        
        if (action.startsWith("initial") || action === "default" || action === "get-inspired-carousel" || action === "get-inspired-search")
            return;
        
        else if(action === "learn") {
            // Check if the clicked ID is already in clickedIds
            if (clickedIds.includes(id)) {
                // If it is, remove it and set clickedIds to null
                setClickedIds([]);
                setHoveredId(null);
                setInitialState(true);
                
                if(resetState)
                    resetState();
            } else {
                setInitialState(false);
                setClickedIds([id]);
                const title = convertLabel(components[id].Code);

                let correspondingConcepts = null;
                if(components[id].Type === "Principle")
                    correspondingConcepts = getCorrespondingConcepts(concepts, components[id].Code);
                
                if (onButtonClick) {
                    onButtonClick(components[id].Code, title, components[id].Headline, components[id].Paragraph, components[id].DesignPrompt, components[id].Type, correspondingConcepts);
                }
            }
        } else if(action === "get-inspired" || action === "contribute" || action === "ideate") {
            setClickedIds(prevClickedIds => 
                prevClickedIds.includes(id)
                ? prevClickedIds.filter(buttonId => buttonId !== id) // Remove ID if already clicked
                : [...prevClickedIds, id] // Add ID if not already clicked
            );
            if(action === "get-inspired" || action ==="contribute") {
                if(onButtonClick)
                    onButtonClick();
            }
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
        const stage = e.target.getStage();
        
        if (action.startsWith("initial") || action === "default" || action === "get-inspired-carousel" || action === "get-inspired-search") {
            stage.container().style.cursor = 'default';
            return; 
        }

        stage.container().style.cursor = 'pointer';

        const id = parseInt(e.target.id(), 10);
        setHoveredId(id);
        hoveredIdRef.current = id; 

        if(components[id].Type === "Principle") {
            // Clear any existing timeout to avoid overlaps
            clearTimeout(tooltipTimeout);

            // Set a timeout to delay the appearance of the tooltip by 1 second
            tooltipTimeout = setTimeout(() => {
                if (hoveredIdRef.current === id) {  // Check if the tooltip was not cancelled
                    const mousePos = stage.getPointerPosition();
                    setTooltipPos({ x: mousePos.x, y: mousePos.y });
                    let cleanedText = components[id].Tooltip.replace('<br>', '');
                    setTooltipText(cleanedText);
                    setTooltipVisible(true);
                }
            }, 500); // 1-second delay
        }
    };

    const handleMouseLeave = (e) => {
        //const isInside = isInsideRef.current;
        if (action.startsWith("initial") || action === "default" || action === "get-inspired-carousel")
            return;
        else if(action === "ideate" && !isInside) 
            return;
        const stage = e.target.getStage();
        stage.container().style.cursor = 'default';

        setHoveredId(null);

        // Clear the tooltip timeout to prevent it from showing if mouse leaves
        clearTimeout(tooltipTimeout);

        if(action === "learn" || action === "contribute" || action === "get-inspired") {
             // Set the cancellation flag to prevent tooltip from showing
            setTooltipVisible(false);
            setTooltipText(""); // Clear the tooltip text
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
        } else if (e.key === 'Enter' && (action === "contribute" || action === "get-inspired")) {
            if (onEnterClick) {
                let codes = clickedIdsRef.current.map(id => components[id].Code);
                onEnterClick(codes);
            }
        }
    }, [resetState, action, components, onEnterClick]);
    
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
            <React.Fragment key={String(i)}>
                
                {/* Stroke with constant full opacity */}
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(c, action, context, shape, savedComponents, initialState);
                    }}
                    id={String(i)}
                    fill="transparent"  // No fill, just stroke
                    stroke={getStroke(clickedIds, i, c, action)}
                    strokeWidth={getStrokeWidth(clickedIds, i, c, action, selectedComponents)}
                    opacity={1}  // Always keep stroke opacity at 1
                /> 
                
                {/* Shape with varying opacity */}
                <Shape
                    sceneFunc={(context, shape) => {
                        drawWaveButton(c, action, context, shape, savedComponents, initialState);
                    }}
                    id={String(i)}
                    fillLinearGradientStartPoint={{ x: window.innerWidth / 2, y: -waveHeight / 1.5 }}
                    fillLinearGradientEndPoint={{ x: window.innerWidth / 2, y: waveHeight / 1.5 }}
                    fillLinearGradientColorStops={getGradientColor(c.Code, c.Type, colors)}
                    opacity={getOpacity(clickedIds, lineIds, hoveredId, i, c, action, selectedComponents)}  // Shape opacity
                    stroke={colors[c.Type]}
                    strokeWidth={0.0001}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />

            </React.Fragment>
            ))}
                

                {/* Bookmarks */}
                {components.map((c, i) => (
                    <Shape
                        key={String(i)}
                        sceneFunc={(context, shape) => drawBookmarkFilled(c, context, shape, action, savedComponents, initialState)}
                        id={String(i)}
                    />
                ))} 

                {/* Tooltip */}
                {(action ==="learn" || action ==="contribute" || action ==="get-inspired") && tooltipVisible && (
                <Label x={tooltipPos.x} y={tooltipPos.y} opacity={0.9}>
                    <Tag
                        fill="#acaaaa" // Background color for the tooltip
                        pointerDirection="down" // Direction of the pointer triangle
                        pointerWidth={10} // Width of the pointer triangle
                        pointerHeight={10} // Height of the pointer triangle
                        cornerRadius={5} // Rounded corners for the tooltip box
                    />
                    <Text
                        text={tooltipText}
                        fontFamily='Manrope'
                        fontSize={15}
                        padding={10} // Adding some padding inside the tooltip
                        fill="white" // Text color
                        width={tooltipText.length*4.8} // Define a maximum width for the text
                    />
                </Label>
                )}

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
    const radius = size/6.3;
    const numPrinciples = 7;

    const principles = calculateAroundCirclePositionsPrinciples(principlesData, x, y, radius, numPrinciples);

    return principles;
}

function getPerspectives(perspectivesData, center) {
    const x = center.x;
    const y = center.y;
    const radius = size/3;
    const numPerspectives = 7;

    const perspectives = calculateAroundCirclePositions(perspectivesData, x, y, radius, numPerspectives);
    
    return perspectives;
}

function getDimensions(dimensionsData, center) {
    const x = center.x;
    const y = center.y;
    const radius = size/2.04;
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
      if(arr[i].Type === 'Perspective')  
        angle = angle + Math.PI / 2;
      else 
        angle = angle + Math.PI / 2;

      arr[i]["x"] = x;
      arr[i]["y"] = y;
      arr[i]["angle"] = angle;
    }

    return arr;
};

function calculateAroundCirclePositionsPrinciples(arr, centerX, centerY, radius, numberOfComponents) {
    const angleStep = (2 * Math.PI) / numberOfComponents;
    const StartAngle = -Math.PI/1.65;
    
    for (let i = 0; i < numberOfComponents; i++) {
      let angle = i * angleStep + StartAngle;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      angle = angle + 2*Math.PI / 2 + Math.PI*0.01;

      arr[i]["x"] = x;
      arr[i]["y"] = y;
      arr[i]["angle"] = angle;
    }

    return arr;
};

function drawWaveButton(component, action, context, shape) { 
    const x = component.x;
    const y = component.y;
    const angle = component.angle;

    if(component.Code !== 'D1')
        return;
    // Save the current state of the canvas
    context.save();
    // Translate to the position where you want to draw the button
    context.translate(x, y);
    // Rotate the canvas context to the calculated angle (in radians)
    context.rotate(angle);

    const halfWidth =  waveWidth / 2;
    const halfHeight =  waveHeight / 2;

    let leftEnd, rightEnd;

    let topLeft, topMiddle, topRight, bottomRight, bottomMiddle, bottomLeft;
    let controlTopLeft, controlTopRight, controlBottomRight, controlBottomLeft;
    let centerTopLeft, centerTopRight, centerBottomRight, centerBottomLeft;
    let arcTopLeft, arcTopRight, arcBottomRight, arcBottomLeft;

    centerBottomRight = {x:0, y:0};
    centerBottomLeft = {x:0, y:0};
    arcTopLeft = {x:0, y:0};
    arcBottomRight = {x:0, y:0};
    arcBottomLeft = {x:0, y:0};

   
    if(component.Type !== 'Principle') {
        rightEnd = { x: halfWidth, y: 0 };
        
        topRight  = { x: (14/21)*halfWidth, y: -(5/7)*halfHeight };
        topMiddle  = { x: 0, y: -(5/7)*halfHeight };
        centerTopRight = {x: (topRight.x-topMiddle.x)/2, y: halfWidth-waveRadius}
        controlTopRight  = calculateP1(topMiddle, topRight, centerTopRight);
        arcTopRight = {x: (topRight.x-topMiddle.x)/2, y: -halfHeight };
        
        topLeft  = { x: -(8/21)*halfWidth, y: 0 };
        leftEnd  = { x: -halfWidth, y: 0 };
        centerTopLeft = {x: (leftEnd.x-topLeft.x)/2, y: halfWidth-waveRadius}

        controlTopLeft  = { x: -(2/3)*halfWidth, y: (1/3)*halfHeight+5 };

        controlBottomRight  = {x: (2/3)*halfWidth, y: -(1/3)*halfHeight-5 };
        bottomRight  = { x: (1/3)*halfWidth, y: 0 };
        bottomMiddle  = { x: 0, y: (2/3)*halfHeight-5}
        controlBottomLeft = { x: -(1/3)*halfWidth, y:  halfHeight+5 };
        bottomLeft  = { x: -(2/3)*halfWidth, y: (2/3)*halfHeight-5 };
    } else {
        leftEnd = { x: -halfWidth+10, y: -10 };
        topLeft  = { x: -(2/3)*halfWidth, y: -(2/3)*halfHeight+5 };
        controlTopLeft  = { x: -halfWidth/3, y: -halfHeight-5 };
        topMiddle  = { x: 0, y: -(2/3)*halfHeight+5 };
        topRight  = { x: (1/3)*halfWidth, y: 0 };
        controlTopRight  = { x: (2/3)*halfWidth, y:(1/3)*halfHeight+5 };
        rightEnd = { x: halfWidth-2, y: 10 };
        bottomRight  = { x: (2/3)*halfWidth, y: (2/3)*halfHeight-5 };
        controlBottomRight  = { x: halfWidth/3, y: halfHeight+5 };
        bottomMiddle  = { x: 0, y: (2/3)*halfHeight-5}
        bottomLeft  = { x: -(1/3)*halfWidth, y: 0 };
        controlBottomLeft = { x: -(2/3)*halfWidth, y:-(1/3)*halfHeight-5 };
    }
    context.beginPath();
     
    if(component.Type !== 'Principle') {
        context.moveTo(rightEnd.x, rightEnd.y);
        context.lineTo(topRight.x, topRight.y);
        context.arcTo(controlTopRight.x, controlTopRight.y, topMiddle.x, topMiddle.y, waveRadius);
        context.lineTo(topLeft.x, topLeft.y);
        context.arcTo(controlTopLeft.x, controlTopLeft.y, leftEnd.x, leftEnd.y, waveRadius);
        context.arcTo(controlBottomLeft.x, controlBottomLeft.y, bottomMiddle.x, bottomMiddle.y, waveRadius);
        context.lineTo(bottomRight.x, bottomRight.y);
        context.arcTo(controlBottomRight.x, controlBottomRight.y, rightEnd.x, rightEnd.y, waveRadius);
    } else {
        context.moveTo(leftEnd.x, leftEnd.y);
        //context.lineTo(lTop.x, lTop.y);
        context.arcTo(controlTopLeft.x, controlTopLeft.y, topMiddle.x, topMiddle.y, waveRadius);
        context.lineTo(topRight.x, topRight.y);
        context.arcTo(controlTopRight.x, controlTopRight.y, rightEnd.x, rightEnd.y, waveRadius);
        //context.lineTo(rBottom.x, rBottom.y);
        context.arcTo(controlBottomRight.x, controlBottomRight.y, bottomMiddle.x, bottomMiddle.y, waveRadius);
        context.lineTo(bottomLeft.x, bottomLeft.y);
        context.arcTo(controlBottomLeft.x, controlBottomLeft.y, leftEnd.x, leftEnd.y, waveRadius);
    }
    
    context.closePath();
    context.fillStrokeShape(shape);

   // Points array
    const points = [
        topLeft, topMiddle, topRight, bottomRight, bottomMiddle, bottomLeft,
        controlTopLeft, controlTopRight, controlBottomRight, controlBottomLeft, 
        centerTopLeft, centerTopRight, centerBottomRight, centerBottomLeft,
        arcTopLeft, arcTopRight, arcBottomRight, arcBottomLeft
    ];

    // Colors array for each point
    const colors = [
        'red', 'blue', 'green', 'yellow', 'purple', 'orange',
        'pink', 'cyan', 'brown', 'magenta', 
        'black', 'gray', 'lime', 'teal', 
        'navy', 'gold', 'coral', 'violet'
    ];

    // Draw small circles at each point with different colors
    const circleRadius = 2; // Adjust this value to change the circle size
    
    points.forEach((point, index) => {
        context.beginPath();
        context.arc(point.x, point.y, circleRadius, 0, Math.PI * 2); // Draw a circle
        context.fillStyle = colors[index]; // Set color based on index
        context.fill(); // Fill the circle with the color
        context.closePath();
    });

    //drawText(component, context, halfWidth, halfHeight, action);
}

function calculateP1(P0, P2, C) {
    // Slope of the tangent line at P0 (perpendicular slope)
    let mt0 = (C.x - P0.x) / (P0.y - C.y);
    // Slope of the tangent line at P2 (perpendicular slope)
    let mt2 = (C.x - P2.x) / (P2.y - C.y);
  
    // Equation of tangent at P0: y1 = mt0 * (x1 - P0.x) + P0.y
    // Equation of tangent at P2: y1 = mt2 * (x1 - P2.x) + P2.y
  
    // Solve the system of equations to find x1
    let x1 = ((mt0 * P0.x - mt2 * P2.x) + (P2.y - P0.y)) / (mt0 - mt2);
    
    // Now solve for y1 using either equation
    let y1 = mt0 * (x1 - P0.x) + P0.y;
  
    return { x: x1, y: y1 };
  }

function putTextAlongPath(text, context, path, offset, y) {
    // Iterate through each character in the label text
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let charWidth = context.measureText(char).width;

        // Get the position and angle along the path at the current offset
        let point = path.node().getPointAtLength(offset);
        let nextPoint = path.node().getPointAtLength(offset + 1); // For angle calculation
        
        // Calculate the angle based on the tangent to the path
        let angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);

        // Save context state, translate to the point on the path, and rotate to match the angle
        context.save();
        context.translate(point.x, point.y);
        context.rotate(angle);
        // Draw the character
        context.fillText(char, 0, y); // Adjust centering

        // Restore the context state
        context.restore();

        // Update the offset for the next character
        offset += charWidth;
    }
}

function drawText(component, context, halfWidth, halfHeight, action) {
    if (action === "initial-0" || action === "initial-1") {
        return
    } else if (action === "initial-2") {
        if(component.Type !== "Principle")
            return
        } else if (action === "initial-3") {
            if(component.Type === "Dimension")
                return 
    }

    let color;
    if(component.Type === "Principle")
        color = '#218067';
    else 
        color = 'white';

    // Define the SVG path using D3.js (You can customize the path string as needed)
    let pathD;
    if(component.Type === 'Principle')
        pathD = "M 0 50 Q 50 80, 100 50 T 200 50";
    else
        pathD = "M 0 50 Q 50 20, 100 50 T 200 50";

    let pathKonva;
    if(component.Type === 'Principle')
        pathKonva = new Path2D("M 0 50 Q 50 80, 100 50 T 200 50");
    else
        pathKonva = new Path2D("M 0 50 Q 50 20, 100 50 T 200 50");

    // Create an invisible SVG path element to use with D3
    const svg = d3.create("svg").attr("width", 0).attr("height", 0);
    const path = svg.append("path").attr("d", pathD);

    if(component.Type === 'Principle')
        context.translate(-halfWidth, -1.3*halfHeight);
    else
        context.translate(-halfWidth, -1.3*halfHeight);

    const flippedTexts = ['P2', 'P3', 'P4', 'P5', 'Pe3', 'Pe4', 'Pe5', 'Pe6', 'D4', 'D5', 'D6', 'D7', 'D8'];
    
    if(flippedTexts.includes(component.Code)) {
        if(component.Type === 'Principle')
            context.translate(170, 100);
        else
            context.translate(170, 90);

        context.rotate(Math.PI);
    }
    // context.fillStyle = "black";
    // context.fill(pathKonva);
    
    const totalLength = path.node().getTotalLength();

    context.font = `500 11px Manrope`;
    context.fillStyle = color;

     // Find the index of the first space
 
    if(component.Code === "P6") {
        let firstIndex = component.Label.indexOf(' ');
        let firstPart = component.Label.substring(0, firstIndex);
        let secondPart = component.Label.substring(firstIndex + 1);

        let firstPartLength = context.measureText(firstPart).width; // Adjusted for letter spacing
        let secondPartLength = context.measureText(secondPart).width; // Adjusted for letter spacing
        let firstOffset = (2*halfWidth - firstPartLength)/2; // Center the text by subtracting half the text length from total path length
        let secondOffset = (2*halfWidth - secondPartLength)/2; // Center the text by subtracting half the text length from total path length

        putTextAlongPath(firstPart, context, path, firstOffset, -6)
        putTextAlongPath(secondPart, context, path, secondOffset, 6)
    } else {
        let textLength = context.measureText(component.Label).width; // Adjusted for letter spacing
        // This controls the spacing between characters
        let offset = (2*halfWidth - textLength)/2; // Center the text by subtracting half the text length from total path length
        //let offset = 0;

        putTextAlongPath(component.Label, context, path, offset, 0)
    }
}

// SVG Path drawing function
const drawBookmarkFilled = (component, context, shape, action, savedComponents, initialState) => {
    if(action === "learn" && !initialState && savedComponents.includes(component.Code)) {    
        const x = component.x;
        const y = component.y;
        const angle = component.angle;

        const halfWidth =  waveWidth / 2;
        const halfHeight =  waveHeight / 2;
    
        const bottom = { x: 0, y: halfHeight };
        const left = { x: -halfWidth, y: 0 };

        const rotation = Math.atan((bottom.y)/(left.x)) + Math.PI/2;
    
        context.beginPath();
        context.translate(x, y); // Start point

        // Start point
        if(component.Type !== "Principle") 
            context.rotate(angle);

        if(component.Type === "Principle")
            context.translate(waveWidth/2.3, -1.56*waveHeight); // Start point
        else if(component.Type === "Perspective")
            context.translate(waveWidth/20, -2.49*waveHeight); // Start point
        else if(component.Type === "Dimension")
            context.translate(waveWidth/8, -2.19*waveHeight); // Start point
        
        context.rotate(-rotation+ Math.PI/2);

        const scaleX = 1; // Scale factor for width (1.5 means 150% size)
        const scaleY = 1; // Scale factor for height (1.5 means 150% size)
        context.scale(scaleX, scaleY); // Scale the context
    
        // Add the rest of the path commands based on the SVG path data
        const path = new Path2D("m16.61,187.76c-1.55,1.27-3.06,2.51-4.57,3.74-.32.26-.61.55-.95.77-.18.11-.47.19-.65.12-.14-.05-.24-.36-.25-.55-.02-1.13-.01-2.27-.01-3.4,0-3.73,0-7.47,0-11.2,0-.84.08-.91.93-.91,3.68,0,7.36,0,11.04,0,.79,0,.88.09.88.91,0,4.79,0,9.59-.01,14.38,0,.28-.18.55-.28.83-.26-.1-.57-.14-.77-.31-1.78-1.43-3.54-2.88-5.36-4.37Z");
        context.fillStyle = "#da398f";
        context.fill(path);
        context.closePath();
        
        context.fillStrokeShape(shape);
    }
};

const getOpacity = (clickedIds, lineIds, hoveredId, currentId, component, action, selectedComponents) => {
    if (action === "initial-0" || action === "initial-1") {
        return 0.3
    } else if (action === "initial-2") {
        if(component.Type === "Principle")
            return 1
        else 
            return 0.3
    } else if (action === "initial-3") {
        if(component.Type === "Principle")
            return 0.7;
        else if(component.Type === "Perspective")
            return 1;
        else
            return 0.3
    } else if (action === "initial-4") {
        if(component.Type === "Principle")
            return 0.7;
        else if(component.Type === "Perspective")
            return 0.7;
        else
            return 1;
    }
    if(action === "get-inspired-carousel" || action === "get-inspired-search") {
        if(selectedComponents.includes(component.Code))
            return 1;
        else
            return 0.4;
    }

    if (clickedIds.includes(currentId) || lineIds.includes(currentId)) 
        return 1;
    if (hoveredId === currentId) 
        return 0.7;
    if (action ==="ideate" && clickedIds.length === 0) 
        return 0.4;  
    if(clickedIds.length === 0)
        return 1;
    
    return 0.4;
};

const getStroke = (clickedIds, currentId, component, action) => {
    if(clickedIds.includes(currentId) && (action === "get-inspired" || action === "get-inspired-search"))
        return pinkColor;
    else
        return colors[component.Type];
};

const getStrokeWidth = (clickedIds, currentId, component, action, selectedComponents) => {
    if(clickedIds.includes(currentId) && (action === "get-inspired" || action === "get-inspired-search") && selectedComponents.length === 0)
        return 4;
    if(clickedIds.includes(currentId) && (action === "get-inspired" || action === "get-inspired-search") && !selectedComponents.includes(component.Code))
        return 2;
    else if(clickedIds.includes(currentId) && (action === "get-inspired" || action === "get-inspired-search") && selectedComponents.includes(component.Code))
        return 4;
    else
        return 0.001;
};

const getGradientColor = (code, type, colors) => {
    // if (code === 'Pe1')
    //     return [0, colors.Perspective, 0.9, colors.Principle];
    // else if(code === 'D1')
    //     return [0, colors.Dimension, 0.9, colors.Perspective];
    if (type === 'Principle')
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

function getCorrespondingConcepts(concepts, code) {
    // Extract the number from the given tag (e.g. P1 -> 1, P2 -> 2)
    const codeNumber = code.slice(1);

    // Filter the array by matching the number in the `#code` (e.g., C1.a, C1.b... for P1)
    return concepts.filter(c => c.Code.startsWith(`C${codeNumber}.`));
}

export default OLCompass;
