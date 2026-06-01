import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import { useDashboardStore } from '../../stores/dashboardStore'

export default function IntelVault() {
  const ideas = useDashboardStore(state => state.intel)
  const setIdeas = useDashboardStore(state => state.setIntel)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ideas')
      .then(res => setIdeas(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setIdeas])

  const getBadgeColor = (level) => {
    switch(level) {
      case 'LOW': return 'text-[var(--accent)] border-[var(--accent)]'
      case 'RESTRICTED': return 'text-[var(--amber)] border-[var(--amber)]'
      case 'TOP SECRET': return 'text-[var(--warning)] border-[var(--warning)]'
      default: return 'text-[var(--text-secondary)] border-[var(--border)]'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">INTEL_VAULT [ENCRYPTED]</h3>
        <button className="px-4 py-2 bg-[var(--accent)] text-black text-sm font-bold hover:opacity-80 transition-opacity">
          + NEW_INTEL
        </button>
      </div>

      {loading ? (
        <div className="text-[var(--accent)] animate-pulse">RETRIEVING DATA_</div>
      ) : ideas.length === 0 ? (
        <div className="text-[var(--text-secondary)] border border-dashed border-[var(--border)] p-8 text-center">NO CLASSIFIED INTEL FOUND.</div>
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea, i) => (
            <motion.div 
              key={idea._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-[var(--border)] p-4 flex flex-col md:flex-row justify-between md:items-center bg-black/40 hover:border-[var(--accent)] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 border ${getBadgeColor(idea.classificationLevel)}`}>
                    {idea.classificationLevel || 'UNCLASSIFIED'}
                  </span>
                  <span className="text-[10px] text-[var(--accent)]">[{idea.domain}]</span>
                </div>
                <h4 className="font-bold text-white tracking-wide">{idea.titleDecrypted || '████████'}</h4>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <div className="text-xs text-[var(--text-secondary)] mb-1">STATUS: {idea.status}</div>
                <div className="text-[10px] text-[var(--text-secondary)] opacity-50">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
