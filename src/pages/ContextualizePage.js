import React, { useState } from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import { getAIResponse } from '../utils/AI.js';

const ContextualizePage = ({colors}) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromtChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    const aiResponse = await getAIResponse(prompt);
    setResponse(aiResponse);
  }

  return (
    <div>
      <OLCompass colors={colors} action="default-left" />
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
            <div>
              <input type="text" value={prompt} placeholder={'Ex. Mediterranean Sea'} onChange={handlePromtChange}/>
              <button onClick={handleSubmit}>Ask AI</button>
              <p>AI Response: {response}</p>
            </div>
        </div>
        <Menu />
    </div>
  );
};

export default ContextualizePage;
