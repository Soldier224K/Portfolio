import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'hero', label: 'HOME' },
  { id: 'iceberg', label: 'DEPTH' },
  { id: 'mindmap', label: 'NETWORK' },
  { id: 'projects', label: 'WORK' },
  { id: 'vault', label: 'VAULT' },
  { id: 'philosophy', label: 'BELIEFS' },
  { id: 'contact', label: 'CONNECT' },
]

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3"
      aria-label="Section navigation"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group flex items-center gap-3 cursor-pointer"
            aria-label={`Scroll to ${section.label}`}
          >
            {/* Label — shows on hover */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-[10px] tracking-[0.2em] font-mono uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            <span
              className="hidden group-hover:inline-block text-[10px] tracking-[0.2em] font-mono uppercase"
              style={{
                color: 'var(--text-secondary)',
                display: isActive ? 'none' : undefined,
              }}
            >
              {section.label}
            </span>

            {/* Dot */}
            <motion.div
              className="relative"
              animate={{
                scale: isActive ? 1 : 0.6,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border transition-all duration-300"
                style={{
                  borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  boxShadow: isActive
                    ? '0 0 12px rgba(0, 212, 255, 0.5), 0 0 24px rgba(0, 212, 255, 0.2)'
                    : 'none',
                }}
              />
            </motion.div>
          </button>
        )
      })}

      {/* Connecting line */}
      <div
        className="absolute right-[4px] top-0 bottom-0 w-px -z-10"
        style={{ backgroundColor: 'var(--border)' }}
      />
    </nav>
  )
}
