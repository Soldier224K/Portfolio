import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ProblemCard({ project, index = 0 }) {
  const [flipped, setFlipped] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="h-72 perspective-1000 group"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Front — Problem */}
        <div
          className="absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-between border transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary), rgba(0, 212, 255, 0.03))',
            borderColor: 'var(--border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.1), inset 0 0 30px rgba(0, 212, 255, 0.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Problem badge */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <span
              className="text-xs tracking-[0.2em] uppercase font-mono"
              style={{ color: 'var(--accent)' }}
            >
              Problem
            </span>
          </div>

          {/* Problem text */}
          <p
            className="text-lg font-medium leading-relaxed"
            style={{ color: 'var(--text)' }}
          >
            {project.problem}
          </p>

          {/* Flip hint */}
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Hover for solution
            </span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
        </div>

        {/* Back — Solution */}
        <div
          className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl p-6 flex flex-col justify-between border"
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary), rgba(0, 255, 170, 0.03))',
            borderColor: 'rgba(0, 255, 170, 0.2)',
            boxShadow: '0 0 30px rgba(0, 255, 170, 0.08)',
          }}
        >
          {/* Solution badge */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent-secondary)' }}
            />
            <span
              className="text-xs tracking-[0.2em] uppercase font-mono"
              style={{ color: 'var(--accent-secondary)' }}
            >
              Solution
            </span>
          </div>

          {/* Solution text */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.solution}
          </p>

          {/* Tech stack badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-full text-xs font-mono border"
                  style={{
                    borderColor: 'rgba(0, 212, 255, 0.2)',
                    color: 'var(--accent)',
                    background: 'rgba(0, 212, 255, 0.05)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Outcome */}
            <div
              className="flex items-center gap-2 pt-2"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-secondary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--accent-secondary)' }}
              >
                {project.outcome}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}