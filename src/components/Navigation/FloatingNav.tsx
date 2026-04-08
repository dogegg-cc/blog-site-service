import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './FloatingNav.module.less';

const NAV_ITEMS = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/articles' },
];

export const FloatingNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={styles.navWrapper}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div 
        className={styles.pillsContainer}
        animate={{ 
          scale: isScrolled ? 0.95 : 1,
          paddingLeft: isScrolled ? '1.5rem' : '2.5rem',
          paddingRight: isScrolled ? '1.5rem' : '2.5rem',
          backgroundColor: isScrolled ? 'rgba(26, 26, 26, 0.9)' : 'rgba(26, 26, 26, 0.4)'
        }}
        transition={{ duration: 0.5, ease: 'linear' }}
      >
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
                  layoutId="navUnderline"
                  className={styles.underline}
                  transition={{ duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

// Removed default export for stability
