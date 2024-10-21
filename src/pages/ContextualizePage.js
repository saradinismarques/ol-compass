import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import { ReactComponent as LockIcon } from '../assets/lock-icon.svg'; // Adjust the path as necessary

const ContextualizePage = ({colors}) => {
  return (
    <div>
      <OLCompass 
        colors={colors} 
        action="default" 
        position="left"
      />
        <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              See how OL applies to your locality
            </p>

            <div className="not-available-container">
              <LockIcon 
                className="lock-icon"
              />
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
