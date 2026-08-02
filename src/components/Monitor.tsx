import { useState, useEffect } from "react"
import type { PropsWithChildren } from "react"
import { soundEnabled, setSoundEnabled } from "../lib/sound"

interface MonitorProps extends PropsWithChildren {
  className?: string;
}

export default function Monitor({ children, className }: MonitorProps) {
  const [sound, setSound] = useState(soundEnabled())
  useEffect(() => {
    const sync = () => setSound(soundEnabled())
    window.addEventListener('granof:sound', sync)
    return () => window.removeEventListener('granof:sound', sync)
  }, [])
  const toggleSound = () => setSoundEnabled(!sound)
  return (
    <div className={`monitor ${className || ''}`}>
      <div className="monitor-plaque">
        <div className="plaque-content">
          <div className="plaque-text">
            <span className="main-text">MISSION CONTROL</span>
            <span className="sub-text">CENTRAL COMMAND</span>
          </div>
        </div>
        <div className="plaque-screws">
          <div className="screw tl" />
          <div className="screw tr" />
        </div>
      </div>
      <div className="status" role="status" aria-label="System Status">
        <div className="led green" title="POWER" aria-label="Power Status: Online" />
        <div className="led red" title="COMMS LINK" aria-label="Communication Link: Active" />
        <button
          className="sound-toggle"
          onClick={toggleSound}
          title={sound ? 'Sound on' : 'Sound off'}
          aria-label={sound ? 'Disable sound' : 'Enable sound'}
        >
          {sound ? '\u266a' : '\u2205'}
        </button>
      </div>
      <div className="screws">
        <div className="screw tl" />
        <div className="screw tr" />
        <div className="screw bl" />
        <div className="screw br" />
      </div>
      {children}
    </div>
  )
}
