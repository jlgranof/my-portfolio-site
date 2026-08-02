import { useState, useCallback, useRef } from 'react'
import { execute, complete, BANNER } from '../lib/terminal/commands'
import type { TermState } from '../lib/terminal/commands'
import { HOME } from '../lib/terminal/filesystem'
import { loadDossierUnlocked, saveDossierUnlocked } from '../lib/terminal/history'

interface UseTerminalEngineProps {
  onOpenWindow?: (windowId: string) => void
}

export function useTerminalEngine({ onOpenWindow }: UseTerminalEngineProps) {
  const [output, setOutput] = useState<string[]>(BANNER)
  const stateRef = useRef<TermState>({ cwd: HOME, dossierUnlocked: loadDossierUnlocked() })

  const print = useCallback((lines: string[]) => {
    setOutput(prev => [...prev, ...lines])
  }, [])

  const run = useCallback((raw: string) => {
    const result = execute(raw, stateRef.current)
    if (result.cwd) stateRef.current = { ...stateRef.current, cwd: result.cwd }
    if (result.unlockDossier) {
      stateRef.current = { ...stateRef.current, dossierUnlocked: true }
      saveDossierUnlocked()
    }
    if (result.openWindow) onOpenWindow?.(result.openWindow)
    if (result.clear) setOutput(BANNER)
    else setOutput(prev => [...prev, `> ${raw}`, ...result.lines, ''])
  }, [onOpenWindow])

  const completeInput = useCallback((input: string) => complete(input, stateRef.current), [])

  return { output, run, print, completeInput }
}
