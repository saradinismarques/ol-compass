import React from 'react';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';

const ContextualizePage = () => {
  return (
    <>
      <Compass 
        mode="default" 
        position={"center"}
      /> 
      <Description mode={'contextualize'}/>
      <Menu />
    </>
  );
};

export default ContextualizePage;
