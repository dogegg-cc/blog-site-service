import React, { useMemo } from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import styles from './PhotoItem.module.less';
import type { PageModule } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';
import GlitchText from '@/components/bits/GlitchText/GlitchText';
const PhotoItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const { title, content } = module;
  const { imageUrls = [] } = content;

  // 生成稳定的随机艺术布局配置
  const photoConfigs = useMemo(() => {
    // 简单的基于字符串的伪随机数生成器，确保渲染是纯函数
    const getStableRandom = (seed: string, offset: number) => {
      let hash = 0;
      const combinedSeed = seed + offset;
      for (let i = 0; i < combinedSeed.length; i++) {
        hash = (hash << 5) - hash + combinedSeed.charCodeAt(i);
        hash |= 0;
      }
      return (Math.abs(hash) % 1000) / 1000;
    };

    const total = imageUrls.length;
    return imageUrls.map((url, index) => {
      // 使用基于 url 的稳定随机数计算布局属性，确保结果是确定的（Pure）
      const seed = url || String(index);

      const angle =
        total > 0
          ? (index / total) * Math.PI * 2 +
            (getStableRandom(seed, 1) * 0.4 - 0.2)
          : 0;

      const radiusX = 35 + getStableRandom(seed, 2) * 10;
      const radiusY = 40 + getStableRandom(seed, 3) * 10;

      // 计算原始偏移
      let leftOffset = 50 + Math.cos(angle) * radiusX;
      let topOffset = 50 + Math.sin(angle) * radiusY;

      // 边界约束：确保照片中心点不会太靠近边缘，从而防止照片边缘溢出
      // 考虑到照片高度，top 限制在 15% - 85% 之间
      topOffset = Math.max(15, Math.min(85, topOffset));
      // left 限制在 12% - 88% 之间
      leftOffset = Math.max(12, Math.min(88, leftOffset));

      const rotate = Math.floor(getStableRandom(seed, 4) * 24) - 12;
      const width = 11 + getStableRandom(seed, 5) * 5;
      const zIndex = Math.floor(getStableRandom(seed, 6) * 10) + 10;
      const aspect = getStableRandom(seed, 7) > 0.5 ? '4/5' : '3/2';
      const directions = ['up', 'down', 'left', 'right'] as const;
      const direction = directions[Math.floor(getStableRandom(seed, 8) * 4)];

      return {
        url: getFullImageUrl(url),
        rotate,
        style: {
          top: `${topOffset}%`,
          left: `${leftOffset}%`,
          width: `${width}rem`,
          zIndex: zIndex,
        } as React.CSSProperties,
        delay: index * 0.1,
        direction,
        aspect,
      };
    });
  }, [imageUrls]);

  return (
    <section className={styles.visualJournal}>
      <div className={styles.journalHeader}>
        <GlitchText
          speed={3}
          enableShadows
          enableOnHover={false}
          className={styles.journalTitle}
        >
          {title}
        </GlitchText>
      </div>

      <div className={styles.photoWallContainer}>
        {/* 背景大字增加艺术氛围：包裹一层静态定位容器以规避动画 Transform 覆盖 */}
        <div className={styles.titleAnchor}>
          <SectionReveal delay={0.1} className={styles.albumTitle}>
            <GlitchText
              speed={3}
              enableShadows
              enableOnHover={false}
              className={styles.albumTitle}
            >
              {title}
            </GlitchText>
          </SectionReveal>
        </div>

        {/* 1. 桌面端展示模式：绝对定位 + 艺术散落 */}
        <div className={styles.desktopScatter}>
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
                  <img src={config.url} alt={`Snap ${i}`} loading='lazy' />
                </div>
              </SectionReveal>
            </div>
          ))}
        </div>

        {/* 2. 移动端展示模式：两列 Masonry 瀑布流（头部交错不对齐） */}
        <div className={styles.mobileMasonry}>
          {/* 左列 */}
          <div className={styles.masonryColumn}>
            {photoConfigs
              .filter((_, i) => i % 2 === 0)
              .map((config, i) => (
                <SectionReveal
                  key={`left-${i}`}
                  className={styles.photoPrint}
                  delay={config.delay * 0.5}
                  direction='up'
                  style={{ width: '100%', transform: 'none' }} // 移动端取消倾斜
                >
                  <div
                    className={styles.photoWrapper}
                    style={{ aspectRatio: config.aspect }}
                  >
                    <img src={config.url} alt={`Snap L-${i}`} loading='lazy' />
                  </div>
                </SectionReveal>
              ))}
          </div>
          {/* 右列 */}
          <div className={styles.masonryColumn}>
            {photoConfigs
              .filter((_, i) => i % 2 !== 0)
              .map((config, i) => (
                <SectionReveal
                  key={config.url}
                  className={styles.photoPrint}
                  delay={config.delay * 0.5}
                  direction='up'
                  style={{ width: '100%', transform: 'none' }}
                >
                  <div
                    className={styles.photoWrapper}
                    style={{ aspectRatio: config.aspect }}
                  >
                    <img src={config.url} alt={`Snap R-${i}`} loading='lazy' />
                  </div>
                </SectionReveal>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default PhotoItem;
