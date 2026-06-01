import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import api from '../utils/api'

export default function ProPortfolio() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const formData = new FormData(e.target)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      company: formData.get('company'),
    }

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email: data.email, password: data.password })
        login(res.data.user, res.data.token, res.data.refreshToken)
        api.post('/visitors/log', { purpose: 'portfolio-browse' }).catch(() => {})
      } else {
        await api.post('/auth/register', data)
      }
      navigate('/pro/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text)] relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 opacity-[0.02] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <nav className="p-6 border-b border-[var(--border)] relative z-10 flex justify-between items-center">
        <span className="font-bold tracking-widest text-lg">RAJ RASAL</span>
        <a href="/" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">← Back to Public</a>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-12 relative z-10 w-full">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold rounded mb-6 tracking-widest">PROFESSIONAL PORTAL</span>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            Engineering <span className="text-[var(--accent)]">Digital</span> Experiences.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed">
            Full-stack developer specializing in scalable architectures and immersive 3D web interfaces. 
            Sign in to explore detailed case studies, technical breakdowns, and collaboration opportunities.
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--border)] max-w-md">
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">5+</h4>
              <p className="text-sm text-[var(--text-secondary)]">Years Experience</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">20+</h4>
              <p className="text-sm text-[var(--text-secondary)]">Projects Shipped</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full max-w-md mx-auto">
          <div className="glass-light rounded-2xl p-8 border border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--accent)] to-[var(--bg-primary)]"></div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Access'}</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              {isLogin ? 'Sign in to access the professional dashboard.' : 'Register to explore detailed case studies.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                    <input name="name" type="text" placeholder="Full Name" required={!isLogin} className="w-full px-4 py-3 bg-black/50 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors text-white" />
                    <input name="company" type="text" placeholder="Company / Role" className="w-full px-4 py-3 bg-black/50 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <input name="email" type="email" placeholder="Email Address" required className="w-full px-4 py-3 bg-black/50 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors text-white" />
              <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-3 bg-black/50 border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors text-white" />
              
              {error && <p className="text-red-400 text-sm py-2">{error}</p>}
              
              <button disabled={isLoading} type="submit" className="w-full py-3 mt-4 bg-[var(--accent)] hover:bg-opacity-90 text-black font-bold rounded-lg transition-all disabled:opacity-50">
                {isLoading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'REQUEST ACCESS'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                {isLogin ? "Don't have an account? Register" : "Already have access? Sign In"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}