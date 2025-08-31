import Terminal from "./Terminal"
import WindowManager from "./WindowManager"

interface RightPanelProps {
  activeWindows: string[]
  onOpenWindow: (windowId: string) => void
  onCloseWindow: (windowId: string) => void
}

export default function RightPanel({ activeWindows, onOpenWindow, onCloseWindow }: RightPanelProps) {
  return (
    <div className="right-panel">
      <Terminal 
        onOpenWindow={onOpenWindow}
      />
      <div className="window-container">
        <WindowManager 
          activeWindows={activeWindows}
          onCloseWindow={onCloseWindow}
        />
      </div>
    </div>
  )
}
