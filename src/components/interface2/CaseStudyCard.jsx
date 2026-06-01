import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CaseStudyCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="h-48 w-full bg-gradient-to-br from-[#1a2035] to-[#0A0F1E] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent)] opacity-5 mix-blend-overlay"></div>
        <h3 className="text-2xl font-bold text-white z-10 text-center">{project.title}</h3>
      </div>
      
      <div className="p-6">
        <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map(t => (
            <span key={t} className="text-xs px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[var(--text-secondary)]">
              {t}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {project.outcome}
          </div>
          <div className="text-[var(--text-secondary)] opacity-50">
            <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden border-t border-[var(--border)] pt-6"
            >
              <h4 className="font-semibold text-white mb-2">The Challenge</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Detailed challenge description goes here. It involves complex problem solving and elegant technical execution.</p>
              
              <h4 className="font-semibold text-white mb-2">The Solution</h4>
              <p className="text-sm text-[var(--text-secondary)]">A comprehensive overview of how the problem was addressed using the stated technologies.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
