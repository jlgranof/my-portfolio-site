import { useState, useEffect, useRef } from "react"
import ResizableWindow from "./ResizableWindow"
import { WINDOW_CONFIGS } from "../config/windowConfigs"
import type { WindowPosition } from "../config/windowConfigs"
import { cascadePosition } from "../lib/windowPlacement"

interface WindowManagerProps {
  activeWindows: string[]
  onCloseWindow: (windowId: string) => void
}

export default function WindowManager({ activeWindows, onCloseWindow }: WindowManagerProps) {
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>({})
  const [windowZIndexes, setWindowZIndexes] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const zCounterRef = useRef(100)
  const openCounterRef = useRef(0)
  const prevActiveRef = useRef<string[]>([])

  const updateWindowPosition = (windowId: string, position: Partial<WindowPosition>) => {
    setWindowPositions(prev => ({
      ...prev,
      [windowId]: { ...prev[windowId], ...position },
    }))
  }

  const bringWindowToFront = (windowId: string) => {
    zCounterRef.current += 1
    const z = zCounterRef.current
    setWindowZIndexes(prev => ({ ...prev, [windowId]: z }))
  }

  useEffect(() => {
    const newWindows = activeWindows.filter(
      id => id !== 'terminal' && !prevActiveRef.current.includes(id),
    )
    prevActiveRef.current = activeWindows

    newWindows.forEach(windowId => {
      const config = WINDOW_CONFIGS[windowId]
      if (!config) return
      const { width, height } = config.defaultPosition
      const pos = cascadePosition(openCounterRef.current, { width, height })
      openCounterRef.current += 1
      setWindowPositions(prev => ({ ...prev, [windowId]: pos }))
      bringWindowToFront(windowId)
    })
  }, [activeWindows])

  const renderWindow = (windowId: string) => {
    const config = WINDOW_CONFIGS[windowId]
    const position = windowPositions[windowId]
    if (!config || !position) return null

    const WindowComponent = config.component

    return (
      <ResizableWindow
        key={windowId}
        title={config.title}
        position={position}
        zIndex={windowZIndexes[windowId] ?? config.defaultZIndex}
        containerRef={containerRef}
        onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
        onClose={() => onCloseWindow(windowId)}
        onClick={() => bringWindowToFront(windowId)}
      >
        <WindowComponent />
      </ResizableWindow>
    )
  }

  return (
    <div className="window-manager" ref={containerRef}>
      {activeWindows.filter(id => id !== 'terminal').map(renderWindow)}
    </div>
  )
}
