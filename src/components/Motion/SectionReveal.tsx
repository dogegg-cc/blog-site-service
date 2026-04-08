import React from 'react';
import { motion } from 'framer-motion';

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  amount?: number; // threshold for starting animation
}

const SectionReveal: React.FC<SectionRevealProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '',
  style = {},
  amount = 0.2
}) => {
  const directions = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, amount }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
