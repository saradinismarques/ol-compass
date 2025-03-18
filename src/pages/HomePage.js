import React, { useContext } from 'react';
import Compass from '../components/Compass';
import Menu from '../components/Menu';
import Description from '../components/Description';
import { StateContext } from "../State";

const HomePage = () => {
  const {
    showStudyInstruction,
  } = useContext(StateContext);

  return (
    <>
      <Compass 
        mode="default"
        position="fixed" 
      /> 
      {!showStudyInstruction &&
        <Description mode={'home'} />
      }
      <Menu />
    </>
  );
};

export default HomePage;