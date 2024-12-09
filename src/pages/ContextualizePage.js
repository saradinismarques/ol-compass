import React from 'react';
import OLCompass from '../components/OLCompass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const ContextualizePage = ({ colors, isExplanationPage }) => {
  return (
    <>
      <OLCompass 
        colors={colors}
        mode="default" 
        position={isExplanationPage ? "center" : "left"}
      /> 
      <Description colors={colors} mode={'contextualize'} />
      <Menu isExplanationPage={isExplanationPage} />
    </>
  );
};

export default ContextualizePage;
