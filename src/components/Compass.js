import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { StateContext } from "../State.js";
import { getComponentsData } from '../utils/DataExtraction.js'; 
import Wave, { getComponents } from "./Wave.js"
import { cleanText } from '../utils/TextFormatting.js';

const Compass = ({ mode, position, onButtonClick, resetState, resetCompass, currentComponent, currentLinks, currentType, stateSaved }) => {
  // Size and screen resize handler
  let initialSize;
  if(mode === "map-2-pdf")
    initialSize = 497
  else
    initialSize = window.innerHeight/1.47;
  const [size, setSize] = useState(initialSize);

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
  const {
    showExplanation, 
    colors, 
    language
  } = useContext(StateContext);
        
  const components = getComponents(language, mode, compassType, size);
  const concepts = getComponentsData('concepts', language);

  // State of clicks and hovers
  const [hoveredId, setHoveredId] = useState(null);
   
  // Determine which components and setter to use based on mode
  const [selectedComponents, setSelectedComponents] = useState(stateSaved || []);

  // Tooltip
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipColor, setTooltipColor] = useState('black');
  
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
    }
  }, [resetCompass]);

  // Handlers
  const handleClick = (component) => {
    if (mode.startsWith("intro") || mode === "default" || mode === "map" || showExplanation) 
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
              wbc_links: component.wbc_links ?? null,
              region_feature: component.region_feature ?? null,
              country_e1: component.country_e1 ?? null,
              ce1_links: component.ce1_links ?? null,
              country_e2: component.country_e2 ?? null,
              ce2_links: component.ce2_links ?? null,

            });
          } else {
            Object.assign(componentData, {
              diff_code: component.diff_code ?? null,
              diff_label: component.diff_label ?? null,
              diff_paragraph: component.diff_paragraph ?? null,
              example_1: component.example_1 ?? null,
              example_2: component.example_2 ?? null,
              e1_codes: component.e1_codes ?? null,
              e2_codes: component.e2_codes ?? null,
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
    } else if(mode === "get-inspired-carousel") {
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
    } else if(mode === "map-2") {
      let limit = false;

      // Want to add a new one
      if(selectedComponents.length === 8 && !selectedComponents.includes(component.code))
        limit = true;

      setSelectedComponents(prevComponents => {
        const newComponents = prevComponents.includes(component.code)
          ? prevComponents.filter(code => code !== component.code) // Remove ID if already clicked
          : (!limit ? [...prevComponents, component.code] : prevComponents); // Add ID if not already clicked and under the limit
        
        return newComponents;
      });

      // Run onButtonClick after updating the components list
      if (onButtonClick) {
        if (!limit) {
          onButtonClick(
            component.code,
            component.label,
            cleanText(component.paragraph),
            component.type
          );
        } else {
          onButtonClick(null);
        }
      }
    } 
  };
  
  const handleMouseEnter = (e, component) => {
    if (mode.startsWith("intro") || mode === "default" || showExplanation) 
      return;

    setHoveredId(component.code);
    hoveredIdRef.current = component.code; 

    if(mode.startsWith("get-started") || mode === "learn-2")
      return;

    // Clear any existing timeout to avoid overlaps
    clearTimeout(tooltipTimeout);

    // Set a timeout to delay the appearance of the tooltip by 1 second
    tooltipTimeout = setTimeout(() => {
      if (hoveredIdRef.current === component.code) {  // Check if the tooltip was not cancelled
        setTooltipPos({ x: e.clientX, y: e.clientY });
        setTooltipText(component.tooltip);
        setTooltipColor(colors['Text'][component.type])
        setTooltipVisible(true);
      }
    }, 500); // 1-second delay
  };

  const handleMouseLeave = () => {
    setHoveredId(null);

    if(mode.startsWith("get-started") || mode === "learn-2")
      return;

    // Clear the tooltip timeout to prevent it from showing if mouse leaves
    clearTimeout(tooltipTimeout);

    // Set the cancellation flag to prevent tooltip from showing
    setTooltipVisible(false);
    setTooltipColor('black'); // Clear the tooltip text
    setTooltipText(""); // Clear the tooltip text
  };

  // Memoize handleKeyDown to avoid creating a new reference on each render
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setHoveredId(null);
      if(!stateSaved) setSelectedComponents([]);
      setTooltipPos({ x: 0, y: 0 });
      setTooltipVisible(false);
      setTooltipColor('black');
      setTooltipText('');

      if(resetState)
        resetState();
    }
  }, [resetState, stateSaved]);
    
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Dependency array includes handleKeyDown
  
  // Functions
  function convertLabel(label) {
    // Define a mapping of prefixes to their corresponding full names
    const enPrefixMap = {
        "P": "Principle",
        "Pe": "Perspective",
        "D": "Dimension"
    };  
    const ptPrefixMap = {
      "P": "Princípio",
      "Pe": "Perspectiva",
      "D": "Dimensão"
    };  

    // Use a regular expression to capture the prefix and the number
    const regex = /^([A-Za-z]+)(\d+)$/;
    const match = label.match(regex);

    if (match) {
        const prefix = match[1];
        const number = match[2];

        // Find the corresponding full name for the prefix
        let fullName;
        if(language === "pt")
          fullName = ptPrefixMap[prefix];
        else 
          fullName = enPrefixMap[prefix];

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
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.49 };
    else if (position === "center-2") 
      return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.505 };
    else if (position === "left") 
      return { x: window.innerWidth * 0.35, y: window.innerHeight * 0.5 }; // Adjust y for better positioning
    else if (position === "left-2") 
      return { x: window.innerWidth * 0.25, y: window.innerHeight * 0.505 };
    else if (position === "left-3") 
      return { x: window.innerWidth * 0.40, y: window.innerHeight * 0.5 };
    else if (position === "fixed") 
      return { x: window.innerWidth * 2/5, y: window.innerHeight * 0.5 };
  };

  const center = getCenter(position);

  // Styles
  let containerStyle = {
    position: 'fixed',   // Fixed position to stay in the specified location
    top: '0',            // Reset top for positioning
    left: '0',           // Reset left for positioning
    transform: `translate(-50%, -50%)`, // Centered offset
    //transition: 'left 0.1s ease, top 0.1s ease',
    borderRadius: '50%', // To make it a circular background if desired
    width: `${size}px`,
    height: `${size}px`,
    zIndex: 10,
  };

  let containerStylePDF = {
    width: 550,
    height: 550,
    backgroundColor: 'transparent',
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
        backgroundColor: 'white', // Tooltip background color
        color: tooltipColor, // Tooltip text color
        padding: '1vh', // Padding inside the tooltip
        borderRadius: '0.5vh', // Rounded corners
        border: `0.3vh solid ${tooltipColor}`,
        fontFamily: 'Manrope',
        fontWeight: '500',
        fontSize: '2vh',
        width: `${text.length * 0.60}vh`, // Dynamic width based on text length
        pointerEvents: 'none', // Prevents tooltip from interfering with hover
        opacity: 1,
        textAlign: 'center'
      }}
    >
      {text}
      {/* Triangle Outline */}
      <div
        style={{
          position: 'absolute',
          top: '100%', // Below the tooltip
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '1.1vh solid transparent',
          borderRight: '1.1vh solid transparent',
          borderTop: `2.2vh solid ${tooltipColor}`, // Outline color (slightly bigger)
        }}
      />

      {/* Triangle (Actual Pointer) */}
      <div
        style={{
          position: 'absolute',
          top: '100%', // Below the tooltip
          left: '50%',
          transform: 'translateX(-50%) translateY(-0.3vh)', // Moves it up to align properly
          width: '0',
          height: '0',
          borderLeft: '1vh solid transparent',
          borderRight: '1vh solid transparent',
          borderTop: '2vh solid white', // Matches tooltip background
        }}
      />
    </div>
  );

  return (
    <>       
      <div
        style={{
          ...(mode === "map-2-pdf" ? containerStylePDF : containerStyle),
          left: mode === "map-2-pdf" ? '' : `${center.x}px`,
          top: mode === "map-2-pdf" ? '' : `${center.y}px`,
        }}
      >
        {components.map((component, id) => (
          <div 
              key={id}
              style={{
                position: mode === "map-2-pdf" ? 'absolute' : '',
                top: mode === "map-2-pdf" ? '27px' : '',
                left: mode === "map-2-pdf" ? '28px' : '',
                
              }}
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
                  currentType={currentType}
                  hoveredId={hoveredId}
                  waveRef={null}
              />
            </div>
        ))}
      </div>
  
      {!showExplanation && (mode === "learn" || mode === "contribute" || mode === "map-2" || mode.startsWith("get-inspired")) && tooltipVisible && 
        <Tooltip 
          text={tooltipText} 
          position={tooltipPos} 
        />
      }
    </>
  );
} 

export default Compass;
