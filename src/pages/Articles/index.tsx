import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SectionReveal from '@/components/Motion/SectionReveal';
import ArtisticCard from '@/components/Common/ArtisticCard';
import Pagination from '@/components/Common/Pagination';
import { getCategoryList, getArticleList, type Category } from '@/api/article';
import type { Article } from '@/api/home';
import { getFullImageUrl } from '@/utils/url';
import { formatTime } from '@/utils/time';
import { ChevronRight, Hash, LayoutGrid, FolderOpen } from 'lucide-react';
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
    newParams.delete('tag');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleTagChange = (categoryId: string, tagId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', categoryId);
    if (tagId === 'all') {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tagId);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  return (
    <div className={styles.container}>
      <div className={styles.maxContainer}>
        <div className={styles.layoutWrapper}>
          {/* Sidebar: Tree Filter */}
          <aside className={styles.sidebar}>
            <div className={styles.treeNav}>
              {/* All Articles */}
              <div 
                className={`${styles.treeItem} ${selectedCategory === 'all' ? styles.active : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                <LayoutGrid className={styles.treeIcon} size={18} />
                <span>全部文章</span>
              </div>

              {/* Category Groups */}
              {categories.map((cat) => {
                const isExpanded = selectedCategory === cat.id;
                return (
                  <div key={cat.id} className={styles.treeGroup}>
                    <div 
                      className={`${styles.treeItem} ${isExpanded ? styles.active : ''} ${cat.tags.length > 0 ? styles.hasChildren : ''} ${isExpanded ? styles.expanded : ''}`}
                      onClick={() => handleCategoryChange(cat.id)}
                    >
                      <ChevronRight className={styles.treeIcon} size={16} />
                      <FolderOpen className={styles.folderIcon} size={18} style={{ marginRight: '4px', opacity: 0.7 }} />
                      <span>{cat.name}</span>
                    </div>

                    {/* Sub Tags */}
                    {isExpanded && cat.tags.length > 0 && (
                      <div className={styles.treeSubList}>
                        <div 
                           className={`${styles.treeSubItem} ${selectedTag === 'all' ? styles.active : ''}`}
                           onClick={() => handleTagChange(cat.id, 'all')}
                        >
                          全部标签
                        </div>
                        {cat.tags.map(tag => (
                          <div 
                            key={tag.id}
                            className={`${styles.treeSubItem} ${selectedTag === tag.id ? styles.active : ''}`}
                            onClick={() => handleTagChange(cat.id, tag.id)}
                          >
                            <Hash className={styles.hashIcon} size={12} />
                            <span>{tag.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main List Area */}
          <div className={styles.listArea}>
            <div className={styles.list}>
              {loading ? (
                <div className={styles.loading}>加载中...</div>
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
                <div className={styles.empty}>暂无相关文章</div>
              )}
            </div>

            {/* Pagination */}
            {!loading && total > PAGE_SIZE && (
              <SectionReveal delay={0.2}>
                <div style={{ marginTop: '4rem' }}>
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                  />
                </div>
              </SectionReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
