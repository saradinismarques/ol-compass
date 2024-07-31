import React from 'react';
import OLDiagram from '../components/OLDiagram'

const HomePage = ({colors}) => {
  return (
    <div>
      <OLDiagram size="450" colors={colors} position="center-top" buttonsActive={false}/>
    </div>
  );
};

export default HomePage;