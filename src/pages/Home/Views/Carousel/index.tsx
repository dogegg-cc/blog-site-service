import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import styles from './Carousel.module.less';
import sharedStyles from '../Common/Shared.module.less';
import type { Article, PageModule } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';

const CarouselItem: React.FC<{ module: PageModule }> = React.memo(
  ({ module }) => {
    const { title, intro, content } = module;
    const { articles } = content;

    const renderList = articles?.map((article: Article) => {
      return (
        <SectionReveal key={article.id} className={styles.seriesCard}>
          <ArtisticCard>
            <div className={styles.seriesImage}>
              <img
                src={getFullImageUrl(article.bannerUrl)}
                alt={article.title}
              />
            </div>
            <span className={styles.seriesId}>{article.category.name}</span>
            <h4 className={styles.seriesTitle}>{article.title}</h4>
            <p className={styles.seriesDesc}>{article.summary}</p>
          </ArtisticCard>
        </SectionReveal>
      );
    });

    return (
      <section className={styles.immersiveSeries}>
        <div className='max-w-7xl mx-auto px-6'>
          <div className={styles.immersiveHeader}>
            <div>
              <h2 className={sharedStyles.sectionTitle}>{title}</h2>
              <p className={sharedStyles.sectionSubtitle}>{intro}</p>
            </div>
            <div className={styles.sliderControls}>
              <button>
                <span className='material-symbols-outlined'>chevron_left</span>
              </button>
              <button>
                <span className='material-symbols-outlined'>chevron_right</span>
              </button>
            </div>
          </div>

          <div className={styles.immersiveSlider}>{renderList}</div>
        </div>
      </section>
    );
  },
);

export default CarouselItem;
