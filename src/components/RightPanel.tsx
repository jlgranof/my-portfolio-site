import { useState } from "react"
import Terminal from "./Terminal"
import WindowManager from "./WindowManager"

interface RightPanelProps {
  activeWindows: string[]
  onOpenWindow: (windowId: string) => void
  onCloseWindow: (windowId: string) => void
}

export default function RightPanel({ activeWindows, onOpenWindow, onCloseWindow }: RightPanelProps) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "MISSION CONTROL v1.0.0",
    "Type 'help' for available commands.",
    ""
  ])

  const handleTerminalCommand = (command: string) => {
    const newOutput = [...terminalOutput, `> ${command}`]
    
    switch (command.toLowerCase()) {
      case 'help':
        newOutput.push(
          "Available commands:",
          "  help     - Show this help message",
          "  about    - Open about window",
          "  projects - Open projects window", 
          "  resume   - Open resume window",
          "  contact  - Open contact window",
          "  clear    - Clear terminal",
          ""
        )
        break
      case 'about':
        onOpenWindow('about')
        newOutput.push("Opening about window...", "")
        break
      case 'projects':
        onOpenWindow('projects')
        newOutput.push("Opening projects window...", "")
        break
      case 'resume':
        onOpenWindow('resume')
        newOutput.push("Opening resume window...", "")
        break
      case 'contact':
        onOpenWindow('contact')
        newOutput.push("Opening contact window...", "")
        break
      case 'clear':
        setTerminalOutput([
          "MISSION CONTROL v1.0.0",
          "Type 'help' for available commands.",
          ""
        ])
        return
      default:
        newOutput.push(`Command not found: ${command}`, "Type 'help' for available commands.", "")
    }
    
    setTerminalOutput(newOutput)
  }

  return (
    <div className="right-panel">
      <Terminal 
        output={terminalOutput}
        onCommand={handleTerminalCommand}
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
