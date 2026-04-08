import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import styles from './Hero.module.less';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className='max-w-7xl mx-auto px-6 w-full'>
        <div className={styles.heroGrid}>
          <SectionReveal direction='right'>
            <h1 className={styles.heroTitle}>
              你好，我是<span>焦朋友</span>
            </h1>
            <p className={styles.heroDesc}>
              一个不太靠谱的程序猿
              <br />
              一直在尝试重构人生，结果发现最稳定的状态竟然是“凑合着活”。
            </p>
            <div className={styles.heroSocial}>
              <a href='#'>
                <span className='material-symbols-outlined'>code</span>
              </a>
              <a href='#'>
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
};

export default Hero;
