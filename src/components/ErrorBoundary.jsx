import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-[#00FF41] font-mono flex flex-col items-center justify-center p-6 text-center scanline">
          <div className="border border-[#00FF41] p-8 max-w-2xl bg-black/80">
            <h1 className="text-3xl font-bold tracking-widest mb-4 uppercase">System Malfunction</h1>
            <p className="opacity-80 mb-6 uppercase">A critical rendering error has occurred in this module.</p>
            <div className="bg-[#00FF41]/10 p-4 border border-[#00FF41]/30 text-left overflow-auto text-xs max-h-48 mb-8">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 border border-[#00FF41] font-bold tracking-widest hover:bg-[#00FF41] hover:text-black transition-colors"
            >
              INITIATE REBOOT
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
