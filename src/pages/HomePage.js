import React from 'react';
import OLCompass from '../components/OLCompass'
import Menu from '../components/Menu';

const HomePage = ({colors}) => {
  return (
    <div>
      <OLCompass colors={colors} action="default-center"/>
      <Menu />
    </div>
  );
};

export default HomePage;