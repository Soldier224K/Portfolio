import { motion } from 'framer-motion'

const ranks = ['Recruit', 'Private', 'Specialist', 'Sergeant', 'Lieutenant', 'Commander']
const currentRank = 'Specialist'
const nextRank = 'Sergeant'
const rankProgress = 65

const medals = [
  { id: 1, icon: '🚀', name: 'First Deploy', desc: 'Shipped first full-stack application to production.', date: '2023-10-15' },
  { id: 2, icon: '🐛', name: 'Bug Hunter', desc: 'Resolved over 100 tracked issues across projects.', date: '2024-02-20' },
  { id: 3, icon: '⚔️', name: 'Full Stack', desc: 'Successfully integrated frontend with complex backend architecture.', date: '2024-06-10' },
  { id: 4, icon: '🧊', name: '3D Pioneer', desc: 'Completed first Three.js/WebGL interactive experience.', date: '2025-01-05' },
  { id: 5, icon: '🔐', name: 'Encryption Master', desc: 'Implemented AES-256-GCM field-level database encryption.', date: '2026-05-15' },
  { id: 6, icon: '🦉', name: 'Midnight Coder', desc: 'Logged 100+ hours of development between 12 AM and 4 AM.', date: '2026-05-20' }
]

export default function RankRewards() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">SERVICE_RECORD</h3>
      </div>

      <div className="border border-[var(--border)] p-6 bg-[var(--accent)]/5 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 border-2 border-[var(--accent)] rounded-sm flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(0,255,65,0.3)]">
            ⭐⭐
          </div>
          <div>
            <div className="text-[var(--text-secondary)] text-sm mb-1">CURRENT RANK</div>
            <div className="text-3xl font-bold text-white tracking-widest uppercase">{currentRank}</div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex justify-between text-xs mb-2">
            <span>PROGRESS TO {nextRank.toUpperCase()}</span>
            <span>{rankProgress}%</span>
          </div>
          <div className="w-full h-3 bg-black border border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[var(--accent)]" style={{ width: `${rankProgress}%` }}>
              <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)]"></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[var(--text-secondary)] mb-4 tracking-widest text-sm">COMMENDATIONS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medals.map((medal, i) => (
            <motion.div 
              key={medal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="border border-[var(--border)] p-4 flex gap-4 hover:border-yellow-500/50 transition-colors bg-black/40 group"
            >
              <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{medal.icon}</div>
              <div>
                <div className="font-bold text-yellow-500 text-sm mb-1">{medal.name.toUpperCase()}</div>
                <div className="text-xs text-[var(--text-secondary)] mb-2 leading-relaxed">{medal.desc}</div>
                <div className="text-[10px] text-[var(--text-secondary)] opacity-50">{medal.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
