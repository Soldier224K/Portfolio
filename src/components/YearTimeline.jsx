import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const timelineYears = [
  {
    year: '2018',
    title: 'The Foundation',
    subtitle: 'Learning to Code',
    description: 'Started with HTML, CSS, and JavaScript. Built first static websites.',
    color: '#4a90e2'
  },
  {
    year: '2020',
    title: 'The Shift',
    subtitle: 'React & Frameworks',
    description: 'Mastering modern frameworks. First full-stack applications.',
    color: '#6a5acd'
  },
  {
    year: '2022',
    title: 'The Expansion',
    subtitle: 'Full Stack Mastery',
    description: 'Backend APIs, databases, and deployment pipelines.',
    color: '#8a2be2'
  },
  {
    year: '2024',
    title: 'The Immersion',
    subtitle: '3D & Interactive',
    description: 'Deep dive into Three.js, WebGL, and immersive experiences.',
    color: '#9370db'
  },
  {
    year: '2025',
    title: 'The Present',
    subtitle: 'Creative Technologist',
    description: 'Building cutting-edge interactive portfolios and AI integrations.',
    color: '#00bfff'
  }
]

export default function YearTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const titleRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (isInView) {
      const tl = gsap.timeline()
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(gridRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=0.3'
      )
    }
  }, [isInView])

  return (
    <section 
      id="timeline" 
      ref={ref}
      className="relative min-h-screen py-24 px-6"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p 
            ref={titleRef}
            className="text-xs tracking-[0.5em] uppercase font-mono mb-4"
            style={{ color: '#4a90e2' }}
          >
            My Journey
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Ten Years</span> of Growth
          </h2>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {timelineYears.map((item) => (
            <Link
              key={item.year}
              to={`/year/${item.year}`}
              className="block group"
              style={{ '--accent': item.color }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative p-8 rounded-2xl border transition-all duration-300 h-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color
                  e.currentTarget.style.boxShadow = `0 0 30px ${item.color}30`
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: '#fff' }}
                  >
                    {item.year}
                  </span>
                </div>
                
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>
                
                <p 
                  className="text-sm uppercase tracking-wider mb-3"
                  style={{ color: '#888' }}
                >
                  {item.subtitle}
                </p>
                
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#aaa' }}
                >
                  {item.description}
                </p>

                <div className="mt-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs uppercase tracking-wider" style={{ color: item.color }}>
                    Explore this year
                  </span>
                  <svg 
                    className="w-4 h-4 ml-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ color: item.color }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}