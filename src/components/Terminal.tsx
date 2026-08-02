import { useState, useEffect, useRef } from "react"
import { useTerminalEngine } from "../hooks/useTerminalEngine"
import { loadHistory, saveHistory } from "../lib/terminal/history"
import { keyClick } from "../lib/sound"
import { currentRank } from "../lib/commanderProfile"

interface TerminalProps {
  onOpenWindow?: (windowId: string) => void
}

/** Longest common prefix of a list of candidates (for partial tab-completion). */
function commonPrefix(items: string[]): string {
  let prefix = items[0] ?? ''
  for (const item of items) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}

function RankChip() {
  const [rank, setRank] = useState(currentRank())
  useEffect(() => {
    const update = () => setRank(currentRank())
    window.addEventListener('granof:xp', update)
    return () => window.removeEventListener('granof:xp', update)
  }, [])
  return <span className="rank-chip">{rank}</span>
}

export default function Terminal({ onOpenWindow }: TerminalProps) {
  const { output, run, print, completeInput } = useTerminalEngine({ onOpenWindow })
  const [input, setInput] = useState('')
  const [histPos, setHistPos] = useState(-1)
  const historyRef = useRef<string[]>(loadHistory())
  const draftRef = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight)
  }, [output])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = () => {
    const cmd = input.trim()
    if (!cmd) return
    historyRef.current = [...historyRef.current.filter(c => c !== cmd), cmd].slice(-50)
    saveHistory(historyRef.current)
    setHistPos(-1)
    run(cmd)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    keyClick()
    const history = historyRef.current
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      if (histPos === -1) draftRef.current = input
      const pos = histPos === -1 ? history.length - 1 : Math.max(0, histPos - 1)
      setHistPos(pos)
      setInput(history[pos])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histPos === -1) return
      const pos = histPos + 1
      if (pos >= history.length) {
        setHistPos(-1)
        setInput(draftRef.current)
      } else {
        setHistPos(pos)
        setInput(history[pos])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const candidates = completeInput(input)
      if (candidates.length === 0) return
      const tokens = input.split(/\s+/)
      const replaceLast = (value: string) =>
        setInput([...tokens.slice(0, -1), value].join(' ') + (candidates.length === 1 && !value.endsWith('/') ? ' ' : ''))
      if (candidates.length === 1) {
        replaceLast(candidates[0])
      } else {
        const prefix = commonPrefix(candidates)
        if (prefix && prefix !== tokens[tokens.length - 1]) replaceLast(prefix)
        else print([candidates.join('  ')])
      }
    }
  }

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="led green" />
        <span>COMMAND TERMINAL</span>
        <RankChip />
      </div>
      <div className="terminal-content">
        <div className="terminal-output" ref={outputRef}>
          {output.map((line, index) => (
            <div key={index} className="output-line">
              {line}
            </div>
          ))}
        </div>
        <form
          className="terminal-input-line"
          onSubmit={e => { e.preventDefault(); submit() }}
          onClick={() => inputRef.current?.focus()}
        >
          <span className="prompt">{'>'}</span>
          <div className="input-container">
            <input
              ref={inputRef}
              className="terminal-input-hidden"
              value={input}
              onChange={e => { setInput(e.target.value); setHistPos(-1) }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal command input"
            />
            <span className="terminal-text">{input}</span>
            <span className="cursor blinking">█</span>
          </div>
        </form>
      </div>
    </div>
  )
}
