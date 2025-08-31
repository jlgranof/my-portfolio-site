import { useState } from "react"
import LeftPanel from "./LeftPanel"
import RightPanel from "./RightPanel"

export default function MissionControl() {
  const [activeWindows, setActiveWindows] = useState<string[]>(['terminal'])

  const openWindow = (windowId: string) => {
    if (!activeWindows.includes(windowId)) {
      setActiveWindows(prev => [...prev, windowId])
    }
  }

  const closeWindow = (windowId: string) => {
    if (windowId !== 'terminal') { // Terminal cannot be closed
      setActiveWindows(prev => prev.filter(id => id !== windowId))
    }
  }

  return (
    <div className="mission-control">
      <LeftPanel />
      <RightPanel 
        activeWindows={activeWindows}
        onOpenWindow={openWindow}
        onCloseWindow={closeWindow}
      />
    </div>
  )
}
