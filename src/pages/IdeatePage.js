import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const IdeatePage = ({ colors, isExplanationPage }) => {
  return (
    <>
      <OLCompass 
        colors={colors}
        mode="default"
        position={isExplanationPage ? "center" : "left"} 
      /> 
      <Description colors={colors} mode={'ideate'} />
      <Menu isExplanationPage={isExplanationPage} />
    </>
  );
};

export default IdeatePage;
