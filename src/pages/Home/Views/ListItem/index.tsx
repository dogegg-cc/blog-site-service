import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import { useNavigate } from 'react-router-dom';
import { ArticleListCard } from '../../components/ArticleListCard';
import styles from './ListItem.module.less';
import sharedStyles from '../Common/Shared.module.less';
import type { PageModule } from '@/api/home';

const ListItem: React.FC<{ module: PageModule }> = React.memo(({ module }) => {
  const navigate = useNavigate();
  const { title, intro, content } = module;
  const { articles } = content;

  return (
    <section className={styles.musings}>
      <div className={styles.container}>
        <SectionReveal className={styles.musingsHeader}>
          <h2 className={sharedStyles.sectionTitle}>{title}</h2>
          <p className={sharedStyles.sectionSubtitle}>{intro}</p>
        </SectionReveal>
        <div className={styles.musingsList}>
          {articles?.map((article, i) => (
            <SectionReveal key={article.id} delay={i * 0.1}>
              <ArticleListCard 
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

export default ListItem;
