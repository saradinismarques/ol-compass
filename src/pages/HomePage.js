import React from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';

const HomePage = ({}) => {
  return (
    <>
      <OLCompass 
        mode="default"
        position="center" 
      /> 
      <Menu />
    </>
  );
};

export default HomePage;