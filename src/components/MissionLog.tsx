import { useState, useEffect, useRef } from "react"
import { getRandomMessage, processMessage, SCRIPTED_ALERTS } from "../data/missionLogMessages"
import type { MessageType } from "../data/missionLogMessages"
import { alertTone } from "../lib/sound"

interface LogEntry {
  id: number
  timestamp: string
  message: string
  type: MessageType
}

export default function MissionLog() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const idRef = useRef(1)
  const logRef = useRef<HTMLDivElement>(null)

  const pushEntry = (message: string, type: MessageType) => {
    setLogEntries(prev => [
      ...prev,
      { id: idRef.current++, timestamp: new Date().toLocaleTimeString(), message, type },
    ].slice(-25))
  }

  // Ambient stream: routine telemetry every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = getRandomMessage()
      pushEntry(processMessage(msg), msg.type)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  // Scripted alerts: rare story beats with a screen-edge glow
  useEffect(() => {
    let glowTimeout: ReturnType<typeof setTimeout> | undefined
    const fire = () => {
      const message = SCRIPTED_ALERTS[Math.floor(Math.random() * SCRIPTED_ALERTS.length)]
      pushEntry(message, 'alert')
      alertTone()
      document.body.classList.add('alert-active')
      glowTimeout = setTimeout(() => document.body.classList.remove('alert-active'), 6000)
    }
    // First alert after 45-90s, then every 2-4 minutes
    let timer = setTimeout(function schedule() {
      fire()
      timer = setTimeout(schedule, 120_000 + Math.random() * 120_000)
    }, 45_000 + Math.random() * 45_000)
    return () => {
      clearTimeout(timer)
      clearTimeout(glowTimeout)
      document.body.classList.remove('alert-active')
    }
  }, [])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logEntries])

  const getTypeColor = (type: MessageType): string => {
    switch (type) {
      case 'info': return 'var(--muted)'
      case 'success': return 'var(--phosphor)'
      case 'system_warning': return 'var(--danger)'
      case 'mission_success': return 'var(--info-blue)'
      case 'mission_failed': return 'var(--mission-failed)'
      case 'alert': return 'var(--alert-red)'
      default: return 'var(--muted)'
    }
  }

  return (
    <div className="mission-log">
      <div className="window-header">
        <div className="led green" />
        <span>MISSION LOG</span>
      </div>
      <div className="mission-log-content">
        <div className="log-container" ref={logRef}>
          {logEntries.map(entry => (
            <div
              key={entry.id}
              className={`log-entry ${entry.type}`}
              style={{ borderLeftColor: getTypeColor(entry.type) }}
            >
              <span className="log-timestamp">[{entry.timestamp}]</span>
              <span className="log-message">{entry.message}</span>
              <div className="log-indicator" style={{ backgroundColor: getTypeColor(entry.type) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
