import React from 'react';
import styles from './Home.module.less';
import Hero from './Views/Hero';
import Musings from './Views/Musings';
import CuratedGrid from './Views/CuratedGrid';
import ImmersiveSeries from './Views/ImmersiveSeries';
import VisualJournal from './Views/VisualJournal';

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <Hero />

      {/* Recent Musings */}
      <Musings />

      {/* Curated Grid */}
      <CuratedGrid />

      {/* Immersive Series (Slider) */}
      <ImmersiveSeries />

      {/* Visual Journal (Photo Wall) */}
      <VisualJournal />
    </div>
  );
};

export default Home;
