import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { motion } from 'framer-motion'

export default function MetricsControl() {
  const [formData, setFormData] = useState({
    githubCommitsThisWeek: 0,
    hoursCoded: 0,
    currentObsession: '',
    status: 'building'
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/metrics').then(res => {
      if (res.data) setFormData(res.data)
    }).catch(() => {})
  }, [])

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/metrics', {
        ...formData,
        githubCommitsThisWeek: parseInt(formData.githubCommitsThisWeek),
        hoursCoded: parseInt(formData.hoursCoded)
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      alert('TRANSMISSION_ERROR')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
        <h3 className="text-[var(--accent)] text-xl font-bold tracking-widest">METRICS_OVERRIDE</h3>
        {success && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--accent)] text-xs font-bold animate-pulse">TRANSMISSION_SUCCESSFUL</motion.span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 border border-[var(--border)] p-6 bg-black/40">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-[var(--accent)] mb-2 tracking-widest">GITHUB_COMMITS</label>
            <input type="number" name="githubCommitsThisWeek" value={formData.githubCommitsThisWeek} onChange={handleChange} className="w-full bg-black border border-[var(--border)] p-2 text-[var(--accent)] font-mono focus:outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="block text-xs text-[var(--accent)] mb-2 tracking-widest">HOURS_CODED</label>
            <input type="number" name="hoursCoded" value={formData.hoursCoded} onChange={handleChange} className="w-full bg-black border border-[var(--border)] p-2 text-[var(--accent)] font-mono focus:outline-none focus:border-[var(--accent)]" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--accent)] mb-2 tracking-widest">CURRENT_OBSESSION</label>
          <input type="text" name="currentObsession" value={formData.currentObsession} onChange={handleChange} className="w-full bg-black border border-[var(--border)] p-2 text-[var(--accent)] font-mono focus:outline-none focus:border-[var(--accent)]" />
        </div>

        <div>
          <label className="block text-xs text-[var(--accent)] mb-2 tracking-widest">SYSTEM_STATUS</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-black border border-[var(--border)] p-2 text-[var(--accent)] font-mono focus:outline-none focus:border-[var(--accent)] appearance-none">
            <option value="building">BUILDING</option>
            <option value="thinking">THINKING</option>
            <option value="resting">RESTING</option>
          </select>
        </div>

        <button disabled={saving} type="submit" className="w-full py-3 bg-[var(--accent)] text-black font-bold tracking-widest hover:bg-opacity-80 transition-opacity disabled:opacity-50">
          {saving ? 'UPLOADING...' : 'OVERRIDE_METRICS'}
        </button>
      </form>
    </div>
  )
}
