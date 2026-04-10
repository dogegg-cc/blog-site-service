import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import { useNavigate } from 'react-router-dom';
import { ArticleGridCard } from '../../components/ArticleGridCard';
import styles from './GridItem.module.less';
import sharedStyles from '../Common/Shared.module.less';
import type { PageModule } from '@/api/home';

const GridItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const navigate = useNavigate();
  const { title, intro, content } = module;
  const { articles } = content;

  return (
    <section className={styles.curatedGrid}>
      <div className={styles.container}>
        <SectionReveal className={styles.gridHeader}>
          <h2 className={sharedStyles.sectionTitle}>{title}</h2>
          <p className={sharedStyles.sectionSubtitle}>{intro}</p>
        </SectionReveal>
        <div className={styles.gridContent}>
          {articles?.map((article, i) => (
            <SectionReveal key={article.id} delay={i * 0.15}>
              <ArticleGridCard 
                article={article} 
                onClick={() => navigate(`/articles/${article.id}`)}
              />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
});

export default GridItem;
