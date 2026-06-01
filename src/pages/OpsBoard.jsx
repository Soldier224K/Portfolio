import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import MissionBoard from '../components/interface3/MissionBoard'
import IntelVault from '../components/interface3/IntelVault'
import DocumentDepot from '../components/interface3/DocumentDepot'
import LearningLog from '../components/interface3/LearningLog'
import RankRewards from '../components/interface3/RankRewards'
import PendingOps from '../components/interface3/PendingOps'
import VisitorIntel from '../components/interface3/VisitorIntel'
import MetricsControl from '../components/interface3/MetricsControl'

const tabs = [
  { id: 'missions', label: 'MISSIONS', component: MissionBoard },
  { id: 'intel', label: 'INTEL', component: IntelVault },
  { id: 'documents', label: 'DOCUMENTS', component: DocumentDepot },
  { id: 'learning', label: 'KNOWLEDGE', component: LearningLog },
  { id: 'rank', label: 'RANK', component: RankRewards },
  { id: 'pending', label: 'PENDING_OPS', component: PendingOps },
  { id: 'visitors', label: 'VISITORS', component: VisitorIntel },
  { id: 'metrics', label: 'METRICS', component: MetricsControl }
]

export default function OpsBoard() {
  const [activeTab, setActiveTab] = useState('missions')
  const [timeStr, setTimeStr] = useState('')
  const [sessionTime, setSessionTime] = useState(0)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const day = now.getDate().toString().padStart(2, '0')
      const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      const year = now.getFullYear()
      const hrs = now.getHours().toString().padStart(2, '0')
      const mins = now.getMinutes().toString().padStart(2, '0')
      setTimeStr(`${day} ${month} ${year} — ${hrs}${mins} HRS`)
    }
    updateTime()
    const int1 = setInterval(updateTime, 60000)
    const int2 = setInterval(() => setSessionTime(p => p + 1), 1000)
    return () => { clearInterval(int1); clearInterval(int2); }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || MissionBoard

  const formatSessionTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <div className="min-h-screen bg-black text-[var(--accent)] font-mono scanline p-4 md:p-8">
      {/* Top Header */}
      <header className="border border-[var(--accent)] p-4 mb-8 bg-[var(--accent)]/5 flex flex-col md:flex-row justify-between items-center shadow-[0_0_15px_rgba(0,255,65,0.1)]">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-3 h-3 bg-[var(--accent)] animate-pulse shadow-[0_0_10px_rgba(0,255,65,1)]"></div>
          <h1 className="text-2xl font-bold tracking-[0.2em]">CLASSIFIED_OPS</h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
          <div className="flex gap-4 opacity-80">
            <span>UPTIME: {formatSessionTime(sessionTime)}</span>
            <span>{timeStr}</span>
          </div>
          <button onClick={handleLogout} className="px-4 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors font-bold tracking-widest">
            TERMINATE_SESSION
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Nav Sidebar */}
        <nav className="lg:col-span-3 space-y-2 border border-[var(--border)] p-4 h-fit">
          <h2 className="text-[10px] text-[var(--text-secondary)] tracking-widest mb-4">COMMAND_MODULES</h2>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 tracking-widest transition-all ${activeTab === tab.id ? 'bg-[var(--accent)]/10 border-l-4 border-[var(--accent)] font-bold text-[var(--accent)]' : 'border-l-4 border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:border-[var(--text-secondary)] hover:text-white'}`}
            >
              &gt; {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="lg:col-span-9 border border-[var(--border)] p-6 md:p-8 min-h-[600px] relative overflow-hidden bg-black/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}