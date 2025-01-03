import React from 'react';
import OLCompass from '../components/OLCompass';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const ComparePage = () => {
  return (
    <>
      <Compass 
        mode="default" 
        position={"center"}
      /> 
      <Description mode={'compare'} />
      <Menu />
    </>
  );
};

export default ComparePage;
