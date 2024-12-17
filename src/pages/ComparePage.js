import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const ComparePage = () => {
  return (
    <>
      <OLCompass 
        mode="default" 
        position={"center"}
      /> 
      <Description mode={'compare'} />
      <Menu />
    </>
  );
};

export default ComparePage;
