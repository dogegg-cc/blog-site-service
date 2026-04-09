import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import Pagination from '@/components/Common/Pagination';
import { getCategoryList, getArticleList, type Category } from '@/api/article';
import type { Article } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';
import { formatTime } from '@/utils/time';
import styles from './Articles.module.less';

const Articles: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States from URL
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedTag = searchParams.get('tag') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const PAGE_SIZE = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getArticleList({
        page: currentPage,
        pageSize: PAGE_SIZE,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
        tagId: selectedTag === 'all' ? undefined : selectedTag,
      });
      setArticles(res.items);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedTag]);

  const fetchCategories = async () => {
    try {
      const res = await getCategoryList();
      setCategories(res);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryChange = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (id === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', id);
    }
    newParams.delete('tag'); // Reset tag when category changes
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleTagChange = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (id === 'all') {
      newParams.delete('tag');
    } else {
      newParams.set('tag', id);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className={styles.container}>
      {/* Fixed/Sticky Filter Section */}
      <div className={styles.filterWrapper}>
        <div className={styles.maxContainer}>
          <div className={styles.filterSection}>
            {/* Categories */}
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>分类</span>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterItem} ${selectedCategory === 'all' ? styles.active : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`${styles.filterItem} ${selectedCategory === cat.id ? styles.active : ''}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags (Conditional) */}
            {currentCategoryObj && currentCategoryObj.tags.length > 0 && (
              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>标签</span>
                <div className={styles.filterOptions}>
                  <button
                    className={`${styles.filterItem} ${selectedTag === 'all' ? styles.active : ''}`}
                    onClick={() => handleTagChange('all')}
                  >
                    All
                  </button>
                  {currentCategoryObj.tags.map((tag) => (
                    <button
                      key={tag.id}
                      className={`${styles.filterItem} ${selectedTag === tag.id ? styles.active : ''}`}
                      onClick={() => handleTagChange(tag.id)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable List Section */}
      <div className={styles.scrollArea}>
        <div className={styles.maxContainer}>
          <div className={styles.list}>
            {loading ? (
              <div className={styles.loading}>服务器配置低，努力加载中</div>
            ) : articles.length > 0 ? (
              articles.map((article, i) => (
                <SectionReveal key={article.id} delay={i * 0.05} amount={0.1}>
                  <ArtisticCard 
                    className={styles.articleCard}
                    onClick={() => navigate(`/articles/${article.id}`)}
                  >
                    <div className={styles.articleImage}>
                      <img
                        src={getFullImageUrl(article.bannerUrl)}
                        alt={article.title}
                      />
                    </div>
                    <div className={styles.articleContent}>
                      <div className={styles.articleMeta}>
                        <span>{article.category.name}</span>
                        <span className={styles.dot}>•</span>
                        <span>{formatTime(article.createdAt)}</span>
                      </div>
                      <h2 className={styles.articleTitle}>{article.title}</h2>
                      <p className={styles.articleDescText}>
                        {article.summary}
                      </p>
                      <div className={styles.tags}>
                        {article.tags.map((tag) => (
                          <span key={tag.id}>#{tag.name}</span>
                        ))}
                      </div>
                    </div>
                  </ArtisticCard>
                </SectionReveal>
              ))
            ) : (
              <div className={styles.empty}>这个，那个，就是还没写...</div>
            )}
          </div>

          {/* Pagination */}
          {!loading && total > PAGE_SIZE && (
            <SectionReveal delay={0.2}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
              />
            </SectionReveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
