import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  output: string[]
  onCommand: (command: string) => void
}

export default function Terminal({ output, onCommand }: TerminalProps) {
  const [input, setInput] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.textContent = ''
      setInput("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onCommand(input.trim())
      clearInput()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || ''
    setInput(text)
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
