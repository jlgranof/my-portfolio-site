import { useEffect } from "react"
import { useTerminal } from "../hooks/useTerminal"

interface TerminalProps {
  onOpenWindow?: (windowId: string) => void
}

export default function Terminal({ onOpenWindow }: TerminalProps) {
  const {
    output,
    handleCommand,
    input,
    inputRef,
    clearInput,
    handleInput,
    focusInput,
    cursorVisible,
    outputRef,
    scrollToBottom
  } = useTerminal({ onOpenWindow })

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    scrollToBottom()
  }, [output, scrollToBottom])

  // Auto-focus the input when component mounts
  useEffect(() => {
    focusInput()
  }, [focusInput])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input.trim())
      clearInput()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="led green" />
        <span>COMMAND TERMINAL</span>
      </div>
      <div className="terminal-content">
        <div className="terminal-output" ref={outputRef}>
          {output.map((line, index) => (
            <div key={index} className="output-line">
              {line}
            </div>
          ))}
        </div>
        <form className="terminal-input-line" onSubmit={handleSubmit}>
          <span className="prompt">{'>'}</span>
          <div className="input-container">
            <div
              ref={inputRef}
              contentEditable
              className="terminal-input"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              suppressContentEditableWarning={true}
              autoFocus
            />
            <span 
              className={`cursor ${cursorVisible ? 'visible' : ''}`}
              style={{ left: `${input.length * 7.2}px` }}
            >█</span>
          </div>
        </form>
      </div>
    </div>
  )
}
