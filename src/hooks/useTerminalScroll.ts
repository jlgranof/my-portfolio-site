import { useRef } from 'react'

export function useTerminalScroll() {
  const outputRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }

  return {
    outputRef,
    scrollToBottom
  }
}
