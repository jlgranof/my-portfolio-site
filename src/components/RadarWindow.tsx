import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import RadarDefense from "./RadarDefense"

interface RadarTarget {
  id: number
  x: number
  y: number
  size: number
  intensity: number
  isActive: boolean
  type: 'hostile' | 'friendly' | 'unknown'
}

export default function RadarWindow() {
  const [targets, setTargets] = useState<RadarTarget[]>([])
  const [defending, setDefending] = useState(false)
  const idRef = useRef(1)
  const tapsRef = useRef<number[]>([])

  // `defend` command in the terminal fires this event
  useEffect(() => {
    const start = () => setDefending(true)
    window.addEventListener('granof:defend', start)
    return () => window.removeEventListener('granof:defend', start)
  }, [])

  // Secret trigger: tap the radar 3 times within 1.5s
  const handleRadarTap = () => {
    const now = Date.now()
    tapsRef.current = [...tapsRef.current.filter(t => now - t < 1500), now]
    if (tapsRef.current.length >= 3) {
      tapsRef.current = []
      setDefending(true)
    }
  }

  const targetsRef = useRef<RadarTarget[]>([])

  useEffect(() => {
    // All randomness happens outside setState so the updater stays pure
    const interval = setInterval(() => {
      let next = targetsRef.current.map(target =>
        target.isActive && Math.random() < 0.1
          ? { ...target, isActive: false }
          : target
      )

      if (Math.random() < 0.3 && next.filter(t => t.isActive).length < 5) {
        next.push({
          id: idRef.current++,
          x: Math.random() * 0.8 + 0.1,
          y: Math.random() * 0.8 + 0.1,
          size: Math.random() * 2 + 1,
          intensity: Math.random() * 0.5 + 0.5,
          isActive: true,
          type: ['hostile', 'friendly', 'unknown'][Math.floor(Math.random() * 3)] as RadarTarget['type'],
        })
      }

      next = next.filter(target => target.isActive || Math.random() > 0.05)
      targetsRef.current = next
      setTargets(next)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const activeCount = targets.filter(t => t.isActive).length

  const getTargetColor = (type: string) => {
    switch (type) {
      case 'hostile': return '#ff6b6b'
      case 'friendly': return '#6cffda'
      case 'unknown': return '#ffcc55'
      default: return '#6cffda'
    }
  }

  return (
    <div className="radar-window">
      <div className="window-header">
        <div className="led red" />
        <span>RADAR SCAN</span>
      </div>
      <div className="radar-display">
        <div className="radar-circle" onPointerDown={handleRadarTap}>
          <div className="radar-sweep" />
          <div className="radar-grid">
            <div className="grid-line horizontal" />
            <div className="grid-line vertical" />
            <div className="grid-circle circle-1" />
            <div className="grid-circle circle-2" />
            <div className="grid-circle circle-3" />
          </div>
          <div className="radar-targets">
            {targets.map(target => (
              <div
                key={target.id}
                className={`radar-target ${target.isActive ? 'active' : 'inactive'} ${target.type}`}
                style={{
                  left: `${target.x * 100}%`,
                  top: `${target.y * 100}%`,
                  width: `${target.size * 4}px`,
                  height: `${target.size * 4}px`,
                  backgroundColor: getTargetColor(target.type),
                  opacity: target.intensity,
                  animationDelay: `${target.id * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
        <div className="radar-stats">
          <div className="stat">
            <span>ACTIVE TARGETS:</span>
            <span className="value">{activeCount}</span>
          </div>
          <div className="stat">
            <span>TOTAL DETECTED:</span>
            <span className="value">{targets.length}</span>
          </div>
          <div className="stat">
            <span>SCAN RANGE:</span>
            <span className="value">100%</span>
          </div>
          <div className="target-types">
            <div className="target-type">
              <span className="indicator hostile" />
              <span>HOSTILE</span>
            </div>
            <div className="target-type">
              <span className="indicator friendly" />
              <span>FRIENDLY</span>
            </div>
            <div className="target-type">
              <span className="indicator unknown" />
              <span>UNKNOWN</span>
            </div>
          </div>
        </div>
      </div>
      {defending && createPortal(
        <div className="defense-overlay" role="dialog" aria-label="Radar defense">
          <div className="defense-shell">
            <div className="defense-title">RADAR DEFENSE — STATION UNDER ATTACK</div>
            <RadarDefense onExit={() => setDefending(false)} />
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
