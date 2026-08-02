import { describe, it, expect } from 'vitest'
import { profile } from './profile'

describe('profile', () => {
  it('has identity fields', () => {
    expect(profile.identity.name).toBe('Jeff Granof')
    expect(profile.identity.rank.length).toBeGreaterThan(0)
  })

  it('never contains plausible-fake contact data', () => {
    expect(JSON.stringify(profile)).not.toContain('example.com')
    expect(JSON.stringify(profile)).not.toContain('234) 567')
  })

  it('marks unfinished content with visible placeholders, not fakes', () => {
    for (const project of profile.projects) {
      if (project.placeholder) {
        expect(project.name.startsWith('[')).toBe(true)
      }
    }
  })
})
