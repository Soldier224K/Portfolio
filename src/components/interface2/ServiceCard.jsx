import { motion } from 'framer-motion'

export default function ServiceCard({ title, description, icon, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors group"
    >
      <div className="w-12 h-12 mb-6 text-[var(--accent)] bg-[var(--accent)]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
        {description}
      </p>
      <button className="text-[var(--accent)] text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
        Learn more <span className="text-lg">→</span>
      </button>
    </motion.div>
  )
}
