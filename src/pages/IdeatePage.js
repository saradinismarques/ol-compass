import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const IdeatePage = () => {
  return (
    <>
      <OLCompass 
        mode="default"
        position={"center"} 
      /> 
      <Description mode={'ideate'} />
      <Menu />
    </>
  );
};

export default IdeatePage;
