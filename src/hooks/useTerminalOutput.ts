import { useState, useCallback } from 'react'
import { getCommand, getAvailableCommands } from '../config/commandConfigs'

interface UseTerminalOutputProps {
  onOpenWindow?: (windowId: string) => void
}

const DEFAULT_OUTPUT = [
  "GRANOF COMPUTER v4.12.16",
  "Type 'help' for available commands.",
  ""
]

export function useTerminalOutput({ onOpenWindow }: UseTerminalOutputProps) {
  const [output, setOutput] = useState<string[]>(DEFAULT_OUTPUT)

  const handleCommand = useCallback((command: string) => {
    const commandConfig = getCommand(command)

    if (commandConfig?.action === 'clear') {
      setOutput(DEFAULT_OUTPUT)
      return
    }

    const lines: string[] = []
    if (!commandConfig) {
      lines.push(`Command not found: ${command}`, "Type 'help' for available commands.", "")
    } else if (commandConfig.action === 'help') {
      const commands = getAvailableCommands()
      lines.push(
        "Available commands:",
        ...commands.map(cmd => `  ${cmd.name.padEnd(10)} - ${cmd.description}`),
        ""
      )
    } else if (commandConfig.action === 'openWindow') {
      if (commandConfig.target && onOpenWindow) {
        onOpenWindow(commandConfig.target)
        lines.push(`Opening ${commandConfig.target} window...`, "")
      }
    } else if (commandConfig.action === 'custom') {
      if (commandConfig.customHandler) {
        commandConfig.customHandler()
        lines.push(`Executing ${command}...`, "")
      }
    }

    setOutput(prev => [...prev, `> ${command}`, ...lines])
  }, [onOpenWindow])

  return { output, handleCommand }
}
