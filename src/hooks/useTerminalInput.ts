import { useState, useRef, useCallback } from 'react'

export function useTerminalInput() {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLDivElement>(null)

  const clearInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.textContent = ''
      setInput("")
    }
  }, [])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || ''
    setInput(text)
  }, [])

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return {
    input,
    inputRef,
    clearInput,
    handleInput,
    focusInput
  }
}
