// src/components/OLDiagram.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, Layer, Shape, Group, Line, Circle } from 'react-konva';
import { getPrinciplesData, getPerspectivesData, getDimensionsData } from '../utils/Data.js'; 
import '../styles/OLDiagram.css'; 

const OLDiagram = ({size, colors, action, onButtonClick}) => {
    const waveDims = {
        "Principle": { Width: size/3.9, Height: size/5.7, CornerRadius: size/25 },
        "Perspective": { Width: size/3.0, Height: size/7.3, CornerRadius: size/8.5 },
        "Dimension": { Width: size/3.3, Height: size/6.8, CornerRadius: size/8.5 }
    };

    let centerOfCompass;
    const prefix = "initial"

    if(action.startsWith(prefix))
        centerOfCompass = {x:window.innerWidth/2, y: window.innerHeight/2 }
    else if(action === "home")
        centerOfCompass = {x:window.innerWidth/2, y: window.innerHeight*0.45 }
    else
        centerOfCompass = {x:window.innerWidth*0.35, y: window.innerHeight*0.45 }


    const principles = getPrinciples(getPrinciplesData(), centerOfCompass, waveDims.Principle);
    const perspectives = getPerspectives(getPerspectivesData(), centerOfCompass, size);
    const dimensions = getDimensions(getDimensionsData(), centerOfCompass, size);

    const [hoveredId, setHoveredId] = useState(null);
    const [clickedIds, setClickedIds] = useState([]);
    const [lines, setLines] = useState([]);  // Array of lines, each line is an array of points
    const [currentLine, setCurrentLine] = useState([]);  // Points for the current line being drawn
    const lineColors = useMemo(() => ['#f5b24e', '#f34be6', '#996dab', '#b2d260', '#b2d260'], []);  // Memoize lineColors
    const [colorIndex, setColorIndex] = useState(0);  // Index to track the current color
    const [lineIds, setLineIds] = useState([]);  // Index to track the current color
    const [currentLineIds, setCurrentLineIds] = useState([]);  // Index to track the current color

    const clickedIdsRef = useRef(clickedIds);
    const currentLineRef = useRef(currentLine);
    const colorIndexRef = useRef(colorIndex);
    const currentLineIdsRef = useRef(lineIds);
    const linesRef = useRef(lines);

    const handleClick = (arr, index) => (e) => {
        if (action === "initial" || action === "home")
            return;
        
        const id = e.target.id();

        if(action === "learn") {
            setClickedIds([id]);
            const title = convertLabel(arr[index].Code);

            if (onButtonClick) {
                onButtonClick(title, arr[index].Headline, arr[index].Paragraph, arr[index].ShowMoreText, arr[index].Type);
            }
        }

        else if(action === "get-inspired" || action === "analyze" || action === "ideate") {
            setClickedIds(prevClickedIds => 
                prevClickedIds.includes(id)
                ? prevClickedIds.filter(buttonId => buttonId !== id) // Remove ID if already clicked
                : [...prevClickedIds, id] // Add ID if not already clicked
            );
        }
        if(action === "ideate") {
            let pointX = arr[index].x;
            let pointY = arr[index].y;
            
            setCurrentLine(prevLinePoints => {
                // Check if the point already exists in the array
                const pointIndex = prevLinePoints.findIndex((_, idx) => {
                    return idx % 2 === 0 && prevLinePoints[idx] === pointX && prevLinePoints[idx + 1] === pointY;
                });

                if (pointIndex !== -1) {
                    return prevLinePoints.filter((_, idx) => idx !== pointIndex && idx !== pointIndex + 1);
                } else {
                    // Point does not exist, add it
                    return [...prevLinePoints, pointX, pointY];
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
        const prefix = "initial";
        if (action.startsWith(prefix) || action === "home")
            return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'pointer';

        const id = e.target.id();
        setHoveredId(id);
    };

    const handleMouseLeave = (e) => {
        // on ideate it should not return but see if inside or outside the circle
        if (action === "initial" || action === "home" || action === "ideate")
            return;

        const stage = e.target.getStage();
        stage.container().style.cursor = 'default';

        setHoveredId(null);
    };

     // Memoize handleKeyDown to avoid creating a new reference on each render
     const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setClickedIds([]);
            setHoveredId(null);
            setCurrentLine([]);
            setCurrentLineIds([]);
        } 
        else if (action === "get-inspired" && e.key === 'Enter') {
            if (onButtonClick) {
                onButtonClick(clickedIdsRef.current);
            }
        }
    }, [action, onButtonClick, lineColors]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Dependency array includes handleKeyDown

    // Update the ref whenever clickedIds changes
    useEffect(() => {
        clickedIdsRef.current = clickedIds;
    }, [clickedIds]);

    useEffect(() => {
        console.log(currentLine);
        currentLineRef.current = currentLine;
    }, [currentLine]);

    useEffect(() => {
        colorIndexRef.current = colorIndex;
    }, [colorIndex]);

    useEffect(() => {
        currentLineIdsRef.current = currentLineIds;
    }, [currentLineIds]);

    useEffect(() => {
        linesRef.current = lines;
        console.log(linesRef.current);
    }, [lines]);

    const [isInside, setIsInside] = useState(false);
    const circleRef = useRef({
        x: centerOfCompass.x, // Example center x
        y: centerOfCompass.y, // Example center y
        radius: size/2 + waveDims.Dimension.Height/2// Example radius
    });

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { x, y, radius } = circleRef.current;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const distance = Math.sqrt(
                Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
            );

            const currentLine = currentLineRef.current;

            if (action === "ideate" && distance > radius && mouseY <= window.innerHeight - 130) {
                if (currentLine.length > 0) {
                    console.log("POINTER");
                    document.body.style.cursor = 'pointer';
                } else {
                    console.log("DEFAULT");
                    document.body.style.cursor = 'default';
                }
            }
        };

        const handleClickOutside = (event) => {
            const { x, y, radius } = circleRef.current;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const distance = Math.sqrt(
                Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
            );

            if (action === "ideate" && distance > radius && mouseY <= window.innerHeight - 130) {
                
                const currentLine = currentLineRef.current;
                const colorIndex = colorIndexRef.current;
                const currentLineIds = currentLineIdsRef.current;

                if (currentLine.length > 0) {
                    setLines(prevLines => [...prevLines, { points: [...currentLine, mouseX, mouseY], color: lineColors[colorIndex] }]);
                    setCurrentLine([]);
                    setColorIndex((prevIndex) => (prevIndex + 1) % lineColors.length);
                    setLineIds(prevLineIds => [...prevLineIds, ...currentLineIds]);
                    setCurrentLineIds([])
                }
            } 
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [action]);

    return (
        //<div className={position}>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {principles.map((p, i) => (
                        <Shape
                            key={p.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(p, size, waveDims.Principle, action, context, shape);
                            }}
                            id={p.Code}
                            fill={colors.Principle}
                            stroke={colors.Principle}
                            strokeWidth={0.01}
                            onClick={handleClick(principles, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={getOpacity(clickedIds, lineIds, hoveredId, p.Code, p.Type, action)}
                        />
                    ))} 

                    {perspectives.map((p, i) => (
                        <Shape
                            key={p.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(p, size, waveDims.Perspective, action, context, shape);
                            }}
                            id={p.Code}
                            fillLinearGradientStartPoint={{ x: window.innerWidth / 2, y: -waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientEndPoint={{ x: window.innerWidth / 2, y: waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientColorStops={getGradientColor(p.Code, colors)}
                            stroke={colors.Perspective} 
                            strokeWidth={0.01}
                            onClick={handleClick(perspectives, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={getOpacity(clickedIds, lineIds, hoveredId, p.Code, p.Type, action)}
                        />
                    ))} 

                    {dimensions.map((d, i) => (
                        <Shape
                            key={d.Code}
                            sceneFunc={(context, shape) => {
                            drawWaveButton(d, size, waveDims.Dimension, action, context, shape);
                            }}
                            id={d.Code}
                            fillLinearGradientStartPoint={{ x: window.innerWidth / 2, y: -waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientEndPoint={{ x: window.innerWidth / 2, y: waveDims.Dimension['Height']/1.5 }}
                            fillLinearGradientColorStops={getGradientColor(d.Code, colors)}
                            stroke={colors.Dimension} 
                            strokeWidth={0.01}
                            onClick={handleClick(dimensions, i)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            opacity={getOpacity(clickedIds, lineIds, hoveredId, d.Code, d.Type, action)}
                        />
                    ))} 

                    {action === "ideate" && (
                        <Group>
                        {lines.map((line, index) => (
                        <Group key={index}>
                            <Line
                                key={index}
                                points={line.points}
                                stroke={line.color}  // Use corresponding color
                                strokeWidth={2}
                            />
                            {line.points.map((_, pointIndex) => {
                                if (pointIndex % 2 === 0) {
                                    return (
                                        <Circle
                                            key={`${index}-${pointIndex}`}
                                            x={line.points[pointIndex]}
                                            y={line.points[pointIndex + 1]}
                                            radius={5}
                                            fill={line.color}  // Use corresponding color
                                        />
                                    );
                                }
                                return null;
                            })}
                        </Group>
                        ))}
                        {currentLine.length > 0 && (
                        <Group>
                            <Line
                                key={'current'}
                                points={currentLine}
                                stroke={lineColors[colorIndex]}  // Use the current color
                                strokeWidth={2}
                            />
                            {currentLine.map((_, pointIndex) => {
                                if (pointIndex % 2 === 0) {
                                    return (
                                        <Circle
                                            key={`current-${pointIndex}`}
                                            x={currentLine[pointIndex]}
                                            y={currentLine[pointIndex + 1]}
                                            radius={5}
                                            fill={lineColors[colorIndex]}  // Use the current color
                                        />
                                    );
                                }
                                return null;
                            })}
                        </Group>
                        )}
                        </Group>
                    )}
                </Layer>   
        </Stage>
    //</div>
    
    );
};

function getPrinciples(principlesData, centerOfCompass, dims) {
    const x = centerOfCompass.x;
    const y = centerOfCompass.y;

    const width = dims['Width'];
    const height = dims['Height'];
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

function getPerspectives(perspectivesData, centerOfCompass, size) {
    const x = centerOfCompass.x;
    const y = centerOfCompass.y;
    const radius = size/2.8;
    const numComponents = 7;

    const perspectives = calculateAroundCirclePositions(perspectivesData, x, y, radius, numComponents);
    
    return perspectives;
}

function getDimensions(dimensionsData, centerOfCompass, size) {
    const x = centerOfCompass.x;
    const y = centerOfCompass.y;
    const radius = size/2;
    const numComponents = 10;

    const positions = calculateAroundCirclePositions(dimensionsData, x, y, radius, numComponents);
       
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

function drawWaveButton(component, size, componentDims, action, context, shape) { 
    const x = component.x;
    const y = component.y;
    const angle = component.angle;


    const width = componentDims.Width;
    const height = componentDims.Height;
    const cornerRadius = componentDims.CornerRadius;

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

    context.beginPath();
    context.moveTo(left.x, left.y);
    context.arcTo(top.x, top.y, right.x, right.y, cornerRadius);
    context.lineTo(right.x, right.y);
    context.arcTo(bottom.x, bottom.y, left.x, left.y, cornerRadius);
    context.closePath();
    context.fillStrokeShape(shape);

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
        color = '#21b185';
    else
        color = 'white';

    const flippedTexts = ['Pe3', 'Pe4', 'Pe5', 'Pe6', 'D4', 'D5', 'D6', 'D7', 'D8'];
    
    if(flippedTexts.includes(component.Code))
        context.rotate(Math.PI);
    // Draw main text
    // Calculate font size based on dimension
    const fontSize = size / 41; // Adjust as needed
    context.font = `500 ${fontSize}px Calibri`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Find the index of the first space
    const firstIndex = component.Label.indexOf(' ');
    // Split the string into two parts based on the first space
    const firstPart = component.Label.substring(0, firstIndex);
    const secondPart = component.Label.substring(firstIndex + 1);

    if(firstPart.length < 5)
        context.fillText(component.Label, 0, 0);
    else{
        context.fillText(firstPart, 0, -height/11);
        context.fillText(secondPart, 0, height/11);
    }

    // Draw identifier
    const LabelFontSize = size / 45; // Adjust as needed
    context.fillStyle = color;
    context.font = `400 ${LabelFontSize}px Calibri`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(component.Code, 0, - height / 4);
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

const getGradientColor = (code, colors) => {
    if (code === 'Pe1')
        return [0, colors.Perspective, 1, colors.Principle];
    else if(code === 'D1')
        return [0, colors.Dimension, 1, colors.Perspective];
    else if (code[0] === 'P')
        return [0, colors.Perspective, 1, colors.Perspective];   
    else if (code[0] === 'D')
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

export default OLDiagram;
