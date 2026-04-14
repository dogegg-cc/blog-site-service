import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import styles from './style.module.less';

interface CodeLine {
  text: string;
  indent: number;
  tokens?: { text: string; type: 'keyword' | 'fn' | 'string' | 'default' }[];
}

const LINES: CodeLine[] = [
  {
    text: 'const BlogApp = () => {',
    indent: 0,
    tokens: [
      { text: 'const', type: 'keyword' },
      { text: ' ', type: 'default' },
      { text: 'BlogApp', type: 'fn' },
      { text: ' = () => {', type: 'default' },
    ],
  },
  {
    text: 'return (',
    indent: 20,
    tokens: [
      { text: 'return', type: 'keyword' },
      { text: ' (', type: 'default' },
    ],
  },
  {
    text: '<InteractiveSpace>',
    indent: 40,
    tokens: [
      { text: '<', type: 'default' },
      { text: 'InteractiveSpace', type: 'fn' },
      { text: '>', type: 'default' },
    ],
  },
  {
    text: '"Welcome to code world"',
    indent: 60,
    tokens: [{ text: '"Welcome to code world"', type: 'string' }],
  },
  {
    text: '</InteractiveSpace>',
    indent: 40,
    tokens: [
      { text: '</', type: 'default' },
      { text: 'InteractiveSpace', type: 'fn' },
      { text: '>', type: 'default' },
    ],
  },
  {
    text: ');',
    indent: 20,
    tokens: [{ text: ' );', type: 'default' }],
  },
  {
    text: '};',
    indent: 0,
    tokens: [{ text: '};', type: 'default' }],
  },
];

const HeroAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedLineIndex, setDisplayedLineIndex] = useState(0);
  const [displayedCharCount, setDisplayedCharCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 鼠标位置监视
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 映射鼠标位置到旋转角度
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // 平滑过渡
  const springConfig = { damping: 20, stiffness: 100 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // 打字机逻辑
  useEffect(() => {
    if (isFinished) {
      // 3秒后重启打字动画，营造循环感
      const timer = setTimeout(() => {
        setDisplayedLineIndex(0);
        setDisplayedCharCount(0);
        setIsFinished(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    const currentLine = LINES[displayedLineIndex];
    if (displayedCharCount < currentLine.text.length) {
      const timer = setTimeout(() => {
        setDisplayedCharCount((prev) => prev + 1);
      }, 50); // 每个字符打字速度
      return () => clearTimeout(timer);
    } else if (displayedLineIndex < LINES.length - 1) {
      const timer = setTimeout(() => {
        setDisplayedLineIndex((prev) => prev + 1);
        setDisplayedCharCount(0);
      }, 200); // 换行等待时间
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsFinished(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayedLineIndex, displayedCharCount, isFinished]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 渲染代码行逻辑
  const renderLines = () => {
    return LINES.map((line, lIdx) => {
      if (lIdx > displayedLineIndex) return null;

      let currentPos = 0;
      const isCurrentLine = lIdx === displayedLineIndex;

      return (
        <div className={styles.codeLine} key={lIdx}>
          <span className={styles.lineNum}>{lIdx + 1}</span>
          <div className={styles.lineCode} style={{ paddingLeft: `${line.indent}px` }}>
            {line.tokens?.map((token, tIdx) => {
              const tokenStart = currentPos;
              currentPos += token.text.length;

              if (isCurrentLine && tokenStart >= displayedCharCount) return null;

              const visibleText = isCurrentLine
                ? token.text.slice(0, displayedCharCount - tokenStart)
                : token.text;

              return (
                <span key={tIdx} className={styles[token.type]}>
                  {visibleText}
                </span>
              );
            })}
            {isCurrentLine && <span className={styles.cursor} />}
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 背景光晕 */}
      <motion.div
        className={styles.glow}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 主编辑器窗口 */}
      <motion.div
        className={styles.window}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className={styles.header}>
          <div className={styles.dots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={styles.title}>~/projects/fullstack-blog</div>
        </div>

        <div className={styles.content}>{renderLines()}</div>
      </motion.div>
    </div>
  );
};

export default HeroAnimation;
