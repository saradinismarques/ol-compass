// Line.js
import React from 'react';
import { Line, Circle, Group } from 'react-konva'; // Make sure you have react-konva installed

const Lines = ({ lines, currentLine, lineColors, colorIndex }) => {
    return (
        <Group>
            {lines.map((line, index) => (
                <Group key={index}>
                    <Line
                        points={line.points}
                        stroke={line.color}
                        strokeWidth={2}
                        listening={false} // Disable listening to events
                    />
                    {line.points.map((_, pointIndex) => {
                        if (pointIndex % 2 === 0) {
                            return (
                                <Circle
                                    key={`${index}-${pointIndex}`}
                                    x={line.points[pointIndex]}
                                    y={line.points[pointIndex + 1]}
                                    radius={5}
                                    fill={line.color}
                                    listening={false} // Disable listening to events
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
                        points={currentLine}
                        stroke={lineColors[colorIndex]}
                        strokeWidth={2}
                        listening={false} // Disable listening to events
                    />
                    {currentLine.map((_, pointIndex) => {
                        if (pointIndex % 2 === 0) {
                            return (
                                <Circle
                                    key={`current-${pointIndex}`}
                                    x={currentLine[pointIndex]}
                                    y={currentLine[pointIndex + 1]}
                                    radius={5}
                                    fill={lineColors[colorIndex]}
                                    listening={false} // Disable listening to events
                                />
                            );
                        }
                        return null;
                    })}
                </Group>
            )}
        </Group>
    );
};

export default Lines;
