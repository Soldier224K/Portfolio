import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { gsap } from 'gsap'
import { Helmet } from 'react-helmet-async'
import './YearDetail.css'

const yearContent = {
  2018: {
    title: 'The Beginning',
    description: 'Started my journey in web development. First lines of code, first static websites.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    projects: ['First Portfolio Site', 'Landing Pages', 'Interactive Forms'],
    color: '#4a90e2'
  },
  2020: {
    title: 'Framework Mastery',
    description: 'Learned React, Vue, and Angular. Built first full-stack applications.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    projects: ['E-commerce App', 'Task Manager', 'Chat Application'],
    color: '#6a5acd'
  },
  2022: {
    title: 'Full Stack Growth',
    description: 'Advanced backend skills, databases, authentication, and deployment.',
    skills: ['TypeScript', 'GraphQL', 'Docker', 'AWS'],
    projects: ['SaaS Dashboard', 'Real-time Analytics', 'Microservices'],
    color: '#8a2be2'
  },
  2024: {
    title: 'Interactive Immersion',
    description: 'Deep dive into Three.js, WebGL, and immersive web experiences.',
    skills: ['Three.js', 'GSAP', 'Framer Motion', 'WebXR Basics'],
    projects: ['3D Portfolio', 'Interactive Data Viz', 'WebGL Experiments'],
    color: '#9370db'
  },
  2025: {
    title: 'Creative Technologist',
    description: 'Building cutting-edge interactive experiences and AI integrations.',
    skills: ['React 19', 'Vite', 'AI APIs', 'Advanced Animations'],
    projects: ['Interactive Comics', 'AI Dashboards', 'Immersive Portfolios'],
    color: '#00bfff'
  }
}

function AnimatedSphere({ position, color }) {
  const meshRef = useRef()
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        x: Math.PI * 2,
        duration: 25,
        repeat: -1,
        ease: 'none'
      })
    }
  }, [])
  
  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <AnimatedSphere position={[0, 0, 0]} color="#4a90e2" />
      <AnimatedSphere position={[2, 1, -2]} color="#6a5acd" />
      <AnimatedSphere position={[-2, -1, -1]} color="#00bfff" />
      <Environment preset="night" />
    </>
  )
}

export default function YearDetail() {
  const { year } = useParams()
  const content = yearContent[year] || yearContent[2018]
  const containerRef = useRef()
  const prevYear = parseInt(year) - 1
  const nextYear = parseInt(year) + 1

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
  }, [year])

  return (
    <div className="year-detail-page">
      <Helmet>
        <title>Year {year} | Portfolio</title>
        <meta name="description" content={content.description} />
      </Helmet>

      <Canvas className="year-scene" camera={{ position: [0, 0, 8] }}>
        <Scene />
      </Canvas>

      <div className="year-content" ref={containerRef}>
        <div className="year-header">
          <h1 className="year-title">Year {year}</h1>
          <p className="year-subtitle" style={{ color: content.color }}>{content.title}</p>
        </div>

        <p className="year-description">{content.description}</p>

        <div className="skills-section">
          <h3>Skills Mastered</h3>
          <div className="skills-grid">
            {content.skills.map(skill => (
              <span key={skill} className="skill-tag" style={{ borderColor: content.color }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="projects-section">
          <h3>Projects Built</h3>
          <ul className="projects-list">
            {content.projects.map((project, i) => (
              <li key={i}>{project}</li>
            ))}
          </ul>
        </div>

        <div className="year-nav">
          {prevYear >= 2018 && (
            <Link to={`/year/${prevYear}`} className="nav-link">
              ← {prevYear}
            </Link>
          )}
          <Link to="/" className="nav-link">
            Home
          </Link>
          {nextYear <= 2025 && (
            <Link to={`/year/${nextYear}`} className="nav-link">
              {nextYear} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}