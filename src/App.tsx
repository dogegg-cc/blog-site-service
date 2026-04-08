import { AppRouter } from '@/router/AppRouter';
import { FloatingNav } from './components/Navigation/FloatingNav';
import Waves from '@/components/bits/Waves';
import './App.less';

function App() {
  return (
    <main className="app-container">
      {/* Background Layer: Keep Waves as a subtle texture */}
      <div className="background-overflow">
        <Waves />
      </div>

      {/* Navigation: Floating Capsule */}
      <FloatingNav />

      {/* Main Content Area */}
      <div className="page-content">
        <AppRouter />
      </div>

      {/* Simple Global Footer (Minimal) */}
      <footer className="global-footer">
        <p>© Jiao Pengyou — The Living Gallery</p>
      </footer>
    </main>
  );
}

export default App;
