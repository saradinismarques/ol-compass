import React from 'react';
import OLCompass from '../components/OLCompass'

const HomePage = ({colors}) => {
  return (
    <div>
      <OLCompass colors={colors} action="home"/>
    </div>
  );
};

export default HomePage;