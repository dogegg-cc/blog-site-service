import React from 'react';
import styles from './Home.module.less';
import Hero from './Views/Hero';
import ListItem from './Views/ListItem';
import GridItem from './Views/GridItem';
import CarouselItem from './Views/Carousel';
import PhotoItem from './Views/Photo';
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
          return <PhotoItem key={module.id} module={module} />;
        default:
          return null;
      }
    });
  };

  const renderArticleView = (item: PageModule) => {
    switch (item.styleType) {
      case 'list':
        return <ListItem key={item.id} module={item} />;
      case 'grid':
        return <GridItem key={item.id} module={item} />;
      case 'carousel':
        return <CarouselItem key={item.id} module={item} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.homeContainer}>
      {renderHero()}
      {renderModules()}
    </div>
  );
};

export default Home;
