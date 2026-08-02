import { useState, useCallback, useRef } from 'react'
import { execute, complete, BANNER } from '../lib/terminal/commands'
import type { TermState } from '../lib/terminal/commands'
import { HOME } from '../lib/terminal/filesystem'
import { loadDossierUnlocked, saveDossierUnlocked } from '../lib/terminal/history'
import { applyTheme } from '../lib/theme'
import { setSoundEnabled, confirmBeep, errorBeep } from '../lib/sound'
import { trackCommand, trackWindowOpen, award, addXp } from '../lib/commanderProfile'

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
    const commandName = raw.trim().split(/\s+/)[0]?.toLowerCase()
    if (commandName && !result.lines[0]?.startsWith('Command not found')) trackCommand(commandName)
    if (result.cwd) stateRef.current = { ...stateRef.current, cwd: result.cwd }
    if (result.unlockDossier) {
      stateRef.current = { ...stateRef.current, dossierUnlocked: true }
      saveDossierUnlocked()
    }
    if (result.theme) {
      applyTheme(result.theme)
      award('night-shift')
    }
    if (result.sound !== undefined) setSoundEnabled(result.sound)
    if (result.openWindow) {
      onOpenWindow?.(result.openWindow)
      trackWindowOpen(result.openWindow)
    }
    if (result.lines[0] === 'DECRYPTION SUCCESSFUL:') {
      award('codebreaker')
      addXp(10)
    }
    if (result.unlockDossier) award('deep-clearance')
    if (result.startDefense) {
      try { window.dispatchEvent(new CustomEvent('granof:defend')) } catch { /* non-DOM */ }
    }
    if (result.lines[0]?.startsWith('Command not found')) errorBeep()
    else if (result.openWindow || result.unlockDossier) confirmBeep()
    if (result.clear) setOutput(BANNER)
    else setOutput(prev => [...prev, `> ${raw}`, ...result.lines, ''])
  }, [onOpenWindow])

  const completeInput = useCallback((input: string) => complete(input, stateRef.current), [])

  return { output, run, print, completeInput }
}
