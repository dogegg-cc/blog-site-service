import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleDetail, type ArticleDetail as ArticleDetailData } from '@/api/article';
import { useScrollSync } from './hooks/useScrollSync';
import ArticleHero from './components/ArticleHero';
import ArticleTOC from './components/ArticleTOC';
import ArticleContent from './components/ArticleContent';
import styles from './ArticleDetail.module.less';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. 数据获取 Hooks
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getArticleDetail(id);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // 2. 页面初始化置顶逻辑：防止 SPA 导航时的滚动位置遗留
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 3. 交互逻辑 Hooks (目录同步)
  const { toc, activeId, scrollToAnchor } = useScrollSync({
    article,
    loading
  });

  if (loading) return <div className={styles.loading}>Tracing the narrative...</div>;
  if (!article) return <div className={styles.loading}>Artifact not found.</div>;

  return (
    <div className={styles.detailContainer}>
      {/* 视觉头部组件 */}
      <ArticleHero article={article} />

      {/* 文章主布局 */}
      <div className={styles.layoutGrid}>
        {/* 目录侧边栏组件 */}
        <ArticleTOC 
          toc={toc} 
          activeId={activeId} 
          onAnchorClick={scrollToAnchor} 
        />

        {/* 正文渲染组件 */}
        <ArticleContent content={article.content} />
      </div>
    </div>
  );
};

export default ArticleDetail;
