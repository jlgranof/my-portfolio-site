import { useTerminalOutput } from './useTerminalOutput'
import { useTerminalInput } from './useTerminalInput'
import { useTerminalCursor } from './useTerminalCursor'
import { useTerminalScroll } from './useTerminalScroll'

interface UseTerminalProps {
  onOpenWindow?: (windowId: string) => void
}

export function useTerminal({ onOpenWindow }: UseTerminalProps) {
  const output = useTerminalOutput({ onOpenWindow })
  const input = useTerminalInput()
  const cursorVisible = useTerminalCursor()
  const scroll = useTerminalScroll()

  return {
    // Output management
    output: output.output,
    handleCommand: output.handleCommand,
    
    // Input management
    input: input.input,
    inputRef: input.inputRef,
    clearInput: input.clearInput,
    handleInput: input.handleInput,
    focusInput: input.focusInput,
    
    // Cursor
    cursorVisible,
    
    // Scrolling
    outputRef: scroll.outputRef,
    scrollToBottom: scroll.scrollToBottom
  }
}
