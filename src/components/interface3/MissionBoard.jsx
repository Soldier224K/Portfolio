import { useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../utils/api'

import { useDashboardStore } from '../../stores/dashboardStore'

export default function MissionBoard() {
  const missions = useDashboardStore(state => state.missions)
  const setMissions = useDashboardStore(state => state.setMissions)

  useEffect(() => {
    api.get('/projects').then(res => {
      if (res.data.length > 0) {
        setMissions(res.data)
      } else {
        setMissions([
          { id: 1, title: 'Project E-Commerce', status: 'COMPLETED', priority: 'HIGH', date: '2026-04-10', desc: 'Checkout flow optimization' },
          { id: 2, title: 'Portfolio Rewrite', status: 'ACTIVE', priority: 'CRITICAL', date: '2026-05-20', desc: 'Interface 1, 2, 3 integration' },
        ])
      }
    }).catch(() => {})
  }, [setMissions])

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-[var(--accent)] border-[var(--accent)]'
      case 'COMPLETED': return 'text-cyan-400 border-cyan-400'
      case 'SHELVED': return 'text-[var(--amber)] border-[var(--amber)]'
      default: return 'text-[var(--text-secondary)] border-[var(--text-secondary)]'
    }
  }

  const getPriorityColor = (prio) => {
    switch (prio) {
      case 'CRITICAL': return 'text-[var(--warning)]'
      case 'HIGH': return 'text-orange-400'
      case 'MEDIUM': return 'text-yellow-400'
      case 'LOW': return 'text-[var(--accent)]'
      default: return 'text-white'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">MISSION_LOG</h3>
        <button className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] text-sm hover:bg-[var(--accent)] hover:text-black transition-colors">
          + NEW_MISSION
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {missions.map((m, i) => (
          <motion.div 
            key={m.id || m._id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-[var(--border)] p-4 bg-black/50 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg truncate max-w-[70%]">{m.title}</h4>
              <span className={`text-xs px-2 py-1 border ${getStatusColor(m.status)}`}>{m.status || 'ACTIVE'}</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4 h-10 overflow-hidden">{m.desc || m.description}</p>
            <div className="flex justify-between text-xs font-mono border-t border-[var(--border)] pt-2 mt-4">
              <span className={getPriorityColor(m.priority || 'MEDIUM')}>PRIORITY: {m.priority || 'MEDIUM'}</span>
              <span className="text-[var(--text-secondary)]">{m.date || new Date().toISOString().split('T')[0]}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
