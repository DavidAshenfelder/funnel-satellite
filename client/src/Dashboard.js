import React from 'react';
import FiveMinuteInfoCard from './components/FiveMinuteInfoCard';
import OneMinuteInfoCard from './components/OneMinuteInfoCard';
import SixHourGraph from './components/SixHourGraph';

export default function VerticalSlider() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <FiveMinuteInfoCard/>
      <SixHourGraph/>
      <OneMinuteInfoCard/>
    </div>
  );
}
