import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import { IMMERSIVE_SERIES } from '../Data';
import styles from './ImmersiveSeries.module.less';
import sharedStyles from '../Common/Shared.module.less';

const ImmersiveSeries: React.FC = () => {
  return (
    <section className={styles.immersiveSeries}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={styles.immersiveHeader}>
            <div>
              <h2 className={sharedStyles.sectionTitle}>Immersive Series</h2>
              <p className={sharedStyles.sectionSubtitle}>Swipe through the extended collection.</p>
            </div>
            <div className={styles.sliderControls}>
                <button><span className="material-symbols-outlined">chevron_left</span></button>
                <button><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
        </div>
        
        <div className={styles.immersiveSlider}>
            {IMMERSIVE_SERIES.map((series: any, i: number) => (
                <SectionReveal key={i} className={styles.seriesCard}>
                    <ArtisticCard>
                      <div className={styles.seriesImage}>
                          <img src={series.image} alt={series.title} />
                      </div>
                      <span className={styles.seriesId}>Series {series.id}</span>
                      <h4 className={styles.seriesTitle}>{series.title}</h4>
                      <p className={styles.seriesDesc}>{series.desc}</p>
                    </ArtisticCard>
                </SectionReveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ImmersiveSeries;
