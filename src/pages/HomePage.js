import React from 'react';
import OLDiagram from '../components/OLDiagram'

const HomePage = ({colors}) => {
  return (
    <div>
      <OLDiagram size="450" colors={colors} action="home"/>
    </div>
  );
};

export default HomePage;