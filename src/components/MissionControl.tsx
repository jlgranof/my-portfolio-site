import { useState, useEffect } from "react"
import LeftPanel from "./LeftPanel"
import RightPanel from "./RightPanel"
import type { TerminalEngine } from "../hooks/useTerminalEngine"

interface MissionControlProps {
  engine: TerminalEngine
  openWindowRef: React.MutableRefObject<((windowId: string) => void) | null>
}

export default function MissionControl({ engine, openWindowRef }: MissionControlProps) {
  const [activeWindows, setActiveWindows] = useState<string[]>(['terminal'])

  const openWindow = (windowId: string) => {
    setActiveWindows(prev => prev.includes(windowId) ? prev : [...prev, windowId])
  }

  useEffect(() => {
    openWindowRef.current = openWindow
    return () => { openWindowRef.current = null }
  }, [openWindowRef])

  const closeWindow = (windowId: string) => {
    if (windowId !== 'terminal') { // Terminal cannot be closed
      setActiveWindows(prev => prev.filter(id => id !== windowId))
    }
  }

  return (
    <div className="mission-control">
      <LeftPanel />
      <RightPanel
        engine={engine}
        activeWindows={activeWindows}
        onCloseWindow={closeWindow}
      />
    </div>
  )
}
