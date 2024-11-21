import React from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';

const HomePage = () => {
  return (
    <div>
      <OLCompass 
        mode="default"
        position="center" 
      /> 
      <Menu />
    </div>
  );
};

export default HomePage;