import { useEffect } from 'react'
import { motion } from 'framer-motion'

import { useDashboardStore } from '../../stores/dashboardStore'

export default function PendingOps() {
  const tasks = useDashboardStore(state => state.pendingOps)
  const setTasks = useDashboardStore(state => state.setPendingOps)

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks([
        { id: 1, title: 'Implement WebSocket chat', priority: 'HIGH', deadline: '2026-06-01', mission: 'PORTFOLIO_V2', status: 'PENDING' },
        { id: 2, title: 'Optimize Three.js bundle', priority: 'MEDIUM', deadline: '2026-06-15', mission: 'PORTFOLIO_V2', status: 'PENDING' },
        { id: 3, title: 'Fix mobile layout on Interface 3', priority: 'CRITICAL', deadline: '2026-05-28', mission: 'PORTFOLIO_V2', status: 'PENDING' }
      ])
    }
  }, [tasks.length, setTasks])

  const completeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'CRITICAL': return 'text-[var(--warning)] border-[var(--warning)]'
      case 'HIGH': return 'text-orange-400 border-orange-400'
      case 'MEDIUM': return 'text-yellow-400 border-yellow-400'
      case 'LOW': return 'text-[var(--accent)] border-[var(--accent)]'
      default: return 'text-white border-white'
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const pVals = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
    if (pVals[b.priority] !== pVals[a.priority]) return pVals[b.priority] - pVals[a.priority]
    return new Date(a.deadline) - new Date(b.deadline)
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">PENDING_OPERATIONS</h3>
        <button className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] text-sm hover:bg-[var(--accent)] hover:text-black transition-colors">
          + ASSIGN_TASK
        </button>
      </div>

      <div className="space-y-3">
        {sortedTasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-[var(--border)] bg-black/40 p-3 flex flex-col md:flex-row justify-between md:items-center hover:border-[var(--accent)] transition-colors group"
          >
            <div className="flex flex-col mb-3 md:mb-0">
              <span className="font-bold text-white mb-1">{task.title}</span>
              <div className="flex gap-3 text-[10px]">
                <span className={`px-2 py-0.5 border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                <span className="text-[var(--text-secondary)] mt-1">MISSION: {task.mission}</span>
                <span className="text-[var(--text-secondary)] mt-1">DUE: {task.deadline}</span>
              </div>
            </div>
            <button 
              onClick={() => completeTask(task.id)}
              className="px-3 py-1 bg-transparent border border-[var(--accent)] text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)] hover:text-black transition-colors md:opacity-0 group-hover:opacity-100"
            >
              COMPLETE_OP
            </button>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="text-[var(--text-secondary)] p-8 border border-dashed border-[var(--border)] text-center">
            NO PENDING OPERATIONS.
          </div>
        )}
      </div>
    </div>
  )
}
