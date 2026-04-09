import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { useNavigate } from 'react-router-dom';
import styles from './GridItem.module.less';
import sharedStyles from '../Common/Shared.module.less';
import type { PageModule, Article } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';

const GridItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const navigate = useNavigate();
  const { title, intro, content } = module;
  const { articles } = content;

  const renderList = articles?.map((article: Article, i: number) => {
    return (
      <SectionReveal key={article.id} delay={i * 0.15}>
        <ArtisticCard 
          className={styles.gridCard}
          onClick={() => navigate(`/articles/${article.id}`)}
        >
          <div className={styles.gridImage}>
            <img src={getFullImageUrl(article.bannerUrl)} alt={article.title} />
          </div>
          <div className={styles.gridInfo}>
            <span className={styles.gridCategory}>{article.category.name}</span>
            <h4 className={styles.gridTitle}>{article.title}</h4>
            <p className={styles.gridDesc}>{article.summary}</p>
            <div className={styles.tags}>
              {article.tags.map((tag) => (
                <span key={tag.id}>#{tag.name}</span>
              ))}
            </div>
          </div>
        </ArtisticCard>
      </SectionReveal>
    );
  });

  return (
    <section className={styles.curatedGrid}>
      <div className='max-w-7xl mx-auto px-6'>
        <SectionReveal className={styles.gridHeader}>
          <h2 className={sharedStyles.sectionTitle}>{title}</h2>
          <p className={sharedStyles.sectionSubtitle}>{intro}</p>
        </SectionReveal>
        <div className={styles.gridContent}>{renderList}</div>
      </div>
    </section>
  );
});

export default GridItem;
