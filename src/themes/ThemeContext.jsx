import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { theme1, theme2, theme3 } from './index.js'

export function ThemeProvider({ children }) {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    let selectedTheme = theme1

    if (path.startsWith('/pro')) {
      selectedTheme = theme2
    } else if (path.startsWith('/ops')) {
      selectedTheme = theme3
    }

    const root = document.documentElement
    const { colors, font } = selectedTheme

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    root.style.setProperty('--font-family', font)
    root.setAttribute('data-theme', selectedTheme.name)
    document.body.className = selectedTheme.name
  }, [location])

  return <>{children}</>
}