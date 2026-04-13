import React from 'react';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { getFullImageUrl } from '@/utils/url';
import type { Article } from '@/api/home';
import styles from './style.module.less';

interface ArticleGridCardProps {
  article: Article;
  onClick?: () => void;
}

/**
 * ArticleGridCard Component
 * Responsible for rendering an individual article card in a grid layout.
 * Adheres to SRP by focusing only on the presentation of a single article.
 */
export const ArticleGridCard: React.FC<ArticleGridCardProps> = ({
  article,
  onClick,
}) => {
  return (
    <ArtisticCard className={styles.gridCard} onClick={onClick}>
      <div className={styles.gridImage}>
        <img
          src={getFullImageUrl(article.bannerItem?.metadata?.mediumUrl)}
          alt={article.title}
          loading='lazy'
        />
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
  );
};

export default React.memo(ArticleGridCard);
