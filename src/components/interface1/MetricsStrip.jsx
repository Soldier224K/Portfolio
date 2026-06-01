import { useEffect, useRef } from 'react'
import api from '../../utils/api'
import { usePublicStore } from '../../stores/publicStore'

export default function MetricsStrip() {
  const metrics = usePublicStore(state => state.metrics)
  const setMetrics = usePublicStore(state => state.setMetrics)
  const tickerRef = useRef(null)

  useEffect(() => {
    api
      .get('/metrics')
      .then((res) => setMetrics(res.data))
      .catch(() => {})

    // Poll every 5 minutes
    const interval = setInterval(() => {
      api
        .get('/metrics')
        .then((res) => setMetrics(res.data))
        .catch(() => {})
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [setMetrics])

  const statusColors = {
    building: '#00D4FF',
    thinking: '#FFBF00',
    resting: '#A0A0C0',
  }

  const statusColor = statusColors[metrics.status] || statusColors.building

  const metricsItems = [
    {
      label: 'GIT',
      value: `${metrics.githubCommitsThisWeek} COMMITS`,
      icon: '◆',
    },
    {
      label: 'HRS',
      value: `${metrics.hoursCoded}H THIS WEEK`,
      icon: '▸',
    },
    {
      label: 'FOCUS',
      value: metrics.currentObsession?.toUpperCase() || 'N/A',
      icon: '◉',
    },
    {
      label: 'STATUS',
      value: metrics.status?.toUpperCase() || 'UNKNOWN',
      icon: '●',
      color: statusColor,
    },
  ]

  // Double the items for seamless ticker loop
  const tickerItems = [...metricsItems, ...metricsItems]

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50"
      style={{
        background: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      {/* Scan line accent */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.3) 20%, rgba(0, 212, 255, 0.6) 50%, rgba(0, 212, 255, 0.3) 80%, transparent 100%)',
        }}
      />

      <div className="overflow-hidden py-2.5">
        <div
          ref={tickerRef}
          className="flex items-center gap-12 animate-ticker whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {tickerItems.map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              {/* Separator dot */}
              {i > 0 && (
                <span
                  className="text-[6px]"
                  style={{ color: 'var(--border)' }}
                >
                  ◆
                </span>
              )}

              <div className="flex items-center gap-2">
                {/* Icon with status glow */}
                <span
                  className="text-[10px]"
                  style={{
                    color: item.color || 'var(--accent)',
                    textShadow: item.color
                      ? `0 0 8px ${item.color}`
                      : '0 0 8px rgba(0, 212, 255, 0.5)',
                  }}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className="text-[10px] tracking-[0.15em] font-mono"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.label}
                </span>

                {/* Value */}
                <span
                  className="text-xs font-mono font-semibold tracking-wider"
                  style={{
                    color: item.color || 'var(--accent)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}