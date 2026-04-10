import { Suspense } from 'react';
import { AppRouter } from '@/router/AppRouter';
import { FloatingNav } from './components/Navigation/FloatingNav';
import ScrollToTop from './components/Common/ScrollToTop';
import LiquidEther from '@/components/bits/LiquidEther';
import './App.less';

function App() {
  return (
    <main className='app-container'>
      {/* 背景层：将 LiquidEther 作为精细纹理保留 */}
      <div className='background-overflow'>
        {/* <Waves /> */}
        <LiquidEther />
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
        <p>© 2026 黑ICP备17005802号-2</p>
      </footer>
    </main>
  );
}

export default App;
