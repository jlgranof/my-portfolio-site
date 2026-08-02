import { describe, it, expect } from 'vitest'
import { cascadePosition } from './windowPlacement'

describe('cascadePosition', () => {
  const size = { width: 400, height: 300 }

  it('offsets each successive window by a fixed step', () => {
    expect(cascadePosition(0, size)).toEqual({ x: 24, y: 24, width: 400, height: 300 })
    expect(cascadePosition(1, size)).toEqual({ x: 56, y: 56, width: 400, height: 300 })
    expect(cascadePosition(3, size)).toEqual({ x: 120, y: 120, width: 400, height: 300 })
  })

  it('wraps back to the origin after 8 windows', () => {
    expect(cascadePosition(8, size)).toEqual(cascadePosition(0, size))
  })

  it('preserves the requested size', () => {
    expect(cascadePosition(2, { width: 500, height: 400 }).width).toBe(500)
  })
})
