import { Routes, Route, Navigate } from 'react-router-dom'
import PublicPortfolio from './pages/PublicPortfolio'
import ErrorBoundary from './components/ErrorBoundary'
import LenisProvider from './components/LenisProvider'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <ErrorBoundary>
      <LenisProvider>
        <div className="noise-bg" />
        <CustomCursor />
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LenisProvider>
    </ErrorBoundary>
  )
}