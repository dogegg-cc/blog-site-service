import { useEffect } from 'react'
import Waves from '@/components/bits/Waves'
import { useAppStore } from '@/stores/useAppStore'
import { Compass, Layers, Cpu, Terminal } from 'lucide-react'
import './App.less'

function App() {
  const { theme, setTheme, setUser } = useAppStore()

  useEffect(() => {
    // Mock user init for demonstration
    setUser({ name: 'Antigravity Architect', avatar: '' })
  }, [setUser])

  return (
    <main className="animate-fade-in">
      {/* 3D Waves Background (React Bits Style) */}
      <Waves />

      <div className="glass-card">
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ 
            background: 'linear-gradient(90deg, rgba(129, 140, 248, 0.2), rgba(167, 139, 250, 0.2))', 
            color: '#818cf8', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '99px',
            fontSize: '0.875rem',
            fontWeight: '800',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Cpu size={16} />
            Architect 2.0: Less + zustand + 3D Bits
          </span>
        </div>
        
        <h1>探索极致可能<br />构建沉浸式数字艺术</h1>
        
        <p className="description" style={{ marginBottom: '3.5rem', color: '#94a3b8', fontSize: '1.25rem', lineHeight: '1.8' }}>
          不再仅仅是博客。这是一场关于性能与视觉的重构。
          基于 React 19 + Vite 构建，深度集成 3D 粒子系统与轻量化状态管理。
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            开启探索之旅 (主题: {theme.toUpperCase()})
          </button>
          
          <a 
            href="#" 
            className="btn-primary"
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'none',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Terminal size={20} style={{ marginRight: '0.5rem' }} />
            项目源代码
          </a>
        </div>

        <div style={{ 
          marginTop: '5rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '2rem' 
        }}>
          {[
            { 
              title: '实时渲染', 
              desc: 'React Three Fiber 驱动的高性能 3D 粒子', 
              icon: <Compass className="text-primary" /> 
            },
            { 
              title: 'Less 架构', 
              desc: '层级深度变量系统，极佳的可维护性', 
              icon: <Layers className="text-primary" /> 
            },
            { 
              title: '原子化状态', 
              desc: 'Zustand 极致轻量响应，低至 1KB 体积', 
              icon: <Cpu className="text-primary" /> 
            }
          ].map((item, i) => (
            <div key={i} style={{ 
              textAlign: 'left', 
              padding: '2rem', 
              borderRadius: '24px', 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.04)',
              transition: 'background 0.3s'
            }}>
              <div style={{ marginBottom: '1.5rem', color: '#818cf8' }}><Compass className="text-primary" /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#fff' }}>{item.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '5rem', display: 'flex', gap: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
        <span>&copy; {new Date().getFullYear()} Antigravity Studio.</span>
        <span>Made with Less & React.</span>
      </footer>
    </main>
  )
}

export default App
