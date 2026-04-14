import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { PageModule, PhotoItemDto } from '@/api/home';
import { getPhotoUrl } from '@/utils/url';
import styles from './PhotoItem.module.less';
import GlitchText from '@/components/bits/GlitchText/GlitchText';

/**
 * 复古电视机轮播组件 (移动端)
 */
const RetroTVCarousel: React.FC<{ photos: PhotoItemDto[] }> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextChannel = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevChannel = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // 自动播放逻辑：使用延迟重置策略，确保 5s 观赏期不被打断
  useEffect(() => {
    // 定义延时任务名
    const autoNext = () => {
      nextChannel();
    };

    // 启动延时
    const timer = setTimeout(autoNext, 5000);

    // 严密清理：无论是组件销毁还是手动切换(引发索引变化)，都必须清除之前的延时
    return () => clearTimeout(timer);
  }, [currentIndex, nextChannel]);

  // 复古电视机切换方案：改为慢慢淡入淡出
  const tvFadeVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8, // 慢慢显示
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6, // 慢慢隐藏
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={styles.mobileTVSection}>
      <div className={styles.tvContainer}>
        <div className={styles.antennaWrapper}>
          <div className={styles.antenna} />
          <div className={styles.antenna} />
        </div>
        <div className={styles.tvBody}>
          <div className={styles.tvScreenFrame}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                className={styles.tvContent}
                variants={tvFadeVariants}
                initial='initial'
                animate='animate'
                exit='exit'
              >
                <img src={getPhotoUrl(photos[currentIndex])} alt='TV Show' />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={styles.tvKnobs}>
            <div className={styles.knob} onClick={nextChannel} />
            <div className={styles.knob} onClick={prevChannel} />
            <div className={styles.speaker}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        <div className={styles.tvLegs}>
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

/**
 * 滚动行组件
 */
const MarqueeRow: React.FC<{
  items: PhotoItemDto[];
  direction: 'left' | 'right';
  speed: number;
}> = ({ items, direction, speed }) => {
  if (items.length === 0) return null;

  // 使用两组数据来实现无缝连接
  const doubleItems = [...items, ...items];

  return (
    <div className={styles.marqueeRow}>
      <div
        className={`${styles.marqueeContent} ${direction === 'left' ? styles.scrollLeft : styles.scrollRight}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubleItems.map((photo, index) => (
          <div key={`${photo.id}-${index}`} className={styles.photoWrapper}>
            <img
              src={getPhotoUrl(photo)}
              alt={photo.id}
              style={{ aspectRatio: photo.ratio }}
              loading='lazy'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 照片墙视图组件
 */
const PhotoItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const { content, title } = module;
  const { photoItems = [] } = content;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    // 初始化检查
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 分配照片到三行
  const rows = useMemo(() => {
    if (isMobile || photoItems.length === 0) return [[], [], []];

    const r1: PhotoItemDto[] = [];
    const r2: PhotoItemDto[] = [];
    const r3: PhotoItemDto[] = [];

    photoItems.forEach((item, index) => {
      if (index % 3 === 0) r1.push(item);
      else if (index % 3 === 1) r2.push(item);
      else r3.push(item);
    });

    return [r1, r2, r3];
  }, [photoItems, isMobile]);

  return (
    <section className={styles.visualJournal}>
      <div className={styles.maxContainer}>
        <div className={styles.headerTitle}>
          <GlitchText
            speed={3}
            enableShadows
            enableOnHover={false}
            className={styles.albumTitle}
          >
            {title}
          </GlitchText>
        </div>
        {/* 桌面端：滚动照片墙 */}
        {!isMobile && photoItems.length > 0 && (
          <div className={styles.desktopMarquee}>
            <MarqueeRow items={rows[0]} direction='left' speed={50} />
            <MarqueeRow items={rows[1]} direction='right' speed={70} />
            <MarqueeRow items={rows[2]} direction='left' speed={60} />
          </div>
        )}

        {/* 移动端：复古电视机轮播 */}
        {isMobile && photoItems.length > 0 && (
          <RetroTVCarousel photos={photoItems} />
        )}
      </div>
    </section>
  );
});

export default PhotoItem;
