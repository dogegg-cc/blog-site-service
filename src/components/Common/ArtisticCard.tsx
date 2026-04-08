import React from 'react';
import { motion } from 'framer-motion';
import styles from './ArtisticCard.module.less';

interface ArtisticCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}

const ArtisticCard: React.FC<ArtisticCardProps> = ({ 
  children, 
  className = '',
  hoverScale = 1.02
}) => {
  return (
    <motion.div
      className={`${styles.card} ${className}`}
      whileHover={{ 
        y: -8,
        scale: hoverScale,
        borderColor: 'rgba(243, 255, 205, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(243, 255, 205, 0.05)'
      }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ArtisticCard;
