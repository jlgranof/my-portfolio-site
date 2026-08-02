import { describe, it, expect, beforeEach } from 'vitest'
import {
  resetForTest, getData, addXp, award, trackCommand, trackWindowOpen,
  currentRank, nextRank,
} from './commanderProfile'

describe('commanderProfile', () => {
  beforeEach(() => resetForTest())

  it('ranks up on xp thresholds', () => {
    expect(currentRank()).toBe('CADET')
    addXp(50)
    expect(currentRank()).toBe('ENSIGN')
    expect(nextRank()?.[0]).toBe('LIEUTENANT')
    addXp(1000)
    expect(currentRank()).toBe('STATION CHIEF')
    expect(nextRank()).toBeNull()
  })

  it('first command grants First Contact; duplicates ignored', () => {
    trackCommand('help')
    expect(getData().achievements).toContain('first-contact')
    const xp = getData().xp
    trackCommand('help')
    expect(getData().xp).toBe(xp)
  })

  it('opening every window grants Explorer', () => {
    for (const w of ['about', 'projects', 'skills', 'resume', 'contact']) trackWindowOpen(w)
    expect(getData().achievements).not.toContain('explorer')
    trackWindowOpen('missionLog')
    expect(getData().achievements).toContain('explorer')
  })

  it('awards are one-shot and add xp', () => {
    expect(award('codebreaker')).toBe(true)
    const xp = getData().xp
    expect(award('codebreaker')).toBe(false)
    expect(getData().xp).toBe(xp)
  })
})
