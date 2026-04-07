import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WaveParticles() {
  const points = useRef<THREE.Points>(null!)
  const numParticles = 4000
  
  const positions = useMemo(() => {
    const pos = new Float32Array(numParticles * 3)
    for (let i = 0; i < numParticles; i++) {
      // Stable generation for React 19 Compiler purity
      const seed = i * 1337.42
      pos[i * 3] = (Math.sin(seed) * 20)
      pos[i * 3 + 1] = (Math.cos(seed * 1.5) * 5)
      pos[i * 3 + 2] = (Math.sin(seed * 2.1) * 20)
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const array = points.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < numParticles; i++) {
        const x = array[i * 3]
        const z = array[i * 3 + 2]
        array[i * 3 + 1] = Math.sin(x * 0.5 + t) * Math.cos(z * 0.5 + t) * 1.5
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#818cf8" transparent opacity={0.4} />
    </points>
  )
}

export default function Waves() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <WaveParticles />
      </Canvas>
    </div>
  )
}
