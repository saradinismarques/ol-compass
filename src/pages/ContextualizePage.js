import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';

const ContextualizePage = ({colors}) => {
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
            <div className="instruction-container">
              <svg 
                className='arrow-icon'
                fill="currentcolor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
               <polygon points="3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9"/>
              </svg>
                    
              <p className="instruction">
                Search the name of any body of water
              </p>
            </div>

            <div className="not-available-container">
              <svg 
                className="lock-icon"
                fill="currentcolor"
                xmlns="http://www.w3.org/2000/svg"  
                viewBox="0 0 64 64">
                <path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z"/>
              </svg>
              <p className='not-available'>
              Not Available Yet
              </p>
            </div>
        </div>
        <Menu />
    </div>
  );
};

export default ContextualizePage;
