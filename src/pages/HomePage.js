import React from 'react';
import OLCompass from '../components/OLCompass'
import Compass from '../components/Compass';
import Menu from '../components/Menu';

const HomePage = () => {
  return (
    <>
      <Compass 
        mode="default"
        position="center" 
      /> 
      <Menu />
    </>
  );
};

export default HomePage;