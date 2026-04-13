import React from 'react';
import type { ArticleDetail as ArticleDetailData } from '@/api/article';
import { getPhotoUrl } from '@/utils/url';
import styles from '../ArticleDetail.module.less';

interface ArticleHeroProps {
  article: ArticleDetailData;
}

const ArticleHero: React.FC<ArticleHeroProps> = ({ article }) => {
  return (
    <header className={styles.heroSection}>
      <div className={styles.heroBg}>
        <img
          src={getPhotoUrl(article.bannerItem, 'high')}
          alt={article.title}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.heroContent}>
        <div className={styles.meta}>
          <span>{article.category?.name || 'Uncategorized'}</span>
          <span>{article.viewCount} Reads</span>
        </div>
        <h1 className={styles.title}>
          {article.title && article.title.includes(':') ? (
            <>
              {article.title.split(':')[0]}: <br />
              <span>{article.title.split(':')[1]}</span>
            </>
          ) : (
            article.title || 'Untitled Narrative'
          )}
        </h1>
        <div className={styles.tags}>
          {article.tags?.map((tag) => (
            <span key={tag.id} className={styles.tagItem}>
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default ArticleHero;
