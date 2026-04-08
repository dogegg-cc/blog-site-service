import React from 'react';
import styles from './Home.module.less';
import Hero from './Views/Hero';
import Musings from './Views/Musings';
import CuratedGrid from './Views/CuratedGrid';
import ImmersiveSeries from './Views/ImmersiveSeries';
import VisualJournal from './Views/VisualJournal';
import { getHomeData, type HomeData } from '@/api/home';

const Home: React.FC = () => {
  const [homeData, setHomeData] = React.useState<HomeData | null>(null);

  const loadData = React.useCallback(async () => {
    const data = await getHomeData();
    setHomeData(data);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const renderHero = () => {
    if (homeData?.user) {
      return <Hero info={homeData.user} />;
    }
    return null;
  };

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      {renderHero()}
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
