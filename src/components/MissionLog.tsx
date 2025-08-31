import { useState, useEffect, useRef } from "react"
import { getRandomMessage, processMessage } from "../data/missionLogMessages"
import type { MessageType } from "../data/missionLogMessages"

interface LogEntry {
  id: number
  timestamp: string
  message: string
  type: MessageType
}

export default function MissionLog() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [nextEntryId, setNextEntryId] = useState(1)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add new log entries
    const logInterval = setInterval(() => {
      const randomMessage = getRandomMessage()
      const processedMessage = processMessage(randomMessage)
      
      const newEntry: LogEntry = {
        id: nextEntryId,
        timestamp: new Date().toLocaleTimeString(),
        message: processedMessage,
        type: randomMessage.type
      }
      
      setLogEntries(prev => {
        const newEntries = [...prev, newEntry]
        // Keep only last 25 entries
        return newEntries.slice(-25)
      })
      setNextEntryId(prev => prev + 1)
    }, 1500)

    return () => clearInterval(logInterval)
  }, [nextEntryId])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logEntries])

  const getTypeColor = (type: MessageType): string => {
    switch (type) {
      case 'info': return '#9ad5c6' // Normal color
      case 'success': return '#6cffda' // Green
      case 'system_warning': return '#ff6b6b' // Red
      case 'mission_success': return '#4dabf7' // Blue
      case 'mission_failed': return '#ae3ec9' // Purple
      case 'alert': return '#ff0000' // Bright red for flashing
      default: return '#9ad5c6'
    }
  }

  const getTypeClass = (type: MessageType): string => {
    return `log-entry ${type}`
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
              className={getTypeClass(entry.type)}
              style={{ 
                borderLeftColor: getTypeColor(entry.type),
                animationDelay: `${entry.id * 0.1}s`
              }}
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
