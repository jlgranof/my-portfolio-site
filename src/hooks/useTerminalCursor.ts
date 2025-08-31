import { useState, useEffect } from 'react'

export function useTerminalCursor() {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return cursorVisible
}
