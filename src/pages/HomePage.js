import React from 'react';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const HomePage = () => {
  return (
    <>
      <Compass 
        mode="default"
        position="fixed" 
      /> 
      <Description mode={'home'} />
      <Menu />
    </>
  );
};

export default HomePage;