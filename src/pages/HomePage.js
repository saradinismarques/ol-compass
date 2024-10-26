import React from 'react';
import OLCompass from '../components/OLCompass'
import CircleMenu from '../components/CircleMenu'; // Adjust the import path if needed
import Menu from '../components/Menu';

const HomePage = () => {
  return (
    <div>
      {/* <OLCompass 
        action="default"
        position="center" 
      /> */}
      <CircleMenu 
        action="default"
        position="center" 
      />
      <Menu />
    </div>
  );
};

export default HomePage;