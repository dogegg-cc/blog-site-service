import React from 'react';
import styles from './style.module.less';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const renderPages = () => {
    const pages = [];
    const showThreshold = 2; // 分页器当前页码前后显示的页数

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - showThreshold && i <= current + showThreshold)
      ) {
        pages.push(
          <button
            key={i}
            className={`${styles.pageItem} ${current === i ? styles.active : ''}`}
            onClick={() => onChange(i)}
          >
            {i}
          </button>,
        );
      } else if (
        i === current - showThreshold - 1 ||
        i === current + showThreshold + 1
      ) {
        pages.push(
          <span key={i} className={styles.ellipsis}>
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.navBtn}
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        <span className={styles.arrow}>‹</span>
      </button>

      <div className={styles.pages}>{renderPages()}</div>

      <button
        className={styles.navBtn}
        disabled={current === totalPages}
        onClick={() => onChange(current + 1)}
      >
        <div className={styles.nextText}>
          <span>NEXT</span>
          <span className={styles.arrow}>›</span>
        </div>
      </button>
    </div>
  );
};

export default Pagination;
