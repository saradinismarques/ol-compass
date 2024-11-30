import React from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';

const HomePage = ({ colors }) => {
  return (
    <>
      <OLCompass 
        colors={colors}
        mode="default"
        position="center" 
      /> 
      <Menu />
    </>
  );
};

export default HomePage;