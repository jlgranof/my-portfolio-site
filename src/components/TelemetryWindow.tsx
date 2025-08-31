import { useState, useEffect, useRef } from "react"

interface DataStream {
  id: number
  timestamp: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: number
}

export default function TelemetryWindow() {
  const [dataStreams, setDataStreams] = useState<DataStream[]>([])
  const [nextStreamId, setNextStreamId] = useState(1)
  const streamRef = useRef<HTMLDivElement>(null)

  const streamMessages = [
    { message: "SIGNAL STRENGTH: 87.3%", type: 'info' as const },
    { message: "POWER CORE: STABLE", type: 'success' as const },
    { message: "COMM LINK: ACTIVE", type: 'info' as const },
    { message: "ENVIRONMENTAL: NOMINAL", type: 'success' as const },
    { message: "DATA PACKET RECEIVED", type: 'info' as const },
    { message: "SYSTEM SCAN COMPLETE", type: 'success' as const },
    { message: "MEMORY USAGE: 68.2%", type: 'warning' as const },
    { message: "NETWORK LATENCY: 12ms", type: 'info' as const },
    { message: "SECURITY PROTOCOL: ACTIVE", type: 'success' as const },
    { message: "BACKUP SYSTEMS: ONLINE", type: 'info' as const }
  ]

  useEffect(() => {
    // Add new data streams
    const streamInterval = setInterval(() => {
      const randomMessage = streamMessages[Math.floor(Math.random() * streamMessages.length)]
      const newStream: DataStream = {
        id: nextStreamId,
        timestamp: new Date().toLocaleTimeString(),
        message: randomMessage.message,
        type: randomMessage.type,
        priority: Math.floor(Math.random() * 3) + 1
      }
      
      setDataStreams(prev => {
        const newStreams = [...prev, newStream]
        // Keep only last 20 streams
        return newStreams.slice(-20)
      })
      setNextStreamId(prev => prev + 1)
    }, 2000)

    return () => clearInterval(streamInterval)
  }, [nextStreamId])

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight
    }
  }, [dataStreams])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#6cffda'
      case 'warning': return '#ffcc55'
      case 'error': return '#ff6b6b'
      case 'info': return '#9ad5c6'
      default: return '#6cffda'
    }
  }

  return (
    <div className="telemetry-window">
      <div className="window-header">
        <div className="led green" />
        <span>LIVE DATA STREAM</span>
      </div>
      <div className="telemetry-content">
        <div className="stream-container" ref={streamRef}>
          {dataStreams.map(stream => (
            <div 
              key={stream.id}
              className={`stream-item ${stream.type}`}
              style={{ 
                borderLeftColor: getTypeColor(stream.type),
                animationDelay: `${stream.id * 0.1}s`
              }}
            >
              <span className="stream-timestamp">[{stream.timestamp}]</span>
              <span className="stream-message">{stream.message}</span>
              <div className="stream-indicator" style={{ backgroundColor: getTypeColor(stream.type) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
