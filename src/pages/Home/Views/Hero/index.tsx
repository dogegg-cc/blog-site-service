import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import styles from './Hero.module.less';
import { type UserInfo } from '@/api/home';

const Hero: React.FC<{ info: UserInfo }> = React.memo(({ info }) => {
  return (
    <section className={styles.hero}>
      <div className='max-w-7xl mx-auto px-6 w-full'>
        <div className={styles.heroGrid}>
          <SectionReveal direction='right'>
            <h1 className={styles.heroTitle}>
              你好，我是<span>{info.name}</span>
            </h1>
            <p className={styles.heroDesc}>{info.slogan}</p>
            <div className={styles.heroSocial}>
              <a href={info.github} target='_blank' rel='noopener noreferrer'>
                <span className='material-symbols-outlined'>code</span>
              </a>
              <a href={`mailto:${info.email}`}>
                <span className='material-symbols-outlined'>mail</span>
              </a>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2} className={styles.sculptureWrapper}>
            <div className={styles.liquidSculpture} />
            <div className={styles.glowOrb} />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
});

export default Hero;
