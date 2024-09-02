import React from 'react';
import OLCompass from '../components/OLCompass'

const HomePage = ({colors}) => {
  return (
    <div>
      <OLCompass colors={colors} action="default-center"/>
    </div>
  );
};

export default HomePage;