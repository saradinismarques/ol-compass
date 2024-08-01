import React from 'react';
import OLDiagram from '../components/OLDiagram';

const MakeYoursPage = ({colors}) => {
  return (
    <div>
      <OLDiagram size="450" colors={colors} action="compare" />
        <div className='text-container'>
            <p className='question'>
              What's it for?
            </p>
            <p className='headline'>
              Customize the compass, tailor it, hack it!
            </p>
            <p className='text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className='not-available'>
                Not Available Yet
            </p>
        </div>
    </div>
  );
};

export default MakeYoursPage;
