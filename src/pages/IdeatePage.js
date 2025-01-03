import React from 'react';
import OLCompass from '../components/OLCompass';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const IdeatePage = () => {
  return (
    <>
      <Compass 
        mode="default"
        position={"center"} 
      /> 
      <Description mode={'ideate'} />
      <Menu />
    </>
  );
};

export default IdeatePage;
