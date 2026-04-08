import React from 'react';
import styles from './Home.module.less';
import Hero from './Views/Hero';
import ListItem from './Views/ListItem';
import GridItem from './Views/GridItem';
import ImmersiveSeries from './Views/ImmersiveSeries';
import VisualJournal from './Views/VisualJournal';
import { getHomeData, type HomeData, type PageModule } from '@/api/home';

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

  const renderModules = () => {
    if (!homeData?.pageModule) return null;
    return homeData.pageModule.map((module) => {
      switch (module.type) {
        case 'POST_LIST':
          return renderArticleView(module);
        case 'PHOTO_GALLERY':
          return <VisualJournal key={module.id} />;
        default:
          return null;
      }
    });
  };

  const renderArticleView = (item: PageModule) => {
    switch (item.styleType) {
      case 'list':
        return <ListItem module={item} />;
      case 'grid':
        return <GridItem module={item} />;
      case 'carousel':
        return <ImmersiveSeries />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      {renderHero()}
      {renderModules()}
    </div>
  );
};

export default Home;
