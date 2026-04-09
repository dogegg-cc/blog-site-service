import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { getFullImageUrl } from '@/utils/url';
import styles from './ArticleDetail.module.less';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleDetailData {
  id: string;
  title: string;
  summary: string;
  content: string;
  bannerUrl: string;
  viewCount: number;
  createdAt: string;
  category: { name: string };
  tags: { name: string }[];
}

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

  // 1. 获取文章详情
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/blog/article/${id}`);
        if (res.data.code === 1) {
          setArticle(res.data.data);
        }
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
    const items: TOCItem[] = [];
    let match;
    while ((match = reg.exec(article.content)) !== null) {
      const level = match[1].length;
      const plainText = match[2].replace(/[_*`]/g, '').trim(); 
      items.push({ id: generateId(plainText), text: plainText, level });
    }
    return items;
  }, [article?.content]);

  // 3. 终极坐标扫描算法 (取代 IntersectionObserver)
  useEffect(() => {
    if (loading || !toc.length) return;

    const handleScroll = () => {
      // 若处于手动点击引起的平滑滚动中，跳过联动更新以防抖动
      if (isAutoScrollingRef.current) return;

      const HEADING_OFFSET = 150; // 判定线偏移量（视口顶部下移 150px）
      let currentId = '';

      // 遍历所有目录锚点，找到“已滚过判定线”且“离顶部最近”的标题
      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          // 如果该元素顶部已超过判定线，则它可能是当前活性章节
          if (top < HEADING_OFFSET) {
            currentId = item.id;
          } else {
            // 找到第一个尚未到达判定面板的元素即可停止，之前的即为当前活性章节
            break;
          }
        }
      }

      // 特殊情况：若滚回页面顶部（Hero 区），清空激活态
      if (window.scrollY < 200) {
        currentId = '';
      }
      
      // 特殊情况：若滚到底部，激活最后一个
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        currentId = toc[toc.length - 1].id;
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    // 初始执行一次
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, toc, activeId]);

  if (loading) return <div className={styles.loading}>Tracing the narrative...</div>;
  if (!article) return <div className={styles.loading}>Artifact not found.</div>;

  return (
    <div className={styles.detailContainer}>
      {/* Hero Header */}
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

      {/* Main Layout Grid */}
      <div className={styles.layoutGrid}>
        {/* Tree TOC Sidebar */}
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
                    // 1秒后解锁联动更新
                    setTimeout(() => { isAutoScrollingRef.current = false; }, 1000);
                  }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Body */}
        <article className={styles.articleCard}>
          {article?.content ? (
            <div className={styles.markdownBody}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // 使用自定义组件确保渲染后的 ID 字符完美对齐目录生成逻辑
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
