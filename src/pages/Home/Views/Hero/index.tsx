import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import SectionReveal from '@/components/Motion/SectionReveal';
import styles from './Hero.module.less';
import { type UserInfo } from '@/api/home';
import TextType from '@/components/bits/TextType/TextType';
const Hero: React.FC<{ info: UserInfo }> = React.memo(({ info }) => {
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // 滑动或点击外部自动隐藏
  useEffect(() => {
    const handleEvents = (e: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowEmail(false);
      }
    };

    const handleScroll = () => setShowEmail(false);

    window.addEventListener('mousedown', handleEvents);
    window.addEventListener('touchstart', handleEvents);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousedown', handleEvents);
      window.removeEventListener('touchstart', handleEvents);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowEmail(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setShowEmail(false);
    }, 300);
  };

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!info.email) return;
      try {
        await navigator.clipboard.writeText(info.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },
    [info.email],
  );

  return (
    <section className={styles.hero}>
      <div className='max-w-7xl mx-auto px-6 w-full'>
        <div className={styles.heroGrid}>
          <div className='flex flex-col gap-6'>
            <SectionReveal direction='right'>
              <h1 className={styles.heroTitle}>
                你好，我是<span>{info.name}</span>
              </h1>
            </SectionReveal>
            <SectionReveal direction='right' delay={0.2}>
              <TextType
                text={['一个不太靠谱的程序猿', info.slogan ?? '']}
                className={styles.heroDesc}
                typingSpeed={200}
                deletingSpeed={200}
                pauseDuration={5000}
              />
            </SectionReveal>
            <SectionReveal direction='right' delay={0.4}>
              <div className={styles.heroSocial}>
                <a href={info.github} target='_blank' rel='noopener noreferrer'>
                  <span className='material-symbols-outlined'>code</span>
                </a>

                <div
                  className={styles.emailWrapper}
                  ref={wrapperRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={styles.trigger}
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    <span className='material-symbols-outlined'>mail</span>
                  </button>

                  <AnimatePresence>
                    {showEmail && (
                      <motion.div
                        className={styles.emailTooltip}
                        initial={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onMouseEnter={handleMouseEnter} // 停留在弹窗上也不消失
                      >
                        <span className={styles.emailText}>{info.email}</span>
                        <button className={styles.copyBtn} onClick={handleCopy}>
                          {copied ? <Check /> : <Copy />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SectionReveal>
          </div>

          <div className={styles.sculptureWrapper}>
            <div className={styles.glowOrb} />
            <div className={styles.liquidSculpture} />
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
