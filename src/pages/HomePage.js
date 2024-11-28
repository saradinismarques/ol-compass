import React from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';

const HomePage = ({ colors }) => {
  return (
    <div>
      <OLCompass 
        colors={colors}
        mode="default"
        position="center" 
      /> 
      <Menu />
    </div>
  );
};

export default HomePage;