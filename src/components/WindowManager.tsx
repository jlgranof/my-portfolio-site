import { useState, useEffect } from "react"
import ResizableWindow from "./ResizableWindow"
import AboutWindow from "./windows/AboutWindow"
import ProjectsWindow from "./windows/ProjectsWindow"
import ResumeWindow from "./windows/ResumeWindow"
import ContactWindow from "./windows/ContactWindow"

interface WindowManagerProps {
  activeWindows: string[]
  onCloseWindow: (windowId: string) => void
}

interface WindowPosition {
  x: number
  y: number
  width: number
  height: number
}

export default function WindowManager({ activeWindows, onCloseWindow }: WindowManagerProps) {
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>({
    about: { x: 0, y: 0, width: 400, height: 300 },
    projects: { x: 0, y: 0, width: 500, height: 300 },
    resume: { x: 0, y: 0, width: 450, height: 300 },
    contact: { x: 0, y: 0, width: 350, height: 300 }
  })

  const [windowZIndexes, setWindowZIndexes] = useState<Record<string, number>>({
    about: 100,
    projects: 101,
    resume: 102,
    contact: 103
  })

  const [nextZIndex, setNextZIndex] = useState(104)
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
    const position = windowPositions[windowId]
    const zIndex = windowZIndexes[windowId]
    
    switch (windowId) {
      case 'about':
        return (
          <ResizableWindow
            key={windowId}
            title="About"
            position={position}
            zIndex={zIndex}
            onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
            onClose={() => onCloseWindow(windowId)}
            onClick={() => bringWindowToFront(windowId)}
          >
            <AboutWindow />
          </ResizableWindow>
        )
      case 'projects':
        return (
          <ResizableWindow
            key={windowId}
            title="Projects"
            position={position}
            zIndex={zIndex}
            onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
            onClose={() => onCloseWindow(windowId)}
            onClick={() => bringWindowToFront(windowId)}
          >
            <ProjectsWindow />
          </ResizableWindow>
        )
      case 'resume':
        return (
          <ResizableWindow
            key={windowId}
            title="Resume"
            position={position}
            zIndex={zIndex}
            onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
            onClose={() => onCloseWindow(windowId)}
            onClick={() => bringWindowToFront(windowId)}
          >
            <ResumeWindow />
          </ResizableWindow>
        )
      case 'contact':
        return (
          <ResizableWindow
            key={windowId}
            title="Contact"
            position={position}
            zIndex={zIndex}
            onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
            onClose={() => onCloseWindow(windowId)}
            onClick={() => bringWindowToFront(windowId)}
          >
            <ContactWindow />
          </ResizableWindow>
        )
      default:
        return null
    }
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
