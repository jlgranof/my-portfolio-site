import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import RadarWindow from './RadarWindow'

describe('RadarWindow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('spawns targets over time using a single stable interval', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2) // < 0.3 → always spawn
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    render(<RadarWindow />)
    act(() => {
      vi.advanceTimersByTime(10_000) // 5 ticks
    })
    // interval registered exactly once (twice under StrictMode double-mount is
    // not at play here since render() mounts once)
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    // active count reflects spawned targets (cap is 5)
    const count = Number(screen.getByText('ACTIVE TARGETS:').nextElementSibling?.textContent)
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(5)
  })
})
