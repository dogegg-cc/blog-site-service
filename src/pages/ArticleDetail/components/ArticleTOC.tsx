import React from 'react';
import type { TOCItem } from '../hooks/useScrollSync';
import styles from '../ArticleDetail.module.less';

interface ArticleTOCProps {
  toc: TOCItem[];
  activeId: string;
  onAnchorClick: (id: string) => void;
}

const ArticleTOC: React.FC<ArticleTOCProps> = ({ toc, activeId, onAnchorClick }) => {
  if (!toc.length) return null;

  return (
    <aside className={styles.tocSidebar}>
      <div className={styles.tocSticky}>
        <h4 className={styles.tocLabel}>Contents</h4>
        <nav className={styles.tocNav}>
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-level={item.level}
              className={`${styles.tocNode} ${activeId === item.id ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onAnchorClick(item.id);
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default ArticleTOC;
