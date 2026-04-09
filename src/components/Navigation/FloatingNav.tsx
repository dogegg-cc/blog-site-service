import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './FloatingNav.module.less';
import GlassSurface from '@/components/bits/GlassSurface/GlassSurface';
const NAV_ITEMS = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/articles' },
];

export const FloatingNav: React.FC = () => {
  const location = useLocation();
  const isArticleDetail = location.pathname.startsWith('/articles/') && location.pathname !== '/articles';

  if (isArticleDetail) return null;

  return (
    <motion.nav className={styles.navWrapper}>
      <GlassSurface
        className={styles.pillsContainer}
        borderRadius={50}
        displace={0.5}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        brightness={50}
        opacity={0.93}
        mixBlendMode='screen'
        height={60}
        backgroundOpacity={0.5}
      >
        <motion.div>
          <div className={styles.pillsList}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.span
                    layoutId='navUnderline'
                    className={styles.underline}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      </GlassSurface>
    </motion.nav>
  );
};

// Removed default export for stability
