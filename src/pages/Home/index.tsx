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
      {/* Top Navigation */}
      <nav className={styles.topNav}>
          <div className={styles.navCapsule}>
              <a href="#" className={styles.navItemActive}>首页<span></span></a>
              <a href="#" className={styles.navItem}>文章</a>
          </div>
      </nav>

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

      {/* Footer */}
      <footer className={styles.footer}>
          <div className={styles.footerLinks}>
              <a href="#">GITHUB</a>
              <a href="#">EMAIL</a>
              <a href="#">TWITTER</a>
          </div>
          <p className={styles.copyright}>© Jiao Pengyou. Reg No. 88888888</p>
          <div className={styles.footerIcon}>
              <span className="material-symbols-outlined">stat_0</span>
          </div>
      </footer>
    </div>
  );
};

export default Home;
