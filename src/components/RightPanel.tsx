import Terminal from "./Terminal"
import WindowManager from "./WindowManager"
import type { TerminalEngine } from "../hooks/useTerminalEngine"

interface RightPanelProps {
  engine: TerminalEngine
  activeWindows: string[]
  onCloseWindow: (windowId: string) => void
}

export default function RightPanel({ engine, activeWindows, onCloseWindow }: RightPanelProps) {
  return (
    <div className="right-panel">
      <Terminal engine={engine} />
      <div className="window-container">
        <WindowManager
          activeWindows={activeWindows}
          onCloseWindow={onCloseWindow}
        />
      </div>
    </div>
  )
}
