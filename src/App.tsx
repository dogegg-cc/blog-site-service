import { Suspense, useEffect, useRef } from 'react';
import { AppRouter } from '@/router/AppRouter';
import { FloatingNav } from './components/Navigation/FloatingNav';
import ScrollToTop from './components/Common/ScrollToTop';
import './App.less';

function App() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveLight = (e: MouseEvent) => {
      if (lightRef.current) {
        const { clientX, clientY } = e;
        // 使用 translate3d 触发 GPU 加速，并将中心点偏移
        lightRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveLight);
    return () => window.removeEventListener('mousemove', moveLight);
  }, []);

  return (
    <main className='app-container'>
      {/* 背景层：动态光源 + 磨砂玻璃 */}
      <div className='background-fixed'>
        <div ref={lightRef} className='mouse-follow-light' />
        <div className='glass-overlay' />
      </div>

      {/* 导航与功能组件 */}
      <FloatingNav />
      <ScrollToTop />

      {/* 主内容区域 */}
      <div className='page-content'>
        <Suspense fallback={<div className='loading-placeholder' />}>
          <AppRouter />
        </Suspense>
      </div>

      {/* 全局页脚 (极简式) */}
      <footer className='global-footer'>
        <p>© 2026 黑ICP备17005802号-2 ｜ 辽公网安备21011202001256号</p>
      </footer>
    </main>
  );
}

export default App;
