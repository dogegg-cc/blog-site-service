import {
  useState,
  useEffect,
  useRef,
  useMemo,
  isValidElement,
  type ReactNode,
} from 'react';
import type { ArticleDetail as ArticleDetailData } from '@/api/article';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 文本归口化递归函数：从 React Node 树中提取纯净文本
 */
export const getTextFromChildren = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children
      .map((child: ReactNode) => getTextFromChildren(child))
      .join('');
  }
  if (isValidElement(children)) {
    return getTextFromChildren(children.props.children);
  }
  return '';
};

/**
 * 物理级 ID 生成算法：确保两端 ID 强制对齐
 */
export const generateId = (text: string): string => {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') || 'section-' + Math.random().toString(36).slice(2, 7)
  );
};

interface UseScrollSyncProps {
  article: ArticleDetailData | null;
  loading: boolean;
}

export const useScrollSync = ({ article, loading }: UseScrollSyncProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const isAutoScrollingRef = useRef(false);

  // 1. 动态生成目录结构
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

  // 2. 实时坐标监听逻辑
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
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        currentId = toc[toc.length - 1]?.id || '';
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, toc, activeId]);

  /**
   * 编程式导航跳转函数
   */
  const scrollToAnchor = (id: string) => {
    isAutoScrollingRef.current = true;
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 1000);
  };

  return {
    toc,
    activeId,
    scrollToAnchor,
    setActiveId,
  };
};
