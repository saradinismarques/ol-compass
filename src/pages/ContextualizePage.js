import React , { useState, useEffect, useCallback, useRef, useContext } from 'react';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import { StateContext } from "../State";
import { useNavigate } from 'react-router-dom';
import CompassIcon from '../components/CompassIcon';
import { ReactComponent as SearchIcon } from '../assets/icons/search-icon.svg'; // Adjust the path as necessary
import '../styles/pages/ContextualizePage.css';

const ContextualizePage = () => {
  const {
      colors,
      isExplanationPage,
      setIsExplanationPage,
  } = useContext(StateContext);

  const [component, setComponent] = useState(null);
  const [bodyOfWater, setBodyOfWater] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const componentRef = useRef(component);
  
  useEffect(() => {
    componentRef.current = component; // Keep the ref in sync with the latest state
  }, [component]);

  document.documentElement.style.setProperty('--gray-color', colors['Gray']);
  document.documentElement.style.setProperty('--gray-hover-color', colors['Gray Hover']);

  // Reset state and UI elements
  const resetState = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const handleCompassClick = (code, label, type) => {
    if (code === null) 
      return;

    setComponent((prevComponent) => {
      const updatedComponent = {
        ...prevComponent,
        code,
        label,
        type,
      };
  
      // Update the ref
      componentRef.current = updatedComponent;
  
      return updatedComponent;
    });

    document.documentElement.style.setProperty('--text-color', colors['Text'][type]);
    document.documentElement.style.setProperty('--wave-color', colors['Wave'][type]);
  
    setIsExplanationPage(false);
  };

  const handleInputChange = (e) => {
    setBodyOfWater(e.target.value);
  };

  const handleSearch = useCallback(async () => {
    if (!component || !bodyOfWater) {
      alert("Please select a component and enter a body of water.");
      return;
    }
  
    setSearching(true);
    setLoading(true);
  
    const prompt = `In the context of Ocean Literacy, rephrase the ${component.type} ${component.label} in respect to the ${bodyOfWater} in 100 words maximum`;

    try {
      const response = await fetch("http://localhost:5000/generate-ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setAIResponse(data.result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching AI response:", error);
      setAIResponse("An error occurred. Please try again.");
    }
  }, [component, bodyOfWater]); // Dependencies added

  // Handle Enter key
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Enter') return;
      if(isExplanationPage) 
        setIsExplanationPage(false);
      else 
        handleSearch();
  }, [setIsExplanationPage, handleSearch, isExplanationPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  return (
    <>
      <div className={`ct-background ${isExplanationPage ? '' : 'gradient'}`}>
        <Compass
          mode="contextualize"
          position={isExplanationPage ? "center" : "left-3"}
          onButtonClick={handleCompassClick}
          resetState={resetState}
        />
        {isExplanationPage && 
          <Description mode={'contextualize'} />
        }

        {!isExplanationPage && (
          <>
            {component &&
              <CompassIcon 
                mode={"contextualize"}
                currentType={component.type} 
              />
            }

            <div className="ct-search-container">
              <input 
                type="text" 
                className="ct-search-bar" 
                placeholder={'Ex. Mediterranean Sea'} 
                value={bodyOfWater} 
                spellCheck="false"
                onChange={handleInputChange}
              />
              <button className="ct-search-button" onClick={handleSearch}>
                <SearchIcon className="ct-search-icon" />
              </button>
            </div> 

            {(!component || !bodyOfWater) &&
              <div className='ct-instruction'>
                Enter any body of water in the search bar and choose a Principle, Perspective or Dimension to check how it applies to that context.
              </div>
            }
            {searching &&
              <div className='ct-text-container'>
                <div className='ct-title'>
                  {`How does ${component.label} apply to the ${bodyOfWater?.replace(/\b\w/g, c => c.toUpperCase())}?`}
                </div>
                {loading &&
                  <div className='ct-paragraph'>
                    Loading response...
                  </div>
                }
                {!loading &&
                  <div className='ct-paragraph'>
                    {aiResponse}
                  </div>
                }
              </div>
            }
          </>
        )}
        <Menu />
      </div>
    </>
  );
};

export default ContextualizePage;
