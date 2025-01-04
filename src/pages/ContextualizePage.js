import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const ContextualizePage = () => {
  return (
    <>
      <OLCompass 
        mode="default" 
        position={"center"}
      /> 
      <Description mode={'contextualize'}/>
      <Menu />
    </>
  );
};

export default ContextualizePage;
