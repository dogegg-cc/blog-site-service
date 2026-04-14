import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Code, Mail } from 'lucide-react';
import SectionReveal from '@/components/Motion/SectionReveal';
import styles from './Hero.module.less';
import { type UserInfo } from '@/api/home';
import TextType from '@/components/bits/TextType/TextType';
import EmailTooltip from './components/EmailTooltip';
import HeroAnimation from './components/HeroAnimation';
import { SoftAurora } from '@/components/bits/SoftAurora/SoftAurora';
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
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: -1,
          opacity: 0.5,
        }}
      >
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1}
          color1='#f7f7f7'
          color2='#e100ff'
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.25}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div>
            <SectionReveal direction='right' delay={0.25}>
              <h1 className={styles.heroTitle}>
                你好，我是<span>{info.name}</span>
              </h1>
            </SectionReveal>
            <SectionReveal direction='right' delay={0.25}>
              <TextType
                text={['所有的 Bug 都是有因果的', info.slogan ?? '']}
                className={styles.heroDesc}
                typingSpeed={100}
                deletingSpeed={100}
                loop={false}
              />
            </SectionReveal>
            <SectionReveal direction='right' delay={0.25}>
              <div className={styles.heroSocial}>
                <a href={info.github} target='_blank' rel='noopener noreferrer'>
                  <Code size={20} />
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
                    <Mail size={20} />
                  </button>

                  <EmailTooltip
                    email={info.email}
                    show={showEmail}
                    isCopied={copied}
                    onCopy={handleCopy}
                    onMouseEnter={handleMouseEnter}
                  />
                </div>
              </div>
            </SectionReveal>
          </div>
          <div className={styles.computer}>
            <SectionReveal direction='left' delay={0.4}>
              <HeroAnimation />
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
