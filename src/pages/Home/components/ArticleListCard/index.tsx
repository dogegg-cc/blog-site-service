import React from 'react';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { getPhotoUrl } from '@/utils/url';
import { formatTime } from '@/utils/time';
import type { Article } from '@/api/home';
import styles from './style.module.less';

interface ArticleListCardProps {
  article: Article;
  onClick?: () => void;
}

/**
 * ArticleListCard Component
 * Responsible for rendering an individual article card in a linear list layout.
 * Adheres to SRP by focused on the representation of a single article in list view.
 */
export const ArticleListCard: React.FC<ArticleListCardProps> = ({
  article,
  onClick,
}) => {
  return (
    <ArtisticCard className={styles.articleCard} onClick={onClick}>
      <div className={styles.articleImage}>
        <img
          src={getPhotoUrl(article.bannerItem)}
          alt={article.title}
          loading='lazy'
        />
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
  );
};

export default React.memo(ArticleListCard);
