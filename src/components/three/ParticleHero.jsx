import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useDeviceDetect from '../../hooks/useDeviceDetect'

export default function ParticleHero() {
  const pointsRef = useRef()
  const { isMobile } = useDeviceDetect()
  
  const count = isMobile ? 300 : 1200
  const scale = isMobile ? 0.6 : 1.0

  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const c = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Abstract cloud forming a slow swirling galaxy-like shape
      const r = Math.random() * 4 * scale
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos((Math.random() * 2) - 1)
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.3
      p[i * 3 + 2] = r * Math.cos(phi)

      // Monochromatic / subtle cool tones
      const mix = Math.random()
      c[i * 3] = THREE.MathUtils.lerp(0.8, 1.0, mix)
      c[i * 3 + 1] = THREE.MathUtils.lerp(0.8, 1.0, mix)
      c[i * 3 + 2] = THREE.MathUtils.lerp(0.9, 1.0, mix)
    }
    return { positions: p, colors: c }
  }, [count, scale])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    pointsRef.current.rotation.y = time * 0.05
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03 * scale}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}