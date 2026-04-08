import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { ARTICLES } from '../Data';
import type { Article } from '../Data';
import styles from './Musings.module.less';
import sharedStyles from '../Common/Shared.module.less';

const Musings: React.FC = () => {
  return (
    <section className={styles.musings}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <h2 className={sharedStyles.sectionTitle}>Recent Musings</h2>
          <p className={sharedStyles.sectionSubtitle}>A deep dive into the intersection of code and aesthetics.</p>
        </SectionReveal>

        <div className={styles.musingsList}>
          {ARTICLES.map((article: Article, i: number) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <ArtisticCard className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <img src={article.image} alt={article.title} />
                </div>
                <div className={styles.articleContent}>
                  <div className={styles.articleMeta}>
                    <span>{article.category}</span>
                    <span className={styles.dot}>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                  <p className={styles.articleDescText}>{article.desc}</p>
                  <div className={styles.tags}>
                    {article.tags.map((tag: string) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </ArtisticCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Musings;
