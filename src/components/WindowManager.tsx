import { useState, useEffect } from "react"
import ResizableWindow from "./ResizableWindow"
import { WINDOW_CONFIGS } from "../config/windowConfigs"
import type { WindowPosition } from "../config/windowConfigs"

interface WindowManagerProps {
  activeWindows: string[]
  onCloseWindow: (windowId: string) => void
}

export default function WindowManager({ activeWindows, onCloseWindow }: WindowManagerProps) {
  // Initialize window positions from config
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>(() => {
    const positions: Record<string, WindowPosition> = {}
    Object.values(WINDOW_CONFIGS).forEach(config => {
      positions[config.id] = config.defaultPosition
    })
    return positions
  })

  // Initialize window z-indexes from config
  const [windowZIndexes, setWindowZIndexes] = useState<Record<string, number>>(() => {
    const zIndexes: Record<string, number> = {}
    Object.values(WINDOW_CONFIGS).forEach(config => {
      zIndexes[config.id] = config.defaultZIndex
    })
    return zIndexes
  })

  const [nextZIndex, setNextZIndex] = useState(Math.max(...Object.values(WINDOW_CONFIGS).map(c => c.defaultZIndex)) + 1)
  const [previousActiveWindows, setPreviousActiveWindows] = useState<string[]>([])

  const updateWindowPosition = (windowId: string, position: Partial<WindowPosition>) => {
    setWindowPositions(prev => ({
      ...prev,
      [windowId]: { ...prev[windowId], ...position }
    }))
  }

  const bringWindowToFront = (windowId: string) => {
    setWindowZIndexes(prev => ({
      ...prev,
      [windowId]: nextZIndex
    }))
    setNextZIndex(prev => prev + 1)
  }

  // Effect to bring new windows to front when they're opened
  useEffect(() => {
    // Find windows that are newly active (not in previousActiveWindows)
    const newWindows = activeWindows.filter(windowId => 
      windowId !== 'terminal' && !previousActiveWindows.includes(windowId)
    )
    
    // Bring new windows to front
    newWindows.forEach(windowId => {
      bringWindowToFront(windowId)
    })
    
    // Update previous active windows
    setPreviousActiveWindows(activeWindows)
  }, [activeWindows, previousActiveWindows])

  const renderWindow = (windowId: string) => {
    const config = WINDOW_CONFIGS[windowId]
    if (!config) return null

    const position = windowPositions[windowId]
    const zIndex = windowZIndexes[windowId]
    const WindowComponent = config.component

    return (
      <ResizableWindow
        key={windowId}
        title={config.title}
        position={position}
        zIndex={zIndex}
        onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
        onClose={() => onCloseWindow(windowId)}
        onClick={() => bringWindowToFront(windowId)}
      >
        <WindowComponent />
      </ResizableWindow>
    )
  }

  return (
    <div className="window-manager">
      {activeWindows
        .filter(id => id !== 'terminal')
        .map(renderWindow)
      }
    </div>
  )
}
