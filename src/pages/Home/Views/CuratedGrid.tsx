import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { GRID_ITEMS } from './Data';
import styles from '../Home.module.less';

const CuratedGrid: React.FC = () => {
  return (
    <section className={styles.curatedGrid}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal className={styles.gridHeader}>
            <h2 className={styles.sectionTitle}>The Curated Grid</h2>
            <p className={styles.sectionSubtitle}>A structural perspective on creative exploration.</p>
        </SectionReveal>

        <div className={styles.gridContent}>
            {GRID_ITEMS.map((item, i) => (
                <SectionReveal key={i} delay={i * 0.15}>
                    <ArtisticCard className={styles.gridCard}>
                        <div className={styles.gridImage}>
                            <img src={item.image} alt={item.title} />
                        </div>
                        <div className={styles.gridInfo}>
                           <span className={styles.gridCategory}>{item.category}</span>
                           <h4 className={styles.gridTitle}>{item.title}</h4>
                           <p className={styles.gridDesc}>{item.desc}</p>
                           <span className={styles.gridTags}>{item.tags}</span>
                        </div>
                    </ArtisticCard>
                </SectionReveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CuratedGrid;
