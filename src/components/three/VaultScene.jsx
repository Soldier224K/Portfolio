import { Canvas, useFrame } from '@react-three/fiber'
import { Text, View, PerspectiveCamera } from '@react-three/drei'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

/* ---------- Vault Door (3D) ---------- */
function VaultDoor({ onAttempt, hovered, setHovered }) {
  const groupRef = useRef()
  const wheelRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Slow idle rotation
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.02
    }

    // Wheel jiggle on hover
    if (wheelRef.current) {
      if (hovered) {
        wheelRef.current.rotation.z = Math.sin(t * 12) * 0.12
      } else {
        wheelRef.current.rotation.z = THREE.MathUtils.lerp(wheelRef.current.rotation.z, 0, 0.05)
      }
    }

    // Pulsing edge glow
    if (glowRef.current) {
      const baseIntensity = hovered ? 0.8 : 0.3
      const pulse = Math.sin(t * 1.5) * 0.15
      glowRef.current.material.emissiveIntensity = baseIntensity + pulse
      glowRef.current.material.opacity = 0.4 + pulse * 0.3
    }
  })

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation()
    onAttempt()
  }, [onAttempt])

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
      onPointerDown={handlePointerDown}
    >
      {/* Main door — thick cylinder */}
      <mesh>
        <cylinderGeometry args={[3, 3, 0.5, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Door face ring (torus frame) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.15, 16, 64]} />
        <meshStandardMaterial
          color="#2a2a4e"
          metalness={0.95}
          roughness={0.1}
          emissive="#00D4FF"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner decorative ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
        <torusGeometry args={[2.2, 0.08, 12, 48]} />
        <meshStandardMaterial
          color="#1a1a3e"
          metalness={0.9}
          roughness={0.2}
          emissive="#00D4FF"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glowing edge ring */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <torusGeometry args={[3.15, 0.12, 12, 64]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Center wheel/handle */}
      <group ref={wheelRef} position={[0, 0, 0.35]}>
        {/* Wheel ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.08, 12, 32]} />
          <meshStandardMaterial
            color="#333355"
            metalness={0.95}
            roughness={0.1}
            emissive="#00D4FF"
            emissiveIntensity={hovered ? 0.6 : 0.15}
          />
        </mesh>
        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <mesh
            key={angle}
            rotation={[Math.PI / 2, 0, THREE.MathUtils.degToRad(angle)]}
            position={[
              Math.cos(THREE.MathUtils.degToRad(angle)) * 0.45,
              Math.sin(THREE.MathUtils.degToRad(angle)) * 0.45,
              0,
            ]}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.9, 8]} />
            <meshStandardMaterial
              color="#2a2a4e"
              metalness={0.9}
              roughness={0.15}
              emissive="#00D4FF"
              emissiveIntensity={hovered ? 0.4 : 0.05}
            />
          </mesh>
        ))}
        {/* Center hub */}
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
          <meshStandardMaterial
            color="#1a1a3e"
            metalness={0.9}
            roughness={0.1}
            emissive="#00D4FF"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Locking bolts around the perimeter */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <mesh
          key={`bolt-${angle}`}
          position={[
            Math.cos(THREE.MathUtils.degToRad(angle)) * 2.6,
            Math.sin(THREE.MathUtils.degToRad(angle)) * 2.6,
            0.28,
          ]}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.12, 8]} />
          <meshStandardMaterial
            color="#333355"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- ACCESS DENIED 3D text ---------- */
function DeniedText({ visible }) {
  const textRef = useRef()

  useFrame((state) => {
    if (!textRef.current) return
    textRef.current.fillOpacity = visible ? 1 : THREE.MathUtils.lerp(textRef.current.fillOpacity, 0, 0.1)
  })

  if (!visible) return null

  return (
    <Text
      ref={textRef}
      position={[0, 0, 1.5]}
      fontSize={0.55}
      color="#ff2020"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#ff0000"
      outlineOpacity={0.5}
    >
      ACCESS DENIED
    </Text>
  )
}

/* ---------- Main component ---------- */
export default function VaultScene() {
  const [accessDenied, setAccessDenied] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [flashOpacity, setFlashOpacity] = useState(0)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleAttempt = useCallback(() => {
    setAccessDenied(true)
    setAttempts((prev) => {
      const next = prev + 1
      return next
    })

    // Red flash
    setFlashOpacity(0.35)
    const fadeFlash = () => {
      setFlashOpacity((prev) => {
        if (prev <= 0.01) return 0
        requestAnimationFrame(fadeFlash)
        return prev * 0.9
      })
    }
    requestAnimationFrame(fadeFlash)

    // Screen shake
    setShaking(true)
    setTimeout(() => setShaking(false), 400)

    // Clear denied text
    setTimeout(() => setAccessDenied(false), 2000)
  }, [navigate])

  const shakeStyle = shaking
    ? {
        animation: 'vault-shake 0.1s linear 4',
      }
    : {}

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-primary)] relative overflow-hidden"
      style={shakeStyle}
    >
      {/* Inline keyframes for shake */}
      <style>{`
        @keyframes vault-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-4px, 2px); }
          50% { transform: translate(4px, -2px); }
          75% { transform: translate(-2px, -4px); }
        }
      `}</style>

      {/* Red flash overlay */}
      {flashOpacity > 0 && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{
            backgroundColor: `rgba(255, 32, 32, ${flashOpacity})`,
            transition: 'background-color 0.05s',
          }}
        />
      )}

      {/* ACCESS DENIED overlay */}
      {accessDenied && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <p
            className="text-red-500 text-5xl font-bold tracking-widest"
            style={{
              textShadow: '0 0 30px rgba(255, 32, 32, 0.8), 0 0 60px rgba(255, 32, 32, 0.4)',
              animation: 'fade-in 0.1s ease-out',
            }}
          >
            ACCESS DENIED
          </p>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="w-full flex-1 relative" style={{ maxHeight: '80vh' }}>
        <View className="absolute inset-0" style={{ cursor: hovered ? 'pointer' : 'default' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <color attach="background" args={['#050508']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-5, -5, -5]} color="#00D4FF" intensity={0.4} />
          <pointLight position={[0, 0, 4]} color="#00D4FF" intensity={0.3} distance={10} />

          <VaultDoor
            onAttempt={handleAttempt}
            hovered={hovered}
            setHovered={setHovered}
          />
          <DeniedText visible={accessDenied} />
        </View>
      </div>

      {/* Attempt counter + tooltip */}
      <div className="absolute bottom-8 text-center z-30">
        {attempts > 0 && (
          <p className="text-[var(--text-secondary)] text-sm mb-1 opacity-60">
            Attempts: {attempts}
          </p>
        )}
        {attempts >= 3 && (
          <p
            className="text-[var(--accent)] text-sm italic"
            style={{
              textShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
              animation: 'fade-in 0.8s ease-out',
            }}
          >
            Some things aren&apos;t for everyone.
          </p>
        )}
      </div>
    </div>
  )
}