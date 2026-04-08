import React from 'react';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import styles from './ArticleDetail.module.less';

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'theory', label: 'The Theory of Negative Space' },
  { id: 'implementation', label: 'Implementation Strategies' },
  { id: 'conclusion', label: 'Artistic Conclusion' },
];

const ArticleDetail: React.FC = () => {
  return (
    <div className={styles.detailContainer}>
      <div className="max-w-7xl px-6 py-32 flex flex-col lg:flex-row gap-16">
        {/* Left Sidebar: Tree TOC */}
        <aside className={styles.tocSidebar}>
          <div className={styles.tocSticky}>
            <div className={styles.tocBranch}>
              <h4 className={styles.tocHeader}>Table of Contents</h4>
              <nav className={styles.tocNav}>
                {TOC.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={styles.tocItem}>
                    <span className={styles.tocDot} />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <article className={styles.contentArea}>
          <SectionReveal>
            <div className={styles.postMeta}>
              <span>Design</span> • <span>March 12, 2024</span>
            </div>
            <h1 className={styles.postTitle}>The Architecture of Silence in UI</h1>
            <p className={styles.postExcerpt}>
              Exploring how intentional whitespace creates a more focused and premium user experience in modern digital galleries.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.2} className={styles.postBody}>
            <h2 id="intro">Introduction</h2>
            <p>
              In the age of information density, silence has become the ultimate luxury. 
              Minimalism in user interface design is often misunderstood as a lack of content, 
              but it is actually a strategic orchestration of space.
            </p>
            
            <ArtisticCard className={styles.quoteCard}>
               "Whitespace is not 'empty space'—it is a functional element that defines the relationship between information."
            </ArtisticCard>

            <h2 id="theory">The Theory of Negative Space</h2>
            <p>
              By removing the borders, dividers, and boxes typically used to separate content, 
              we allow the content itself to create its own boundaries through hierarchy and rhythm.
            </p>
            
            <div className={styles.postImage}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7-sT1TpEij0E9w0zZtF7gtabxEE9zZngrG3nzuY7CCVL2PQHc-lq2Whe-LBc9IdtL-x5ehoROsRfCKLZdCQLiVtnwisXFJ5caGJAoKD6bKH9pbcykjps6BzawCc8sn5y-eqZGweidu8rC6LtQuHLNnFmbKzLkyosBHMI39ZFvKqz-e4-sZIckLvACivEykfFohQ6mUyZC_m5Ki1W-CNgQ_dGNIapVs2FlrsSUR7tvhDzV066QqEnzyaFofQRuAuanSvn0vQWDIhKC" alt="Abstract Art" />
                <span className={styles.caption}>Figure 1: Visual representation of tension through asymmetrical balance.</span>
            </div>
          </SectionReveal>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
