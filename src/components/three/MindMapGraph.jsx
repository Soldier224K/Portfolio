import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'

/* ---------- Data ---------- */
const NODES = [
  // Skills (blue)
  { id: 'react', label: 'React', type: 'skill', color: '#00D4FF' },
  { id: 'nodejs', label: 'Node.js', type: 'skill', color: '#00D4FF' },
  { id: 'threejs', label: 'Three.js', type: 'skill', color: '#00D4FF' },
  { id: 'mongodb', label: 'MongoDB', type: 'skill', color: '#00D4FF' },
  { id: 'express', label: 'Express', type: 'skill', color: '#00D4FF' },
  { id: 'javascript', label: 'JavaScript', type: 'skill', color: '#00D4FF' },
  { id: 'typescript', label: 'TypeScript', type: 'skill', color: '#00D4FF' },
  { id: 'python', label: 'Python', type: 'skill', color: '#00D4FF' },
  { id: 'tailwind', label: 'Tailwind CSS', type: 'skill', color: '#00D4FF' },
  // Projects (cyan)
  { id: 'portfolio', label: 'Portfolio', type: 'project', color: '#00FFAA' },
  { id: 'ecommerce', label: 'E-Commerce', type: 'project', color: '#00FFAA' },
  { id: 'taskmanager', label: 'Task Manager', type: 'project', color: '#00FFAA' },
  { id: 'chatapp', label: 'Chat App', type: 'project', color: '#00FFAA' },
  // Domains (white)
  { id: 'frontend', label: 'Frontend', type: 'domain', color: '#E0E0FF' },
  { id: 'backend', label: 'Backend', type: 'domain', color: '#E0E0FF' },
  { id: 'devops', label: 'DevOps', type: 'domain', color: '#E0E0FF' },
  { id: '3dwebgl', label: '3D/WebGL', type: 'domain', color: '#E0E0FF' },
  // Classified (dimmed)
  { id: 'classified1', label: '[CLASSIFIED]', type: 'idea', color: '#666666' },
  { id: 'classified2', label: '[CLASSIFIED]', type: 'idea', color: '#666666' },
  { id: 'classified3', label: '[CLASSIFIED]', type: 'idea', color: '#666666' },
]

const CONNECTIONS = [
  // Skills → Domains
  ['react', 'frontend'], ['tailwind', 'frontend'], ['threejs', '3dwebgl'],
  ['nodejs', 'backend'], ['express', 'backend'], ['mongodb', 'backend'],
  ['javascript', 'frontend'], ['typescript', 'frontend'], ['python', 'devops'],
  // Projects → Skills
  ['portfolio', 'react'], ['portfolio', 'threejs'], ['portfolio', 'tailwind'],
  ['ecommerce', 'react'], ['ecommerce', 'nodejs'], ['ecommerce', 'mongodb'],
  ['taskmanager', 'react'], ['taskmanager', 'express'], ['taskmanager', 'mongodb'],
  ['chatapp', 'nodejs'], ['chatapp', 'express'], ['chatapp', 'react'],
  // Classified connections
  ['classified1', 'python'], ['classified2', 'devops'], ['classified3', '3dwebgl'],
  // Cross-links
  ['javascript', 'typescript'], ['frontend', '3dwebgl'],
]

/* ---------- Fibonacci sphere layout ---------- */
function fibonacciSphere(count, radius) {
  const positions = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    positions.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ])
  }
  return positions
}

/* ---------- Interactive node ---------- */
function GraphNode({ node, position, isHovered, isConnected, onHover, onUnhover }) {
  const meshRef = useRef()
  const baseScale = node.type === 'domain' ? 0.45 : node.type === 'project' ? 0.4 : node.type === 'idea' ? 0.3 : 0.35

  useFrame((state) => {
    if (!meshRef.current) return
    const targetScale = isHovered ? baseScale * 1.5 : isConnected ? baseScale * 1.2 : baseScale
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })

  const emissiveIntensity = isHovered ? 1.2 : isConnected ? 0.8 : 0.4

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(node.id) }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover() }}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={node.type === 'idea' ? 0.5 : 0.9}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[0, baseScale * 1.8 + 0.3, 0]}
        fontSize={0.28}
        color={isHovered || isConnected ? '#ffffff' : node.color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={isHovered || isConnected ? 1 : 0.7}
      >
        {node.label}
      </Text>
    </group>
  )
}

/* ---------- Connection line ---------- */
function ConnectionLine({ start, end, highlighted }) {
  const lineRef = useRef()
  const points = useMemo(
    () => new Float32Array([...start, ...end]),
    [start, end]
  )

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={highlighted ? '#00D4FF' : '#1a3a5c'}
        opacity={highlighted ? 0.7 : 0.15}
        transparent
        linewidth={1}
      />
    </line>
  )
}

/* ---------- Scene content ---------- */
function MindMapContent() {
  const [hoveredNode, setHoveredNode] = useState(null)

  // Build positions map
  const positionsMap = useMemo(() => {
    const positions = fibonacciSphere(NODES.length, 7)
    const map = {}
    NODES.forEach((node, i) => {
      map[node.id] = positions[i]
    })
    return map
  }, [])

  // Find connected nodes for hover highlighting
  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set()
    const connected = new Set()
    CONNECTIONS.forEach(([a, b]) => {
      if (a === hoveredNode) connected.add(b)
      if (b === hoveredNode) connected.add(a)
    })
    return connected
  }, [hoveredNode])

  const handleHover = useCallback((id) => setHoveredNode(id), [])
  const handleUnhover = useCallback(() => setHoveredNode(null), [])

  return (
    <group>
      {/* Connections */}
      {CONNECTIONS.map(([a, b], i) => {
        const highlighted = hoveredNode === a || hoveredNode === b
        return (
          <ConnectionLine
            key={`conn-${i}`}
            start={positionsMap[a]}
            end={positionsMap[b]}
            highlighted={highlighted}
          />
        )
      })}

      {/* Nodes */}
      {NODES.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          position={positionsMap[node.id]}
          isHovered={hoveredNode === node.id}
          isConnected={connectedNodes.has(node.id)}
          onHover={handleHover}
          onUnhover={handleUnhover}
        />
      ))}
    </group>
  )
}

/* ---------- Slow auto-rotate wrapper ---------- */
function AutoRotate({ children }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })
  return <group ref={groupRef}>{children}</group>
}

/* ---------- Main component ---------- */
import { PerspectiveCamera } from '@react-three/drei'

export default function MindMapGraph() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={55} />
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 15, 40]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00D4FF" />

      <AutoRotate>
        <MindMapContent />
      </AutoRotate>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={10}
        maxDistance={30}
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}