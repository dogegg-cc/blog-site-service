import React, { useMemo } from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import styles from './PhotoItem.module.less';
import sharedStyles from '../Common/Shared.module.less';
import type { PageModule } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';

const PhotoItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const { title, intro, content } = module;
  const { imageUrls = [] } = content;

  // 生成稳定的随机艺术布局配置
  const photoConfigs = useMemo(() => {
    const total = imageUrls.length;
    return imageUrls.map((url, index) => {
      const angle = (index / total) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const radiusX = 35 + Math.random() * 10;
      const radiusY = 35 + Math.random() * 10;

      const leftOffset = 50 + Math.cos(angle) * radiusX;
      const topOffset = 50 + Math.sin(angle) * radiusY;

      const rotate = Math.floor(Math.random() * 24) - 12;
      const width = 11 + Math.random() * 5;

      return {
        url: getFullImageUrl(url),
        rotate, // 将旋转角度单独提取，不要在 style 里和 translate 混合
        style: {
          top: `${topOffset}%`,
          left: `${leftOffset}%`,
          width: `${width}rem`,
          zIndex: Math.floor(Math.random() * 10) + 10,
        } as React.CSSProperties,
        delay: index * 0.1,
        direction: (['up', 'down', 'left', 'right'] as const)[
          Math.floor(Math.random() * 4)
        ],
        aspect: Math.random() > 0.5 ? '4/5' : '3/2',
      };
    });
  }, [imageUrls]);

  return (
    <section className={styles.visualJournal}>
      <div className={styles.journalHeader}>
        <SectionReveal>
          <h2 className={sharedStyles.sectionTitle}>{title}</h2>
        </SectionReveal>
      </div>

      <div className={styles.photoWallContainer}>
        {/* 背景大字增加艺术氛围：包裹一层静态定位容器以规避动画 Transform 覆盖 */}
        <div className={styles.titleAnchor}>
          <SectionReveal delay={0.1} className={styles.albumTitle}>
            {intro}
          </SectionReveal>
        </div>

        {photoConfigs.map((config, i) => (
          <div
            key={i}
            className={styles.photoAnchor}
            style={{ top: config.style.top, left: config.style.left }}
          >
            <SectionReveal
              className={styles.photoPrint}
              delay={config.delay}
              direction={config.direction}
              style={
                {
                  transform: `rotate(${config.rotate}deg)`,
                  width: config.style.width,
                  zIndex: config.style.zIndex,
                } as React.CSSProperties
              }
            >
              <div
                className={styles.photoWrapper}
                style={{ aspectRatio: config.aspect }}
              >
                <img src={config.url} alt={`Snap ${i}`} />
              </div>
              <div className={styles.photoFooter}>
                <span>IMG_{String(i + 1).padStart(2, '0')}</span>
              </div>
            </SectionReveal>
          </div>
        ))}
      </div>
    </section>
  );
});

export default PhotoItem;
