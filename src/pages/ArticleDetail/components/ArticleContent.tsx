import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import objectivec from 'react-syntax-highlighter/dist/esm/languages/prism/objectivec';
// 注册常用语言以优化包体积 (Async chunks can be used but this is more stable for now)
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('objectivec', objectivec);

import { getTextFromChildren, generateId } from '../hooks/useScrollSync';
import styles from '../ArticleDetail.module.less';

// 定义接口以替代 any
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface HeadingProps {
  children?: React.ReactNode;
}

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return (
    <article className={styles.articleCard}>
      {content ? (
        <div className={styles.markdownBody}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              ...Object.fromEntries(
                (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((Tag) => [
                  Tag,
                  ({ children }: HeadingProps) => {
                    const id = generateId(getTextFromChildren(children));
                    return <Tag id={id}>{children}</Tag>;
                  },
                ])
              ),
              code: ({ inline, className, children, ...props }: CodeProps) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={
                      vscDarkPlus as { [key: string]: React.CSSProperties }
                    }
                    language={match[1]}
                    PreTag='div'
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className={styles.empty}>Content is unavailable.</div>
      )}
    </article>
  );
};

export default ArticleContent;
