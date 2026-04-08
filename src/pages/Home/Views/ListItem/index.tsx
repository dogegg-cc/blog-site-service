import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import styles from './ListItem.module.less';
import sharedStyles from '../Common/Shared.module.less';
import type { PageModule, Article } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';
import { formatTime } from '@/utils/time';

const ListItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const { title, intro, content } = module;
  const { articles } = content;

  const renderList = articles?.map((article: Article, i: number) => {
    return (
      <SectionReveal key={article.id} delay={i * 0.1}>
        <ArtisticCard className={styles.articleCard}>
          <div className={styles.articleImage}>
            <img src={getFullImageUrl(article.bannerUrl)} alt={article.title} />
          </div>
          <div className={styles.articleContent}>
            <div className={styles.articleMeta}>
              <span>{article.category.name}</span>
              <span className={styles.dot}>•</span>
              <span>{formatTime(article.createdAt)}</span>
            </div>
            <h3 className={styles.articleTitle}>{article.title}</h3>
            <p className={styles.articleDescText}>{article.summary}</p>
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
    <section className={styles.musings}>
      <div className='max-w-7xl mx-auto px-6'>
        <SectionReveal>
          <h2 className={sharedStyles.sectionTitle}>{title}</h2>
          <p className={sharedStyles.sectionSubtitle}>{intro}</p>
        </SectionReveal>
        <div className={styles.musingsList}>{renderList}</div>
      </div>
    </section>
  );
});

export default ListItem;
