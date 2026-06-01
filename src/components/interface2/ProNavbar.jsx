import { useAuthStore } from '../../stores/authStore'

export default function ProNavbar() {
  const logout = useAuthStore((state) => state.logout)
  
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="font-bold text-xl tracking-wider cursor-pointer" onClick={() => scrollTo('top')}>
          RAJ RASAL
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Case Studies', 'Services', 'Book'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollTo(item.toLowerCase().replace(' ', '-'))}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={logout}
          className="text-xs tracking-wider border border-[var(--border)] px-4 py-2 rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  )
}
