import { describe, it, expect } from 'vitest'
import { COMMAND_CONFIGS, getCommand } from './commandConfigs'

describe('commandConfigs', () => {
  it('resolves the missionlog command and targets the missionLog window', () => {
    const config = getCommand('missionlog')
    expect(config).toBeDefined()
    expect(config?.target).toBe('missionLog')
  })

  it('keeps every registry key lowercase so getCommand lookups can never miss', () => {
    for (const key of Object.keys(COMMAND_CONFIGS)) {
      expect(key).toBe(key.toLowerCase())
    }
  })
})
