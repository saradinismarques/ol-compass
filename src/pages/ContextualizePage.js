import React, { useState, useCallback, useMemo } from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import '../styles/ContextualizePage.css';
import { getAIResponse } from '../utils/AI.js';

const ContextualizePage = ({colors}) => {
  const initialState = useMemo(() => ({
    title: '',
    label: '',
    type: '',
    headline: '',
    paragraph: '',
    initialState: true,
    gradientColor: null
  }), []);

  const [state, setState] = useState(initialState);
  const [bodyOfWater, setBodyOfWater] = useState('');

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const handleDiagramClick = (title, label, type) => {
    setState((prevState) => ({
      ...prevState,
      title,
      label: label.toLowerCase(),
      type,
      gradientColor: colors[type]
    }));
  };

  const handleBodyOfWaterChange = (e) => {
    setBodyOfWater(e.target.value);
  };

  const handleSubmit = async () => {
    const prompt = `In the context of Ocean Literacy, rephrase the ${state.type} ${state.label} in respect to the ${bodyOfWater}. You must give me a title and paragraph with this information with 50 words maximum!! Format it like this: Title:add title here, Paragraph:add paragraph here. Don't print any bold text. `;
    const aiResponse = await getAIResponse(prompt);
    
    let reformattedResponse = aiResponse.replace(/\*/g, "") // Remove any remaining **
    .replace(/\n/g, ' '); // Remove extra new lines if needed

    console.log(reformattedResponse);
    let regex = /Title: (.*?) Paragraph: (.*)/;
    let matches = reformattedResponse.match(regex);

    if(matches === null) {
      regex = /^(.*?)(?=\s{2,})([\s\S]*)$/;;
      matches = reformattedResponse.match(regex);
    }

    console.log(matches[1]);
    console.log(matches[2]);
    setState((prevState) => ({
      ...prevState,
        headline: matches[1],
        paragraph: matches[2],
      initialState: false,
    }));
  }

  return (
    <div className='l-gradient-background'
      style={{
        background: state.initialState
          ? 'none'
          : `linear-gradient(to right, #ffffff 30%, ${state.gradientColor} 85%)`
      }}
    >
      <OLCompass 
        colors={colors} 
        action="contextualize" 
        onButtonClick={handleDiagramClick} 
        resetState={resetState}
      />
      <div className="c-search-container">
        <input 
          type="text" 
          className="c-search-bar" 
          placeholder={'Ex. Mediterranean Sea'} 
          value={bodyOfWater} 
          onChange={handleBodyOfWaterChange}
        />
        <button className="c-search-button" onClick={handleSubmit}>
          🔍
        </button>
      </div> 

      {state.initialState && (
      <>
        <div className='text-container'>
          <p className='question'>
            What's it for?
          </p>
          <p className='headline'>
            See how OL applies to your specific context
          </p>
          <p className='text'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className='instruction'>
            Search the name of any body of water
          </p>
        </div>
      </>
      )}

      {!state.initialState && (
        <>
        <div className="text-container">
          <h1 className='c-title'>{state.title}</h1>
          <h2 className='c-headline'>{state.headline}</h2>
          <div className='c-text'>
            <p>{state.paragraph}</p>
          </div>
        </div>
        </>
      )} 
      <Menu />
    </div>
  );
};

export default ContextualizePage;
