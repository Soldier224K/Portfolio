import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0

    const lerp = (start, end, factor) => start + (end - start) * factor

    const animate = () => {
      cursorX = lerp(cursorX, mouseX, 0.12)
      cursorY = lerp(cursorY, mouseY, 0.12)
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`
      requestAnimationFrame(animate)
    }
    animate()

    const moveCursor = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  return <div ref={cursorRef} className="magnetic-cursor hidden md:block pointer-events-none" />
}