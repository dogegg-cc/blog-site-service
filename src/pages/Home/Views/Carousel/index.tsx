import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { useNavigate } from 'react-router-dom';
import styles from './Carousel.module.less';
import type { Article, PageModule } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';

const CarouselItem: React.FC<{ module: PageModule }> = React.memo(
  ({ module }) => {
    const navigate = useNavigate();
    const { title, intro, content } = module;
    const { articles = [] } = content;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = useCallback(() => {
      if (currentIndex < articles.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, [currentIndex, articles.length]);

    const handlePrev = useCallback(() => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }, [currentIndex]);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
      const threshold = 100;
      if (info.offset.x < -threshold) {
        handleNext();
      } else if (info.offset.x > threshold) {
        handlePrev();
      }
    };

    // 卡片堆叠动画算法
    const getCardVariants = (index: number) => {
      const diff = index - currentIndex;

      // 已划过的卡片 (飞向左侧)
      if (diff < 0) {
        return {
          x: -1000,
          scale: 0.8,
          opacity: 0,
          zIndex: -10,
          rotate: -20,
        };
      }

      // 未到来的卡片 (向右后方堆叠)
      // 我们只展示前 4 张卡片在视觉堆叠中
      const visibleCount = 4;
      if (diff >= visibleCount) {
        return {
          opacity: 0,
          scale: 0.8,
          x: 400,
          zIndex: 0,
        };
      }

      // 处于堆叠中的卡片
      return {
        x: diff * 30, // 每张向右偏移 30px
        y: diff * -10, // 每张向上偏移 10px 增加深度感
        scale: 1 - diff * 0.05, // 每张缩小 5%
        zIndex: articles.length - index,
        opacity: 1 - diff * 0.1, // 越后越透明
        rotate: diff * 2, // 轻微旋转
      };
    };

    return (
      <section className={styles.immersiveSeries}>
        <div className='max-w-7xl mx-auto px-6'>
          <div className={styles.carouselContainer}>
            {/* 左侧/上方: 单元信息面板 */}
            <div className={styles.infoPanel}>
              <SectionReveal direction='right'>
                <h2 className={styles.unitTitle}>{title}</h2>
              </SectionReveal>
              <SectionReveal direction='right' delay={0.2}>
                <p className={styles.unitIntro}>{intro}</p>
              </SectionReveal>

              <SectionReveal direction='right' delay={0.4}>
                <div className={styles.sliderControls}>
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label='Previous'
                  >
                    <span className='material-symbols-outlined'>
                      chevron_left
                    </span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === articles.length - 1}
                    aria-label='Next'
                  >
                    <span className='material-symbols-outlined'>
                      chevron_right
                    </span>
                  </button>
                </div>
              </SectionReveal>
            </div>

            {/* 右侧/下方: 卡片堆叠核心区 */}
            <div className={styles.stackArea}>
              <AnimatePresence initial={false}>
                {articles.map((article: Article, index: number) => {
                  const variants = getCardVariants(index);
                  // 只渲染当前及之后的几张卡片以保证性能
                  if (index < currentIndex - 1 || index > currentIndex + 5)
                    return null;

                  return (
                    <motion.div
                      key={article.id}
                      className={styles.seriesCard}
                      drag={index === currentIndex ? 'x' : false} // 仅顶层卡片可拖拽
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      initial={false}
                      animate={variants}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <ArtisticCard 
                        className={styles.card}
                        onClick={() => navigate(`/articles/${article.id}`)}
                      >
                        <div className={styles.seriesImage}>
                          <img
                            src={getFullImageUrl(article.bannerUrl)}
                            alt={article.title}
                          />
                        </div>
                        <div className='flex justify-between items-center mb-2'>
                          <span className={styles.seriesId}>
                            {article.category.name}
                          </span>
                        </div>
                        <h4 className={styles.seriesTitle}>{article.title}</h4>
                        <p className={styles.seriesDesc}>{article.summary}</p>
                      </ArtisticCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

export default CarouselItem;
