import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/* ---------- Iceberg tip (above water) ---------- */
function IcebergTip() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
  })

  return (
    <group ref={meshRef} position={[0, 0.6, 0]}>
      {/* main tip */}
      <mesh>
        <coneGeometry args={[1.2, 2.0, 5]} />
        <meshStandardMaterial
          color="#c8d8ff"
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
          emissive="#4488ff"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* small bump */}
      <mesh position={[0.5, -0.3, 0.3]} rotation={[0, 0.4, 0.2]}>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshStandardMaterial
          color="#d0e0ff"
          transparent
          opacity={0.7}
          emissive="#4488ff"
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  )
}

/* ---------- Iceberg mass (below water) ---------- */
function IcebergMass() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <group ref={meshRef} position={[0, -3.5, 0]}>
      {/* main body — large irregular mass */}
      <mesh>
        <coneGeometry args={[3.5, 7, 6]} />
        <meshStandardMaterial
          color="#8ab8e8"
          transparent
          opacity={0.45}
          roughness={0.4}
          metalness={0.05}
          emissive="#00D4FF"
          emissiveIntensity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* secondary lobe */}
      <mesh position={[-1.5, 1, 0.8]} rotation={[0.3, 0, -0.4]}>
        <coneGeometry args={[2.0, 4, 5]} />
        <meshStandardMaterial
          color="#90c0e8"
          transparent
          opacity={0.35}
          emissive="#00D4FF"
          emissiveIntensity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* third lobe */}
      <mesh position={[1.2, 0.5, -1]} rotation={[-0.2, 0.5, 0.3]}>
        <coneGeometry args={[1.5, 3, 4]} />
        <meshStandardMaterial
          color="#a0ccee"
          transparent
          opacity={0.3}
          emissive="#00D4FF"
          emissiveIntensity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/* ---------- Water surface ---------- */
function WaterSurface() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[60, 60, 32, 32]} />
      <meshStandardMaterial
        color="#0066aa"
        transparent
        opacity={0.22}
        roughness={0.1}
        metalness={0.6}
        side={THREE.DoubleSide}
        emissive="#003366"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

/* ---------- Underwater classified text fragments ---------- */
const fragments = [
  { text: '[REDACTED]', pos: [-3, -2.5, 2], rot: [0, 0.3, 0.1] },
  { text: 'CLASSIFIED', pos: [3.5, -4, -1], rot: [0, -0.4, -0.1] },
  { text: 'PROJECT-X7', pos: [-2, -5.5, -2], rot: [0, 0.6, 0.05] },
  { text: 'FRAGMENT-003', pos: [2, -3.5, 3], rot: [0, -0.2, 0.15] },
  { text: '████████', pos: [-4, -6, 1], rot: [0, 0.1, -0.05] },
  { text: 'LEVEL-5 CLEARANCE', pos: [1, -7, -1.5], rot: [0, -0.5, 0.08] },
]

function ClassifiedFragments() {
  return (
    <group>
      {fragments.map((frag, i) => (
        <Float key={i} speed={0.5 + i * 0.1} rotationIntensity={0.1} floatIntensity={0.3}>
          <Text
            position={frag.pos}
            rotation={frag.rot}
            fontSize={0.3}
            color="#00D4FF"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.2 + (i % 3) * 0.08}
          >
            {frag.text}
          </Text>
        </Float>
      ))}
    </group>
  )
}

/* ---------- Underwater particles ---------- */
function UnderwaterParticles() {
  const pointsRef = useRef()
  const count = 300

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = -Math.random() * 12 - 0.5 // below waterline
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.002
      // slowly drift upward, reset when reaching waterline
      pos[i * 3 + 1] += 0.003
      if (pos[i * 3 + 1] > -0.5) {
        pos[i * 3 + 1] = -12 - Math.random() * 2
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
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
      </bufferGeometry>
      <pointsMaterial
        color="#00D4FF"
        size={0.04}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ---------- Camera controller driven by scrollProgress ---------- */
function CameraController({ scrollProgress }) {
  const { camera } = useThree()

  useFrame(() => {
    // lerp from above water (y=4) to deep below (y=-8)
    const targetY = THREE.MathUtils.lerp(4, -8, scrollProgress)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    // look slightly toward the iceberg center
    camera.lookAt(0, camera.position.y * 0.3, 0)
  })

  return null
}

/* ---------- Ethereal glow ring at waterline ---------- */
function WaterlineGlow() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03)
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
      <ringGeometry args={[1.0, 5, 64]} />
      <meshBasicMaterial
        color="#00D4FF"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ---------- Main component ---------- */
import { PerspectiveCamera } from '@react-three/drei'

export default function IcebergScene({ scrollProgress = 0 }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={55} />
      <fog attach="fog" args={['#020810', 8, 35]} />
      <color attach="background" args={['#020810']} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, -5, 0]} intensity={0.6} color="#00D4FF" distance={20} />
      <pointLight position={[-3, -8, -3]} intensity={0.3} color="#0066ff" distance={15} />

      <CameraController scrollProgress={scrollProgress} />
      <IcebergTip />
      <IcebergMass />
      <WaterSurface />
      <WaterlineGlow />
      <ClassifiedFragments />
      <UnderwaterParticles />
    </>
  )
}