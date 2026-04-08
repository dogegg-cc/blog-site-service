import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import { PHOTOS } from '../Data';
import styles from './VisualJournal.module.less';
import sharedStyles from '../Common/Shared.module.less';

const VisualJournal: React.FC = () => {
  return (
    <section className={styles.visualJournal}>
        <div className={styles.journalHeader}>
            <h2 className={sharedStyles.sectionTitle}>Visual Journal</h2>
            <p className={sharedStyles.sectionSubtitle}>Snapshots of life outside the screen.</p>
        </div>
        
        <div className={styles.photoWallContainer}>
            <SectionReveal delay={0.1} className={styles.albumTitle}>MY ALBUM</SectionReveal>
            {PHOTOS.map((photo: any, i: number) => (
                <SectionReveal 
                  key={i} 
                  className={styles.photoPrint}
                  delay={photo.delay}
                  direction={photo.direction}
                  style={{ 
                      transform: `rotate(${photo.rotate}deg)`, 
                      top: photo.top, 
                      left: photo.left || 'auto', 
                      right: photo.right || 'auto', 
                      bottom: photo.bottom || 'auto',
                      width: photo.width,
                      position: photo.left || photo.top || photo.right || photo.bottom ? 'absolute' : 'relative'
                  } as React.CSSProperties}
                >
                    <div className={styles.photoWrapper} style={{ aspectRatio: photo.aspect }}>
                      <img src={photo.url} alt={`Snap ${i}`} />
                    </div>
                </SectionReveal>
            ))}
        </div>
    </section>
  );
};

export default VisualJournal;
