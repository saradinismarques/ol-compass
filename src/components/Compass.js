import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { StateContext } from "../State.js";
import { getComponentsData } from '../utils/DataExtraction.js'; 
import Wave, { getComponents } from "./Wave.js"

const Compass = ({ mode, position, onButtonClick, resetState, resetCompass, selected, currentComponent, currentLinks }) => {
  // Size and screen resize handler
  const [size, setSize] = useState(window.innerHeight/1.47);

  useEffect(() => {
    // Function to update height on window resize
    const handleResize = () => {
      setSize(window.innerHeight/1.47);
    };
    // Add event listener for resize
    window.addEventListener('resize', handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Compass Type
  const compassType = "default";
  
  // Global Variables  
  const {colors} = useContext(StateContext);
        
  const components = getComponents(mode, compassType, size);

  const concepts = getComponentsData('concepts');

  // State of clicks and hovers
  const [hoveredId, setHoveredId] = useState(null);
   
  // Determine which components and setter to use based on mode
  const [selectedComponents, setSelectedComponents] = useState(selected || []);

  // Tooltip
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  
  // Declare a timeout variable to store the reference to the timeout
  let tooltipTimeout = null;

  const hoveredIdRef = useRef(hoveredId);
  
  useEffect(() => {
      hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  // Effect to handle reset
  useEffect(() => {
    if (resetCompass) {
      // Clear the selected buttons or reset the state
      setHoveredId(null);
      setSelectedComponents([]);
    }
  }, [resetCompass]);

  // Handlers
  const handleClick = (component) => {
    if (mode.startsWith("intro") || mode === "default" || mode === "get-inspired-carousel" || mode === "map") 
      return;
    
    if (mode === "learn") {
      // Check if the clicked ID is already in clickedIds
      if (selectedComponents === component.code) {
        // If it is, remove it and reset state
        setHoveredId(null);
        setSelectedComponents([]);

        if (onButtonClick) 
          onButtonClick(null);

      } else {
        const title = convertLabel(component.code);
        let correspondingConcepts = null;
        
        if (component.type === "Principle") 
          correspondingConcepts = getCorrespondingConcepts(concepts, component.code);
        
        setSelectedComponents(component.code);

        if (onButtonClick) {
          onButtonClick(
            component.code,
            title,
            component.headline,
            component.paragraph,
            component.type,
            correspondingConcepts
          );
        }
      }
    } else if (mode === "learn-2") {
      // Check if the clicked ID is already in clickedIds
      if (selectedComponents === component.code) {
        // If it is, remove it and reset state
        if (onButtonClick) 
          onButtonClick(null);

      } else {
        const title = convertLabel(component.code);
        
        setSelectedComponents(component.code);

        if (onButtonClick) {
          const componentData = {
            code: component.code,
            title,
            paragraph: component.paragraph,
            type: component.type,
          };
        
          if (component.type === 'Principle') {
            Object.assign(componentData, {
              phy: component.phy ?? null,
              geo: component.geo ?? null,
              che: component.che ?? null,
              bio: component.bio ?? null,
              phy_links: component.phy_links ?? null,
              geo_links: component.geo_links ?? null,
              che_links: component.che_links ?? null,
              bio_links: component.bio_links ?? null,

            });
          } else {
            Object.assign(componentData, {
              compared_paragraph: component.compared_paragraph ?? null,
              example_1: component.example_1 ?? null,
              example_2: component.example_2 ?? null,
              compared_code: component.compared_code ?? null,
              example_1_codes: component.example_1_codes ?? null,
              example_2_codes: component.example_2_codes ?? null,
            });
          }
        
          onButtonClick(componentData);
        }
      }
    } else if(mode.startsWith("get-started")) {
      const title = convertLabel(component.code);

      setSelectedComponents(prevComponents =>
        prevComponents.includes(component.code)
          ? prevComponents.filter(buttonId => buttonId !== component.code) // Remove ID if already clicked
          : [...prevComponents, component.code] // Add ID if not already clicked
      );
      
      if (onButtonClick) {
        onButtonClick(
          component.code,
          title,
          component.headline,
          component.type,
        );
      }
    } else if(mode === "get-inspired" || mode === "get-inspired-search") {
      setSelectedComponents(prevComponents => {
        const newComponents = prevComponents.includes(component.code)
          ? prevComponents.filter(buttonId => buttonId !== component.code) // Remove ID if already clicked
          : [...prevComponents, component.code]; // Add ID if not already clicked
        
        return newComponents;
      });
      
      if (onButtonClick) onButtonClick(component.code);
    } else if(mode === "contribute") {
      setSelectedComponents(prevComponents => {
        const newComponents = prevComponents.includes(component.code)
          ? prevComponents.filter(code => code !== component.code) // Remove ID if already clicked
          : [...prevComponents, component.code]; // Add ID if not already clicked
        
        return newComponents;
      });
      
      if (onButtonClick) onButtonClick(component.code);
    } 
  };
  
  const handleMouseEnter = (e, component) => {
    if (mode.startsWith("intro") || mode === "default" || mode === "map" || mode === "get-inspired-carousel") 
      return;

    setHoveredId(component.code);
    hoveredIdRef.current = component.code; 

    if(mode.startsWith("get-started") || mode === 'learn-2')
      return;

    if(component.type === "Principle") {
      // Clear any existing timeout to avoid overlaps
      clearTimeout(tooltipTimeout);

      // Set a timeout to delay the appearance of the tooltip by 1 second
      tooltipTimeout = setTimeout(() => {
        if (hoveredIdRef.current === component.code) {  // Check if the tooltip was not cancelled
          setTooltipPos({ x: e.clientX, y: e.clientY });
          setTooltipText(component.tooltip);
          setTooltipVisible(true);
        }
      }, 500); // 1-second delay
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);

    if(mode.startsWith("get-started") || mode === "learn-2")
      return;

    // Clear the tooltip timeout to prevent it from showing if mouse leaves
    clearTimeout(tooltipTimeout);

    // Set the cancellation flag to prevent tooltip from showing
    setTooltipVisible(false);
    setTooltipText(""); // Clear the tooltip text
  };

  // Memoize handleKeyDown to avoid creating a new reference on each render
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setHoveredId(null);
      setSelectedComponents([]);
      setTooltipPos({ x: 0, y: 0 });
      setTooltipVisible(false);
      setTooltipText('');

      if(resetState)
        resetState();
    }
  }, [resetState]);
    
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Dependency array includes handleKeyDown
  
  // Functions
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
    return concepts.filter(c => c.code.startsWith(`C${codeNumber}.`));
  }

  // Function to determine the center based on position
  const getCenter = (position) => {
    if (position === "center")
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.47 };
    else if (position === "center-2") 
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.505 };
    else if (position === "left") 
      return { x: window.innerWidth * 0.35, y: window.innerHeight * 0.47 }; // Adjust y for better positioning
    else if (position === "left-2") 
      return { x: window.innerWidth * 0.25, y: window.innerHeight * 0.505 };
    else if (position === "left-3") 
      return { x: window.innerWidth * 0.41, y: window.innerHeight * 0.47 };
  };

  const center = getCenter(position);

  // Styles
  let containerStyle = {
    position: 'fixed',   // Fixed position to stay in the specified location
    top: '0',            // Reset top for positioning
    left: '0',           // Reset left for positioning
    transform: `translate(-50%, -50%)`, // Centered offset
    borderRadius: '50%', // To make it a circular background if desired
    width: `${size}px`,
    height: `${size}px`,
  };

  // Other Components
  const Tooltip = ({ text, position }) => (
    <div
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -110%)', // Adjusts the position above the button
        zIndex: 1000,
        backgroundColor: colors['Gray Hover'], // Tooltip background color
        color: 'white', // Tooltip text color
        padding: '1vh', // Padding inside the tooltip
        borderRadius: '0.5vh', // Rounded corners
        fontFamily: 'Manrope',
        fontSize: '2vh',
        width: `${text.length * 0.6}vh`, // Dynamic width based on text length
        pointerEvents: 'none', // Prevents tooltip from interfering with hover
        opacity: 0.9
      }}
    >
      {text}
      {/* Tooltip pointer */}
      <div
        style={{
          position: 'fixed',
          top: '100%', // Positions pointer below the tooltip box
          left: '50%',
          marginLeft: '-1vh', // Centers the pointer
          width: '0',
          height: '0',
          borderLeft: '1vh solid transparent',
          borderRight: '1vh solid transparent',
          borderTop: '2vh solid #acaaaa', // Matches tooltip background
          opacity: 0.9
        }}
      />
    </div>
  );

  return (
    <>       
      <div 
        style={{
          ...containerStyle, 
          left: `${center.x}px`, 
          top: `${center.y}px`,
        }}
      >
        {components.map((component, id) => (
          <div 
              key={id}
              onClick={() => handleClick(component)}
              onMouseEnter={(e) => handleMouseEnter(e, component)}
              onMouseLeave={() => handleMouseLeave(component)}
          >
              <Wave 
                  compassType={compassType}
                  component={component}
                  size={size}
                  mode={mode}
                  selectedComponents={selectedComponents}
                  currentComponent={currentComponent}
                  currentLinks={currentLinks}
                  hoveredId={hoveredId}
                  waveRef={null}
              />
            </div>
        ))}
      </div>
  
      {(mode === "learn" || mode === "contribute" || mode.startsWith("get-inspired")) && tooltipVisible && 
        <Tooltip 
          text={tooltipText} 
          position={tooltipPos} 
        />
      }
    </>
  );
} 

export default Compass;
