import { useEffect } from 'react'
import { motion } from 'framer-motion'

import { useDashboardStore } from '../../stores/dashboardStore'

export default function LearningLog() {
  const logs = useDashboardStore(state => state.learningLogs)
  const setLogs = useDashboardStore(state => state.setLearningLogs)

  useEffect(() => {
    if (logs.length === 0) {
      setLogs([
        { id: 1, title: 'Three.js Journey', type: 'COURSE', progress: 80, status: 'IN_PROGRESS' },
        { id: 2, title: 'Advanced React Patterns', type: 'TUTORIAL', progress: 100, status: 'COMPLETED' },
      ])
    }
  }, [logs.length, setLogs])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">KNOWLEDGE_ACQUISITION</h3>
        <button className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] text-sm hover:bg-[var(--accent)] hover:text-black transition-colors">
          + ADD_ENTRY
        </button>
      </div>

      <div className="grid gap-4">
        {logs.map((log, i) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-[var(--border)] p-4 bg-black/40 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 border border-[var(--text-secondary)] text-[var(--text-secondary)]">{log.type}</span>
                <span className="font-bold">{log.title}</span>
              </div>
              <span className={`text-xs ${log.progress === 100 ? 'text-cyan-400' : 'text-[var(--accent)]'}`}>
                {log.progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-black border border-[var(--border)] mt-4">
              <div 
                className={`h-full ${log.progress === 100 ? 'bg-cyan-400' : 'bg-[var(--accent)]'} transition-all duration-1000`} 
                style={{ width: `${log.progress}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
