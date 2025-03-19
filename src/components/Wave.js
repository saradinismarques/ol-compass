import React, { useContext } from 'react';
import { StateContext } from "../State";
import { encodedFonts } from '../assets/fonts/Fonts.js';
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark-icon.svg'; // Adjust the path as necessary
import { getComponentsData } from '../utils/DataExtraction.js'; 

// SVG Path for button shape
const svgPath = "m82.54,14.01c-.44.31-.88.61-1.32.92-.54.38-1.09.77-1.63,1.16-.34.24-.69.48-1.03.72-.55.39-1.1.78-1.65,1.17-.55.38-1.09.76-1.64,1.15-.47.33-.93.66-1.4.99-.43.3-.86.6-1.29.9-.44.31-.89.62-1.34.93-.26.18-.51.35-.77.52-.29.19-.58.38-.88.56-.26.15-.52.29-.78.43-.36.19-.71.4-1.07.58-.62.3-1.24.59-1.87.86-.59.25-1.19.49-1.79.69-.95.31-1.91.63-2.9.83-.37.08-.74.18-1.12.25-.28.06-.57.09-.85.14-.38.06-.77.14-1.15.18-1.17.13-2.35.21-3.53.21-.19,0-.38,0-.57,0-.3,0-.6-.03-.9-.04-.37-.02-.74-.02-1.11-.05-.59-.06-1.18-.13-1.76-.22-.9-.14-1.79-.29-2.67-.52-.55-.14-1.1-.28-1.64-.44-.4-.12-.79-.26-1.19-.4-.34-.12-.68-.22-1.01-.36-.44-.19-.87-.38-1.31-.57-.41-.18-.82-.36-1.23-.54-.62-.27-1.23-.56-1.84-.84-.61-.28-1.21-.56-1.82-.85-.62-.29-1.24-.57-1.85-.85-.6-.28-1.2-.56-1.8-.84-.62-.29-1.25-.57-1.87-.86-.6-.28-1.19-.55-1.79-.83-.61-.28-1.22-.56-1.82-.84-.61-.28-1.21-.57-1.82-.85-.61-.28-1.23-.56-1.84-.84-.62-.28-1.23-.57-1.85-.86-.48-.22-.95-.44-1.43-.65-.36-.16-.73-.3-1.09-.44-.29-.11-.58-.21-.88-.31-.26-.09-.51-.19-.78-.27-.56-.16-1.13-.32-1.7-.45-.45-.11-.9-.19-1.35-.28-.37-.07-.75-.15-1.12-.21-.28-.05-.57-.07-.85-.11-.31-.04-.63-.09-.94-.11-.46-.04-.93-.06-1.39-.08-.34-.02-.68-.02-1.02-.03-.18,0-.36,0-.54,0-.38,0-.75-.01-1.13,0-.61.03-1.22.07-1.83.14-.63.07-1.25.18-1.88.27-.2.03-.4.07-.6.12-.3.06-.6.13-.89.2-.33.07-.65.14-.98.23-.59.16-1.17.35-1.75.51-.27.08-.52-.04-.63-.27-.12-.24-.06-.5.17-.67.29-.21.59-.42.89-.63.34-.24.68-.47,1.01-.7.47-.33.93-.66,1.4-.99.34-.24.68-.47,1.01-.7.55-.39,1.1-.78,1.65-1.17.55-.38,1.09-.76,1.64-1.15.55-.38,1.09-.77,1.63-1.16.55-.39,1.1-.78,1.65-1.16.65-.44,1.29-.88,1.96-1.29.65-.39,1.32-.75,1.99-1.09.55-.28,1.1-.55,1.67-.79,1.36-.56,2.74-1.05,4.16-1.41.55-.14,1.09-.29,1.64-.38,1.04-.18,2.09-.39,3.19-.43.38-.03.81-.1,1.24-.11.79-.01,1.59-.06,2.39,0,.46.03.93.03,1.4.08.64.06,1.27.12,1.9.22.89.14,1.78.29,2.65.53.57.15,1.15.29,1.71.47.75.24,1.49.51,2.23.79.39.15.77.32,1.16.48.1.05.21.09.32.13.63.28,1.26.58,1.89.87.59.27,1.17.54,1.76.81.62.29,1.24.57,1.85.86.52.24,1.03.47,1.55.71.61.28,1.21.57,1.82.85.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.6.28,1.19.55,1.79.83.62.29,1.25.57,1.87.86.46.22.92.46,1.38.66.63.28,1.26.55,1.89.81.32.13.65.23.98.34.38.13.76.29,1.15.4.62.18,1.24.34,1.86.49.39.1.78.16,1.17.24.3.06.6.13.91.18.54.08,1.09.14,1.63.2.15.02.3.04.44.05.37.02.75.04,1.13.06.26.02.52.04.79.05.42,0,.85-.02,1.27-.01.6,0,1.21-.04,1.81-.09.49-.04.99-.1,1.48-.16.82-.11,1.64-.22,2.45-.43.37-.09.75-.15,1.12-.25.64-.17,1.28-.37,1.93-.55.04-.01.09-.02.14-.02.24.02.42.16.48.37.06.23-.01.45-.22.6Z";
const svgTextPath = "m119.67,8.06c-7.54,3.59-12.67,7.32-27.44,8.01-16.45.77-25.71-4.5-32.34-7.85-7.56-3.55-12.7-7.29-27.47-7.91C15.97-.38,6.73,4.93.11,8.31";

const bigLabels = ['P6', 'D10'];

const Wave = ({ compassType, component, currentType, size, mode, selectedComponents, currentComponent, currentLinks, hoveredId, waveRef }) => {
  // Global Variables  
  const {
    colors,
    language,
    showExplanation,
    showInstruction,
    allComponents,
    opacityCounter,
    savedComponents,
    randomComponents
  } = useContext(StateContext);
      
  const waveWidth = size/2.6;
  const waveHeight = waveWidth*3;

  // Styles
  const getCursor = () => {
    if(compassType === "icon")
      return 'default';
    else if(mode.startsWith("intro") || mode === "home" 
    || showExplanation || compassType === "icon")
      return 'default';
    else if(mode === "map-2") {
      if(currentType === component.type)
        return 'pointer';
      else
        return 'default';
    }
    return 'pointer';
  }

  const buttonStyle = {
    position: 'absolute',
    cursor: getCursor(),
    pointerEvents: 'none', // Ensure buttons are clickable
    outline: 'none', // Prevent blue rectangle
  };

  let waveStyles;
  if(compassType === "default") {
    waveStyles = {
      left: component.x - waveWidth / 2,
      top: component.y - waveHeight / 2 - 2,
      textLeft: component.x - (waveWidth * 0.83) / 2,
      textTop: component.y - waveHeight / 2 - 2,
    }
  } else if(compassType === "draggable") {
    waveStyles = {
      left: 0,
      top: 0,
      textLeft: 0.35*waveWidth/4,
      textTop: 0,
    }
  } else if(compassType === "icon") {
    let gapX, gapY;
    if(mode === "map") {
      gapX = 54;
      gapY = 53;
    } else {
      gapX = 0;
      gapY = -2;
    }

    waveStyles = {
      left: component.x - waveWidth / 2 + gapX,
      top: component.y - waveHeight / 2 + gapY,
    }
  }

  const getWaveFill = () => {
    if(compassType === "default") {
      if(showExplanation)
        return colors['Wave'][component.type];
      // Learn 2.0
      if(hoveredId === component.code && mode !== "map-2")
        return colors['Wave'][component.type];
      else if (mode === "learn-2" && currentLinks !== null) {
          if(getType(selectedComponents) === 'Principle' && getType(component.code) === 'Principle')
            if(currentLinks.includes(component.code) && selectedComponents !== component.code)
              return "url(#waveGradient)"; // Return gradient reference if conditions are met
      } 
      // Map
      if(mode === "map")
        return "transparent";
      if(mode === "map-2") {
        if(currentType === 'Principle' && component.type === 'Principle')
          return colors['Wave'][component.type];
        else if(currentType === 'Perspective' && (component.type === 'Principle' ||component.type === 'Perspective'))
          return colors['Wave'][component.type];
        else if(currentType === 'Dimension')
          return colors['Wave'][component.type];
        else
          return '#dededd';
      }
      return colors['Wave'][component.type];
    } else if(compassType === "draggable") {
      return colors['Wave'][component.type];
    } else if(compassType === "icon") {
      if(currentType === null)
        return "#e3e4e3";
      if(component.type === currentType)
        return colors['Wave'][component.type];
      return "#e3e4e3";
    }
  }
    
  const getTextFill = () => {
    if(compassType === "default") {
      // Map
      if(mode === "map")
        return colors['Wave'][component.type];
      // Learn 2.0
      if (mode === "learn-2" && currentLinks !== null && !(getType(selectedComponents) === 'Principle' && getType(component.code) === 'Principle')) {
        if(component.type === getType(selectedComponents)) { // For the unlike, only of the same type
          if(currentLinks.includes(component.code) && selectedComponents !== component.code)
            return "#b84854"; // Return gradient reference if conditions are met
        } 
      }
      if(mode === "map-2") {
        if(currentType === 'Principle' && component.type === 'Principle')
          return colors['Label'][component.type];
        else if(currentType === 'Perspective' && (component.type === 'Principle' ||component.type === 'Perspective'))
          return colors['Label'][component.type];
        else if(currentType === 'Dimension')
          return colors['Label'][component.type];
        else
          return '#AAAAA9';
      }
      return colors['Label'][component.type];
    } else if(compassType === "draggable") {
      return colors['Label'][component.type];
    }
  }

  const getFontWeight = () => {
    // Learn 2
    if(mode === "learn-2" && selectedComponents === component.code)
      return '700';
    return '600';
  }

  const getBackgroundColor = () => {
    if(compassType === "default") {
      // Learn 2.0
      if (mode === "learn-2" && currentLinks !== null) {
        if(component.type !== getType(selectedComponents)) { // For the unlike, only of the same type
          if(currentLinks.includes(component.code) && selectedComponents !== component.code)
            return `url(#highlight-gradient-${component.code}-${currentLinks})`; // Return gradient reference if conditions are met
        }
      }
    } 
    return 'none';
  }
    
  const getStrokeFill = () => {
    if(compassType === "default") {
      // Get Started
      if(mode === "get-inspired" || mode === "get-inspired-search" || mode.startsWith("get-started")) {
        if(showExplanation)
          return 'none';
        if(selectedComponents.includes(component.code)) 
          return colors['Selection'];
      }
      // Learn 2
      if(mode === "learn-2" && showExplanation)
        return 'none';
      if(mode === "learn-2" && selectedComponents === component.code)
        return colors['Wave'][component.type];
      // Map
      if(mode === "map")
        return colors['Wave'][component.type];
      // Map 2
      if(mode === "map-2" && currentComponent === component.code)
        return colors['Text'][component.type];
      if(mode === "map-2-pdf")
        if(component.type === currentType && selectedComponents.includes(component.code))
          return colors['Text'][component.type];
      return 'none';
    } else if(compassType === "draggable" || compassType === "icon") {
      return 'none';
    } 
  };
    
  const getStrokeWidth = () => {
    if(compassType === "default") {
      // Learn 2
      if(mode === "learn-2" && selectedComponents === component.code)
        return "1.5px";
      // Map
      if(mode === "map")
        return "0.5px";
      // Map 2
      if(mode === "map-2" && currentComponent === component.code) 
        return "0.7px";
      if(mode === "map-2-pdf")
        if(component.type === currentType && selectedComponents.includes(component.code))
          return "1px";
      return "1.5px";
    } 
  };
    
  const getWaveOpacity = () => {
    if(compassType === "default") {
      // Intro
      if (mode === "intro-0" || mode === "intro-1" || mode === "intro-2" || mode === "intro-3")
        return 0.2;
      else if (mode === "intro-4") {
        if(component.type === "Principle") 
          if(allComponents.indexOf(component.code) <= opacityCounter['Principle'])
            return 1;
          else
            return 0.2;
        else 
          return 0.2;
      } else if (mode === "intro-5") {
        if(component.type === "Principle")
          return 0.2;
        else if(component.type === "Perspective")
          if(allComponents.indexOf(component.code) <= opacityCounter['Perspective']+7)
            return 1;
          else
            return 0.2;
        else
          return 0.2;
      } else if (mode === "intro-6") {
        if(component.type === "Principle")
          return 0.2;
        else if(component.type === "Perspective")
          return 0.2;
        else 
          if(allComponents.indexOf(component.code) <= opacityCounter['Dimension']+14)
            return 1;
          else
            return 0.2;
      } else if (mode === "intro-7") {
        return 1;
      } else if(mode === "intro-8") {
        if(component.type === "Principle")
          return 1;
        else
          return 0.2;
      } else if(mode === "intro-9") {
        if(component.type === "Perspective")
          return 1;
        else
          return 0.2;
      } else if(mode === "intro-10") {
        if(component.type === "Dimension")
          return 1;
        else
          return 0.2;
      } else if (mode === "intro-11" || mode === "intro-12" || mode === "intro-13")
        return 0.2;
      else if (mode === "intro-14") {
        if(randomComponents.includes(component.code))
          return 0.6;
        else
          return 0.1;
      } else if (mode === "intro-15" || mode === "intro-16") 
        return 0.2;
      // Explanation Page
      if(showExplanation && mode !== "map-2-pdf") 
        return 0.3;
      if(showInstruction && hoveredId !== component.code && mode !== "map-2-pdf" && mode === 'learn-2') 
        return 0.3;
      
      // Home 
      if(mode === "home") 
        return 0.3;

      // Learn 
      if(mode === "learn") {
        if(selectedComponents.length === 0)
          return 1;
        if(selectedComponents === component.code)
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else
          return 0.3;
      }
      // Learn 2.0
      if(mode === "learn-2") {
        if(selectedComponents === component.code)
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else if(getType(selectedComponents) === 'Principle' && getType(component.code) === 'Principle' && currentLinks !== null) {
          if(currentLinks.includes(component.code) && currentComponent !== component.code)
            return 1; // Return gradient reference if conditions are met
        }
        return 0.3;
      }
      // Get Started
      if(mode.startsWith("get-started-search")) {
        if(currentComponent === component.code)
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else
          return 0.2;
      } else if(mode.startsWith("get-started")) {
        if(selectedComponents.length === 0) 
          return 1;
        if (selectedComponents.includes(component.code)) 
          return 1;
        if (hoveredId === component.code) 
            return 0.8;
        return 0.3;
      }
      // Get Inspired
      if(mode === "get-inspired") {
        if (selectedComponents.includes(component.code)) 
          return 1;
        if (hoveredId === component.code) 
            return 0.8;
        return 0.3;
      }
      if(mode === "get-inspired-carousel" || mode === "get-inspired-search") {
        if(currentComponent.includes(component.code))   
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else
          return 0.3;
      }
      // Contribute
      if(mode === "contribute") {
        if(selectedComponents.length === 0) 
          return 1;
        if (selectedComponents.includes(component.code)) 
          return 1;
        if (hoveredId === component.code) 
            return 0.8;
        return 0.3;
      }
      // Map    
      if(mode === "map") 
          return 1;
      // Map 2
      if(mode === "map-2") {
        if (selectedComponents.includes(component.code)) 
          return 1;
        if(currentType === component.type)
          if (hoveredId === component.code) 
              return 0.8;
        return 0.3;
      }
      if(mode === "map-2-pdf") {
        if(currentType === 'All' && selectedComponents.includes(component.code)) 
          return 1;
        else if(component.type === currentType && selectedComponents.includes(component.code))
          return 1;
        else if(component.type !== currentType && selectedComponents.includes(component.code))
          return 1;
        else
          return 0.2;
      }
    } else if(compassType === "draggable") {
      // Map    
      if(currentType === 'All' || !currentType) 
        return 1;
      else if(component.type === currentType)
        return 1;
      else
        return 0.3;
    } else if(compassType === "icon") {
      if(currentType === null)
        return 0.5;
      if(component.type === currentType)
        return 0.9;
      return 0.3;
    } 
  };

  const getWaveTransition = () => {
    if(mode.startsWith("intro")) 
      return "opacity 0.15s ease-in-out";
    else
      return "none";
  }

  const getTextOpacity = () => {
    if(compassType === "default") {
      // Intro
      if (mode.startsWith("intro")) {
        if (mode === "intro-0" || mode === "intro-1" || mode === "intro-2" || mode === "intro-3" || mode === "intro-4" || mode === "intro-5" || mode === "intro-6") 
          return 0;
        else if(mode === "intro-7")
          return 1;
        else if(mode === "intro-8") {
          if(component.type === "Principle")
            return 1;
          else
            return 0.2;
        } else if(mode === "intro-9") {
          if(component.type === "Perspective")
            return 1;
          else
            return 0.2;
        } else if(mode === "intro-10") {
          if(component.type === "Dimension")
            return 1;
          else
            return 0.2;
        } else if (mode === "intro-11" || mode === "intro-12")
          return 0.2;
        else if (mode === "intro-13" || mode === "intro-14" || mode === "intro-15" || mode === "intro-16") 
          return 0;
      }
      // Explanation Page
      if(showExplanation && mode !== "map-2-pdf")
        return 1;

      // Home 
      if(mode === "home") 
        return 0.7;

      // Learn 
      if(mode === "learn") {
        if(selectedComponents.length === 0)
          return 1;
        if(selectedComponents === component.code)
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else
          return 0.8;
      }
      // Learn 2.0
      if(mode === "learn-2") {
        if(selectedComponents.length === 0)
          return 1;
        else if(selectedComponents === component.code)
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else if(currentLinks !== null){
          if(currentLinks.includes(component.code) && currentComponent !== component.code)
            return 1; // Return gradient reference if conditions are met
        }
        return 0.7;
      }
      // Get Started
      if(mode.startsWith("get-started-search")) {
        if(currentComponent === component.code)
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else
          return 0.7;
      } else if(mode.startsWith("get-started")) {
        if(selectedComponents.length === 0) 
          return 1;
        if (selectedComponents.includes(component.code)) 
          return 1;
        if (hoveredId === component.code) 
            return 0.8;
        return 0.7;
      }
    
      // Get Inspired
      if(mode === "get-inspired") {
        if (selectedComponents.includes(component.code)) 
          return 1;
        if (hoveredId === component.code) 
            return 0.8;
        return 0.7;
      }
      if(mode === "get-inspired-carousel" || mode === "get-inspired-search") {
        if(currentComponent.includes(component.code))
          return 1;
        else if(hoveredId === component.code) 
          return 0.8;
        else
          return 0.7;
      }
      // Contribute
      if(mode === "contribute") {
        if(selectedComponents.length === 0) 
          return 1;
        if (selectedComponents.includes(component.code)) 
          return 1;
        if (hoveredId === component.code) 
            return 0.8;
        return 0.7;
      }
      // Map    
      if(mode === "map") 
          return 1;
      // Map 2
      if(mode === "map-2") {
        if (selectedComponents.includes(component.code)) 
          return 1;
        if(currentType === component.type)
          if (hoveredId === component.code) 
              return 0.8;
        return 0.7;
      }
      if(mode === "map-2-pdf") {
        if(currentType === 'All' && selectedComponents.includes(component.code)) 
          return 1;
        else if(component.type === currentType && selectedComponents.includes(component.code))
          return 1;
        else if(component.type !== currentType && selectedComponents.includes(component.code))
          return 1;
        else  
          return 0.7;
      }
    } else if(compassType === "draggable") {
      if(currentType === 'All' || !currentType) 
        return 1;
      else if(component.type === currentType)
        return 1;
      else
        return 0.3;
    } else if(compassType === "icon") {
      if(currentType === null)
        return 1;
      if(component.type === currentType)
        return 0.9;
      return 0.3;
    } 
  };
  
  // Functions
  const isFlipped = () => {
    const flippedTexts = ['P2', 'P3', 'P4', 'P5', 'Pe3', 'Pe4', 'Pe5', 'D4', 'D5', 'D6', 'D7'];
  
    if(flippedTexts.includes(component.code)) 
      return false;
    return true;
  };
    
  const getText = (part) => {
    // Intro
    if (mode === "intro-0" || mode === "intro-1" || mode === "intro-2" || mode === "intro-3" || mode === "intro-4" || mode === "intro-5" || mode === "intro-6") 
      return "";
    else if (mode === "intro-13" || mode === "intro-14" || mode === "intro-15" || mode === "intro-16") 
      return "";
    // Explanation Page
    if(showExplanation && !mode.startsWith("intro") && mode !== "map-2-pdf")
      return "";
    if(bigLabels.includes(component.code)) {
      let firstIndex = component.label.indexOf(' ');
      let secondIndex = component.label.indexOf(' ', firstIndex + 1);
      let firstPart, secondPart;
  
      firstPart = component.label.substring(0, firstIndex); // "a"
      secondPart = component.label.substring(firstIndex + 1); // "b"
  
      if (firstPart.length > 9) {
        // Case 1: Only one space ("a b")
        firstPart = component.label.substring(0, firstIndex); // "a"
        secondPart = component.label.substring(firstIndex + 1); // "b"
      } else {
        // Case 2: Two spaces ("a b c")
        firstPart = component.label.substring(0, secondIndex); // "a b"
        secondPart = component.label.substring(secondIndex + 1); // "c"
      }
  
      if(part === 0)
        return firstPart;
      else
        return secondPart;
    }
    return component.label;
  };

  function getType(code) {
    // Define a mapping of prefixes to their corresponding full names
    const prefixMap = {
        "D": "Dimension",
        "Pe": "Perspective",
        "P": "Principle"
    };  
  
    // Use a regular expression to capture the prefix and the number
    const regex = /^([A-Za-z]+)(\d+)$/;
    const match = code.match(regex);
  
    if (match) {
        const prefix = match[1];
  
        // Find the corresponding full name for the prefix
        const type = prefixMap[prefix];
  
        if (type) {
            return type;
        }
    }
    // If the label doesn't match the expected pattern, return it unchanged
    return code;
  }
  
  const getLabelWidth = () => {
    // Count the number of "I" characters in the label
    const countI = component.label.split('I').length - 1;
    const remainingLetters = component.label.length-countI;

    return remainingLetters*1 + countI*0.5;    
  }

  return (
    <>
      <div
        style={{
          ...buttonStyle,
          left: `${waveStyles.left}px`, // Adjust position for button size
          top: `${waveStyles.top}px`,
          transform: `rotate(${component.angle}rad) ${component.type === "Principle" ? 'scaleY(-1)' : 'scaleY(1)'}`,
          zIndex: 1 // Layer filled shapes at the base
        }}
      >
        <svg viewBox="-5 0 100 20" width={waveWidth} height={waveHeight} style={{ pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="waveGradient" gradientTransform="rotate(0)">
              <stop offset="50%" stopColor={colors['Wave'][component.type]} stopOpacity="0.2" />
              <stop offset="80%" stopColor={colors['Wave'][component.type]} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Shape */}
          <path 
            ref={waveRef}
            d={svgPath} 
            fill={getWaveFill()}  // Use the gradient fill
            stroke="none" 
            style={{ 
              pointerEvents: 'all',
              transition: getWaveTransition() // Slower and smoother
            }}
            transition="opacity 1s ease"
            opacity={getWaveOpacity()} // Change opacity on hover
          />

          {/* Bookmark */}
          {compassType === 'default' && !showExplanation && savedComponents.some(item => item.code === component.code) &&
            <g transform={component.type === 'Principle' ? `scale(0.5) translate(2, 10.8) rotate(24)` : `scale(0.5) translate(160, 42.5) rotate(-155.5)`} 
            >
              <BookmarkIcon
                style={{
                  fill: colors['CBookmark'],
                  stroke: 'none'
                }}
            />
            </g>
          }

          {/* Outline Shape */}
          <path 
            d={svgPath} 
            fill="none"
            stroke={getStrokeFill()}
            strokeWidth={getStrokeWidth()}
            style={{ pointerEvents: 'all' }} 
          />

          {/* Text */}
          {compassType !== 'icon' && 
            <>
              <defs>        
                <style type="text/css">
                  {`
                    @font-face {
                      font-family: 'Manrope';
                      src: url(data:font/ttf;base64,${encodedFonts['Manrope-600']}) format('truetype');
                    }
                  `}
                </style>

                <path 
                  id={`text-path-${component.code}`} 
                  transform={component.type === 'Principle' ? "translate(0, 8) rotate(0.5) scale(0.7, -0.7)" : "translate(0, 8) rotate(-0.5) scale(0.7)"}
                  d={svgTextPath} 
                  style={{ 
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }} 
                />

                {/* Define the Gradient for Fading Highlight */}
                <linearGradient id={`highlight-gradient-${component.code}-${currentLinks}`} gradientUnits="userSpaceOnUse" x1="0%" x2="100%">
                  <stop offset="30%" stopColor={colors['Wave'][component.type]} stopOpacity="0"/>  {/* Start Transparent */}
                  <stop offset="60%" stopColor={colors['Wave'][component.type]} stopOpacity="1"/>  {/* Peak Opacity in the Middle */}
                  <stop offset="90%" stopColor={colors['Wave'][component.type]} stopOpacity="0"/>  {/* End Transparent */}
                </linearGradient>
              </defs>

              {/* Highlight */}
              {Array.from({ length: 5 }).map((_, index) => (
                  <path
                    key={`highlight-path-${component.code}-${index}`} // Unique key for each path
                    d={svgTextPath} // Same path as text
                    fill="none"
                    stroke={getBackgroundColor()} // Apply gradient for opacity fade
                    strokeWidth="15" // Dynamic stroke width
                    strokeLinecap="round"
                    transform={component.type === 'Principle' ? "translate(0, 7) rotate(0.5) scale(0.7)" : "translate(0, 8) rotate(-0.5) scale(0.7)"}
                  />
              ))}

              <text
                fill={getTextFill()}
                fontFamily='Manrope'
                fontWeight={getFontWeight()}
                fontSize={language === "pt" ? "0.33em" : "0.35em"}
                opacity={getTextOpacity()} // Change opacity on hover
                transform={isFlipped() 
                  ? (component.type === 'Principle' 
                      ? `rotate(180) translate(-84, -10.5) scale(1, -1)`  // Flipped and 'Principle' type
                      : `rotate(180) translate(-83, -26.5)`)  // Flipped but not 'Principle'
                  : (component.type === 'Principle' 
                      ? `translate(1, 16.5) scale(1, -1)`  // Not flipped and 'Principle' type
                      : `` // Not flipped but not 'Principle'
                  )
                }
                letterSpacing={getLabelWidth() > 10 ? "0.06em" : "0.15em"}
                dy={bigLabels.includes(component.code) ? '-0.13em' : '0.35em'} // Adjust this to center the text vertically on the path
                style={{ pointerEvents: 'none' }} // Ensure text doesn't interfere
              >
                <textPath
                  href={`#text-path-${component.code}`}
                  startOffset="50%" // Center text along the path
                  textAnchor="middle" // Ensure the text centers based on its length
                  style={{ 
                    pointerEvents: 'none',  
                    userSelect: 'none'
                  }} // Ensure textPath doesn't interfere
                >
                  {getText(0)} 
                </textPath>
              </text>

              {/* Second Line (if it has one) */}
              {bigLabels.includes(component.code) &&
                <text
                  fill={getTextFill()}
                  fontFamily='Manrope'
                  fontWeight={getFontWeight()}
                  fontSize={language === "pt" ? "0.33em" : "0.35em"}
                  opacity={getTextOpacity()} // Change opacity on hover
                  transform={isFlipped() 
                    ? (component.type === 'Principle' 
                        ? `rotate(180) translate(-84, -10.5) scale(1, -1)`  // Flipped and 'Principle' type
                        : `rotate(180) translate(-83, -26.5)`)  // Flipped but not 'Principle'
                    : (component.type === 'Principle' 
                        ? `scale(1, -1)`  // Not flipped and 'Principle' type
                        : `none` // Not flipped but not 'Principle'
                    )
                  }
                  letterSpacing={getLabelWidth() > 10 ? "0.08em" : "0.2em"}
                  dy="0.73em" // Adjust this to center the text vertically on the path
                  style={{ 
                    pointerEvents: 'none', 
                    userSelect: 'none'
                  }} // Ensure text doesn't interfere
                >
                  <textPath
                    href={`#text-path-${component.code}`}
                    startOffset="50%" // Center text along the path
                    textAnchor="middle" // Ensure the text centers based on its length
                    style={{ 
                      pointerEvents: 'none', 
                      userSelect: 'none'
                    }} // Ensure textPath doesn't interfere
                  >
                    {getText(1)}
                  </textPath>
                </text>
              }
            </>
          }
        </svg>
      </div>
    </>
  );
};

function getComponents(language, mode, compassType, size, draggableContainerPositions) {
  // Dictionary with all information
  let componentsData;

  if(compassType === 'default') {
    if(mode.startsWith("get-started")) 
      componentsData = getComponentsData('get-started', language);
    else if(mode === "learn")
      componentsData = getComponentsData('learn', language);
    else if(mode === "learn-2")
      componentsData = getComponentsData('learn-2', language);
    else if(mode.startsWith("map-2"))
      componentsData = getComponentsData('learn-2', language);
    else
      componentsData = getComponentsData('default', language);
  } else if(compassType === 'draggable') {
    componentsData = getComponentsData('get-started', language)
  } else if(compassType === 'icon') {
    componentsData = getComponentsData('default', language)
  }

  const principles = getComponentsPositions(compassType, componentsData, 'Principle', size, draggableContainerPositions);
  const perspectives = getComponentsPositions(compassType, componentsData, 'Perspective', size, draggableContainerPositions);
  const dimensions = getComponentsPositions(compassType, componentsData, 'Dimension', size, draggableContainerPositions);
  const components = principles.concat(perspectives, dimensions);

  return components;
}

function getComponentsPositions(compassType, data, type, size, draggableContainerPositions) {
  const componentsData = data[type] || [];
  const waveWidth = size/2.6;
  const waveHeight = waveWidth*3;
  let centerX, centerY;
  // Container Position
  let draggableTopPosition, draggableLeftPosition;
  
  if(compassType === "draggable") {
    centerX = window.innerWidth * 0.1599;
    centerY = window.innerHeight * 0.359;
    draggableTopPosition = draggableContainerPositions[0];
    draggableLeftPosition = draggableContainerPositions[1];
  } else {
    centerX = size/2;
    centerY = size/2;
  }

  const numberOfComponents = componentsData.length;

  let radius;

  if(type === 'Principle') radius = size/6.9;
  else if(type === 'Perspective') radius = size/2.93;
  else if(type === 'Dimension') radius = size/2;
  
  const angleStep = (2 * Math.PI) / numberOfComponents;
  let startAngle

  if(type === 'Principle')
    startAngle = -Math.PI/1.55;
  else
    startAngle = -Math.PI/2;

  for (let i = 0; i < numberOfComponents; i++) {
    let angle = i * angleStep + startAngle;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    if(type === 'Principle' && size >= 350)
      angle = angle + 2*Math.PI / 2 + Math.PI*0.02;
    else if(type === 'Principle' && size < 350 && size >= 215)
      angle = angle + 2*Math.PI / 2 + Math.PI*0.01;
    else if(type === 'Principle' && size < 215 && size >= 120)
      angle = angle + 2*Math.PI / 2 - Math.PI*0;
    else if(type === 'Principle' && size < 120  && size >= 100)
      angle = angle + 2*Math.PI / 2 - Math.PI*0.01;
    else if(type === 'Principle' && size < 100)
      angle = angle + 2*Math.PI / 2 - Math.PI*0.03;
    else if(type === 'Perspective')
      angle = angle + Math.PI / 2 - Math.PI*0.01;
    else if(type === 'Dimension')
      angle = angle + Math.PI / 2 - Math.PI*0.005;

    if(compassType === "default") {
      componentsData[i]["x"] = x;
      componentsData[i]["y"] = y;
      componentsData[i]["angle"] = angle;
    } else if(compassType === "draggable") {

      componentsData[i]["initialX"] = x - waveWidth/2 + window.innerWidth/2.95 - draggableLeftPosition;
      componentsData[i]["initialY"] = y - waveHeight/2 + window.innerHeight/7.083 - draggableTopPosition;
      componentsData[i]["initialAngle"] = angle;
      componentsData[i]["x"] = componentsData[i]["initialX"];
      componentsData[i]["y"] = componentsData[i]["initialY"];
      componentsData[i]["angle"] = componentsData[i]["initialAngle"];
      componentsData[i]["textareaX"] = x;
      componentsData[i]["textareaY"] = y;
      componentsData[i]["textareaData"] = "";
      componentsData[i]["arrowX1"] = x;
      componentsData[i]["arrowY1"] = y;
      componentsData[i]["arrowX2"] = x;
      componentsData[i]["arrowY2"] = y+window.innerHeight/4.87;
      componentsData[i]["textGapY2"] = window.innerHeight/365;
      componentsData[i]["topTip"] = true;
      componentsData[i]["rightTip"] = true;
    } else if(compassType === "icon") {
      componentsData[i]["x"] = x;
      componentsData[i]["y"] = y;
      componentsData[i]["angle"] = angle;
    }
  }
  return componentsData;
}

// Export both the Wave component and the function
export { Wave, getComponents };

export default Wave;