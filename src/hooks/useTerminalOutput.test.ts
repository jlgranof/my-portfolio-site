import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTerminalOutput } from './useTerminalOutput'

describe('useTerminalOutput', () => {
  it('echoes the command and reports unknown commands', () => {
    const { result } = renderHook(() => useTerminalOutput({}))
    act(() => result.current.handleCommand('warp9'))
    expect(result.current.output).toContain('> warp9')
    expect(result.current.output).toContain('Command not found: warp9')
  })

  it('opens windows through the callback', () => {
    const onOpenWindow = vi.fn()
    const { result } = renderHook(() => useTerminalOutput({ onOpenWindow }))
    act(() => result.current.handleCommand('projects'))
    expect(onOpenWindow).toHaveBeenCalledWith('projects')
  })

  it('clear resets to the banner', () => {
    const { result } = renderHook(() => useTerminalOutput({}))
    act(() => result.current.handleCommand('help'))
    act(() => result.current.handleCommand('clear'))
    expect(result.current.output[0]).toBe('GRANOF COMPUTER v4.12.16')
    expect(result.current.output).not.toContain('> help')
  })

  it('handleCommand identity is stable across outputs', () => {
    const { result } = renderHook(() => useTerminalOutput({}))
    const first = result.current.handleCommand
    act(() => result.current.handleCommand('help'))
    expect(result.current.handleCommand).toBe(first)
  })
})
