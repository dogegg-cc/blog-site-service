import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getArticleDetail, type ArticleDetail as ArticleDetailData } from '@/api/article';
import { getFullImageUrl } from '@/utils/url';
import styles from './ArticleDetail.module.less';

/**
 * 文本归口化递归函数：从 React Node 树中提取纯净文本
 */
const getTextFromChildren = (children: any): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
  if (children?.props?.children) return getTextFromChildren(children.props.children);
  return '';
};

/**
 * 物理级 ID 生成算法：确保两端 ID 强制对齐
 */
const generateId = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'section-' + Math.random().toString(36).slice(2, 7);
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const isAutoScrollingRef = useRef(false);

  // 1. 获取文章详情 (对接规范 API)
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // request.ts 已在拦截器中处理了 code === 1 并直接返回了 data
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

  // 2. 提取 TOC 树形目录结构
  const toc = useMemo(() => {
    if (!article?.content) return [];
    const reg = /^(#{2,3})\s+(.+)$/gm;
    const items: { id: string, text: string, level: number }[] = [];
    let match;
    while ((match = reg.exec(article.content)) !== null) {
      const level = match[1].length;
      const plainText = match[2].replace(/[_*`]/g, '').trim(); 
      items.push({ id: generateId(plainText), text: plainText, level });
    }
    return items;
  }, [article?.content]);

  // 3. 实时坐标扫描监听
  useEffect(() => {
    if (loading || !toc.length) return;

    const handleScroll = () => {
      if (isAutoScrollingRef.current) return;
      const HEADING_OFFSET = 150;
      let currentId = '';

      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top < HEADING_OFFSET) {
            currentId = item.id;
          } else {
            break;
          }
        }
      }

      if (window.scrollY < 200) currentId = '';
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        currentId = toc[toc.length - 1].id;
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, toc, activeId]);

  if (loading) return <div className={styles.loading}>Tracing the narrative...</div>;
  if (!article) return <div className={styles.loading}>Artifact not found.</div>;

  return (
    <div className={styles.detailContainer}>
      <header className={styles.heroSection}>
        <div className={styles.heroBg}>
          <img src={getFullImageUrl(article.bannerUrl)} alt={article.title} />
          <div className={styles.overlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.meta}>
            <span>{article?.category?.name || 'Uncategorized'}</span>
            <span>{article.viewCount} Reads</span>
          </div>
          <h1 className={styles.title}>
            {article?.title && article.title.includes(':') ? (
              <>
                {article.title.split(':')[0]}: <br />
                <span>{article.title.split(':')[1]}</span>
              </>
            ) : (
              article?.title || 'Untitled Narrative'
            )}
          </h1>
          <div className={styles.tags}>
            {article?.tags?.map((tag, idx) => (
              <span key={idx} className={styles.tagItem}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.layoutGrid}>
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
                    isAutoScrollingRef.current = true;
                    setActiveId(item.id);
                    const target = document.getElementById(item.id);
                    if (target) {
                      const top = target.getBoundingClientRect().top + window.pageYOffset - 120;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                    setTimeout(() => { isAutoScrollingRef.current = false; }, 1000);
                  }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className={styles.articleCard}>
          {article?.content ? (
            <div className={styles.markdownBody}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h2: ({ children }) => {
                    const id = generateId(getTextFromChildren(children));
                    return <h2 id={id}>{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const id = generateId(getTextFromChildren(children));
                    return <h3 id={id}>{children}</h3>;
                  },
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    try {
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus as any || {}}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    } catch (e) {
                      return <code className={className} {...props}>{children}</code>;
                    }
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className={styles.empty}>Content is unavailable.</div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
