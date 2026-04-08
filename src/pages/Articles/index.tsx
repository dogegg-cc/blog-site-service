import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import styles from './Articles.module.less';

const ARTICLES = [
  { id: 1, title: 'The Architecture of Silence in UI', date: 'March 2024', category: 'Design' },
  { id: 2, title: 'Performance as Art', date: 'February 2024', category: 'Development' },
  { id: 3, title: 'Digital Impermanence', date: 'January 2024', category: 'Philosophy' },
];

const Articles: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className="max-w-7xl px-6 py-32">
        <SectionReveal>
          <h1 className={styles.pageTitle}>All Articles</h1>
          <p className={styles.pageSubtitle}>Thoughts, experiments, and observations.</p>
        </SectionReveal>

        <div className={styles.list}>
          {ARTICLES.map((article, i) => (
            <SectionReveal key={article.id} delay={i * 0.1}>
              <ArtisticCard className={styles.card}>
                <div className={styles.meta}>
                  <span>{article.category}</span>
                  <span className={styles.dot}>•</span>
                  <span>{article.date}</span>
                </div>
                <h2 className={styles.title}>{article.title}</h2>
              </ArtisticCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
