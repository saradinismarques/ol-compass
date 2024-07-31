import React from 'react';
import OLDiagram from '../components/OLDiagram'

const HomePage = ({colors}) => {
  console.log("HOME PAGE");
  return (
    <div>
      <OLDiagram size="450" colors={colors} position="center-top" action="home" buttonsActive={false}/>
    </div>
  );
};

export default HomePage;