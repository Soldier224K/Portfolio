import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'
import { useDashboardStore } from '../../stores/dashboardStore'

export default function VisitorIntel() {
  const visitors = useDashboardStore(state => state.visitors)
  const setVisitors = useDashboardStore(state => state.setVisitors)
  const [loading, setLoading] = useState(true)

  const fetchVisitors = () => {
    api.get('/visitors')
      .then(res => setVisitors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchVisitors()
    const interval = setInterval(fetchVisitors, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">VISITOR_INTEL</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
          <span className="text-[10px] text-[var(--accent)] tracking-widest">LIVE_FEED</span>
        </div>
      </div>

      {loading ? (
        <div className="text-[var(--accent)] animate-pulse">ESTABLISHING CONNECTION_</div>
      ) : visitors.length === 0 ? (
        <div className="text-[var(--text-secondary)] border border-dashed border-[var(--border)] p-12 text-center font-mono">
          NO EXTERNAL CONNECTIONS DETECTED.
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {visitors.map((v, i) => (
              <motion.div 
                key={v._id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="border border-[var(--border)] bg-black/40 p-4 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="font-bold text-white tracking-wider">{v.name || 'UNKNOWN_ENTITY'}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{new Date(v.loginTimestamp || v.createdAt).toLocaleString()}</div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-xs font-mono pl-2 text-[var(--text-secondary)]">
                  <div><span className="text-[var(--accent)] opacity-70">ORG:</span> {v.company || 'N/A'}</div>
                  <div><span className="text-[var(--accent)] opacity-70">EMAIL:</span> {v.email || 'N/A'}</div>
                  <div className="col-span-full"><span className="text-[var(--accent)] opacity-70">INTENT:</span> {v.purpose || 'BROWSING'}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
