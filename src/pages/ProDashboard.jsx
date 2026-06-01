import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ProNavbar from '../components/interface2/ProNavbar'
import CaseStudyCard from '../components/interface2/CaseStudyCard'
import ServiceCard from '../components/interface2/ServiceCard'
import BookingForm from '../components/interface2/BookingForm'
import { useAuthStore } from '../stores/authStore'

const projects = [
  {
    id: 1,
    title: 'SecureVerse (Deal Dome 3rd Place)',
    description: 'Developed an innovative encrypted platform winning 3rd place at the Deal Dome hackathon.',
    tech: ['React', 'Node.js', 'MongoDB', 'AES-256-GCM'],
    outcome: 'Award-winning architecture'
  },
  {
    id: 2,
    title: 'E-Commerce Checkout Flow',
    description: 'Rebuilt checkout flow for major retailer, solving cart abandonment issues.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
    outcome: '50% less abandonment'
  },
  {
    id: 2,
    title: 'Immersive 3D Portfolio',
    description: 'A multi-interface portfolio with interactive 3D WebGL experiences and encrypted ops board.',
    tech: ['Three.js', 'React', 'R3F', 'Framer Motion'],
    outcome: 'Interactive storytelling'
  },
  {
    id: 3,
    title: 'Real-time Task Manager',
    description: 'Collaboration platform with drag-and-drop boards and instant state sync.',
    tech: ['React', 'Firebase', 'WebSocket', 'Tailwind'],
    outcome: '500+ daily active users'
  },
  {
    id: 4,
    title: 'Learning Progression Dashboard',
    description: 'Educational portal with progress tracking, streak gamification and charts.',
    tech: ['React', 'Express', 'Chart.js', 'PostgreSQL'],
    outcome: '92% 30-day retention'
  }
]

const ServerIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
const CubeIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
const LightbulbIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>

export default function ProDashboard() {
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    if (user) {
      import('../utils/api').then(({ default: api }) => {
        api.post('/visitors/log', {
          name: user.name,
          email: user.email,
          company: 'N/A',
          purpose: 'BROWSING',
          pagesViewed: ['/pro/dashboard'],
          timeSpent: 0
        }).catch(() => {})
      })
    }
  }, [user])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text)] pb-24">
      <ProNavbar />
      
      <div id="top" className="pt-32 pb-16 px-6 max-w-6xl mx-auto border-b border-[var(--border)] flex flex-col md:flex-row items-start md:items-center gap-8">
        <motion.img 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          src="/assets/photo1.png" 
          alt="Raj Rasal" 
          className="w-32 h-32 rounded-full border-2 border-[var(--accent)] object-cover shadow-[0_0_20px_rgba(0,212,255,0.2)]" 
        />
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome, {user?.name || 'Guest'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-[var(--text-secondary)] max-w-2xl">
            You've accessed the professional portal. Here you'll find detailed project breakdowns, 
            available services, and direct booking options.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <section id="case-studies" className="py-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Case Studies</h2>
            <p className="text-[var(--text-secondary)]">Deep dives into recent technical challenges and solutions.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <CaseStudyCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </section>

        <section id="services" className="py-20 border-t border-[var(--border)]">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Services</h2>
            <p className="text-[var(--text-secondary)]">Areas of expertise available for collaboration.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard title="Full-Stack Development" description="End-to-end web application development using modern stacks (React, Node, PostgreSQL/MongoDB)." icon={<ServerIcon />} index={0} />
            <ServiceCard title="3D & Creative Engineering" description="Interactive 3D experiences, WebGL implementations, and immersive user interfaces." icon={<CubeIcon />} index={1} />
            <ServiceCard title="Consulting & Architecture" description="Technical consulting, code review, performance optimization, and architecture planning." icon={<LightbulbIcon />} index={2} />
          </div>
        </section>

        <section id="book" className="py-20 border-t border-[var(--border)]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
            <p className="text-[var(--text-secondary)]">Request a consultation or discuss a potential project.</p>
          </div>
          <BookingForm />
        </section>
      </div>
    </div>
  )
}