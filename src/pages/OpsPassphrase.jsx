import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import api from '../utils/api'

const bootSequence = [
  "> SYSTEM BOOT...",
  "> LOADING KERNEL...",
  "> ESTABLISHING SECURE CONNECTION...",
  "> ENCRYPTION PROTOCOL: AES-256-GCM",
  "> STATUS: AWAITING AUTHENTICATION"
]

export default function OpsPassphrase() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedOut, setLockedOut] = useState(false)
  const [booted, setBooted] = useState(false)
  const [bootLines, setBootLines] = useState([])
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const navigate = useNavigate()
  const opsLogin = useAuthStore(state => state.opsLogin)

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[index]])
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => setBooted(true), 500)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (lockedOut || !passphrase) return

    setIsAuthenticating(true)
    setError('')
    try {
      const res = await api.post('/auth/ops-login', { passphrase })
      opsLogin(res.data.token)
      navigate('/ops/board')
    } catch (err) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setPassphrase('')
      if (newAttempts >= 5) {
        setLockedOut(true)
        setError("CONNECTION TERMINATED")
        setTimeout(() => { setLockedOut(false); setAttempts(0); setError(''); }, 60000)
      } else {
        setError(newAttempts >= 3 ? "SECURITY LOCKOUT IMMINENT" : "ACCESS DENIED")
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-[var(--accent)] font-mono scanline flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        
        <div className="mb-8 space-y-2 opacity-80 text-sm">
          {bootLines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{line}</motion.div>
          ))}
        </div>

        <AnimatePresence>
          {booted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-[var(--accent)] p-8 shadow-[0_0_20px_rgba(0,255,65,0.1)] relative bg-black">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--accent)] -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--accent)] translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--accent)] -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--accent)] translate-x-1 translate-y-1"></div>

              <h2 className="text-xl tracking-widest mb-6 font-bold">AUTHENTICATION_REQUIRED</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs mb-2 opacity-70 tracking-widest">ENTER_PASSPHRASE</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">&gt;</span>
                    <input 
                      type="password" 
                      value={passphrase} 
                      onChange={(e) => setPassphrase(e.target.value)} 
                      disabled={lockedOut || isAuthenticating}
                      autoFocus
                      className="w-full bg-transparent border border-[var(--border)] pl-8 pr-4 py-3 text-[var(--accent)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50" 
                    />
                    {/* Blinking cursor */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-[var(--accent)] animate-pulse pointer-events-none"></div>
                  </div>
                </div>

                {error && (
                  <div className={`text-sm tracking-widest font-bold ${attempts >= 3 ? 'text-[var(--warning)]' : 'text-red-500'}`}>
                    {error}
                  </div>
                )}

                <button 
                  disabled={lockedOut || isAuthenticating || !passphrase} 
                  type="submit" 
                  className="w-full py-3 bg-[var(--accent)]/10 border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-colors disabled:opacity-50 font-bold tracking-widest"
                >
                  {isAuthenticating ? 'VERIFYING...' : lockedOut ? 'LOCKED' : 'INITIATE_HANDSHAKE'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}