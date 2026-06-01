import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

export default function LenisProvider({ children }) {
  const lenisRef = useRef()

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    const frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={true} options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
