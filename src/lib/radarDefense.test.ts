import { describe, it, expect } from 'vitest'
import { createGame, step, shoot, CORE_RADIUS } from './radarDefense'

const noSpawnRand = () => 0.99 // > FRIENDLY_CHANCE → hostile when spawning

describe('radarDefense', () => {
  it('spawns hostiles over time and they descend', () => {
    const g = createGame()
    step(g, 1, noSpawnRand)
    expect(g.blips.length).toBe(1)
    const r0 = g.blips[0].r
    step(g, 0.5, noSpawnRand)
    expect(g.blips[0].r).toBeLessThan(r0)
  })

  it('hostile reaching the core costs a life; three ends the game', () => {
    const g = createGame()
    g.toSpawn = 0
    for (let i = 0; i < 3; i++) {
      g.blips.push({ id: 100 + i, angle: 0, r: CORE_RADIUS + 0.001, speed: 1, type: 'hostile' })
      step(g, 0.1, noSpawnRand)
    }
    expect(g.lives).toBe(0)
    expect(g.over).toBe(true)
  })

  it('shooting kills hostiles in blast radius and scores', () => {
    const g = createGame()
    g.toSpawn = 0
    g.blips.push({ id: 1, angle: 0, r: 0.5, speed: 0, type: 'hostile' })
    shoot(g, 0.5, 0)
    expect(g.blips.length).toBe(0)
    expect(g.score).toBe(10)
  })

  it('shooting a friendly costs a life', () => {
    const g = createGame()
    g.toSpawn = 0
    g.blips.push({ id: 1, angle: 0, r: 0.5, speed: 0, type: 'friendly' })
    shoot(g, 0.5, 0)
    expect(g.lives).toBe(2)
  })

  it('clearing a wave advances to the next', () => {
    const g = createGame()
    g.toSpawn = 0
    g.blips = []
    step(g, 0.1, noSpawnRand)
    expect(g.wave).toBe(2)
    expect(g.toSpawn).toBeGreaterThan(0)
  })
})
