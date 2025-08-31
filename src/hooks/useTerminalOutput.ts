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

  const clearOutput = useCallback(() => {
    setOutput(DEFAULT_OUTPUT)
  }, [])

  const handleCommand = useCallback((command: string) => {
    const newOutput = [...output, `> ${command}`]
    const commandConfig = getCommand(command)
    
    if (!commandConfig) {
      newOutput.push(`Command not found: ${command}`, "Type 'help' for available commands.", "")
      setOutput(newOutput)
      return
    }

    switch (commandConfig.action) {
      case 'help':
        const commands = getAvailableCommands()
        newOutput.push(
          "Available commands:",
          ...commands.map(cmd => `  ${cmd.name.padEnd(10)} - ${cmd.description}`),
          ""
        )
        break
        
      case 'openWindow':
        if (commandConfig.target && onOpenWindow) {
          onOpenWindow(commandConfig.target)
          newOutput.push(`Opening ${commandConfig.target} window...`, "")
        }
        break
        
      case 'clear':
        clearOutput()
        return // Don't update output, clearOutput handles it
        
      case 'custom':
        if (commandConfig.customHandler) {
          commandConfig.customHandler()
          newOutput.push(`Executing ${command}...`, "")
        }
        break
    }
    
    setOutput(newOutput)
  }, [output, onOpenWindow, clearOutput])

  return {
    output,
    handleCommand
  }
}
