import { useState, useEffect } from "react"

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
  const [activeCount, setActiveCount] = useState(0)
  const [nextId, setNextId] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setTargets(prev => {
        let newTargets = [...prev]
        
        // Randomly deactivate existing targets
        newTargets = newTargets.map(target => {
          if (target.isActive && Math.random() < 0.1) {
            return { ...target, isActive: false }
          }
          return target
        })

        // Randomly add new targets
        if (Math.random() < 0.3 && newTargets.filter(t => t.isActive).length < 5) {
          const newTarget: RadarTarget = {
            id: nextId,
            x: Math.random() * 0.8 + 0.1, // 10% to 90% of radar
            y: Math.random() * 0.8 + 0.1,
            size: Math.random() * 2 + 1,
            intensity: Math.random() * 0.5 + 0.5,
            isActive: true,
            type: ['hostile', 'friendly', 'unknown'][Math.floor(Math.random() * 3)] as 'hostile' | 'friendly' | 'unknown'
          }
          newTargets.push(newTarget)
          setNextId(prev => prev + 1)
        }

        // Remove old inactive targets after a delay
        newTargets = newTargets.filter(target => {
          if (!target.isActive) {
            // Keep inactive targets for a few seconds before removing
            return Math.random() > 0.05
          }
          return true
        })

        return newTargets
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [nextId])

  useEffect(() => {
    const activeTargets = targets.filter(t => t.isActive)
    setActiveCount(activeTargets.length)
  }, [targets])

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
        <div className="radar-circle">
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
    </div>
  )
}
