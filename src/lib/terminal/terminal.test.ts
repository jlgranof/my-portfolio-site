import { describe, it, expect } from 'vitest'
import { caesar, xorEncode, tryDecrypt } from './cipher'
import { resolvePath, getNode, listDir, completePath, HOME } from './filesystem'
import { execute, complete } from './commands'
import type { TermState } from './commands'
import { FS_ROOT } from '../../data/fsTree'

const state = (over: Partial<TermState> = {}): TermState => ({
  cwd: HOME,
  dossierUnlocked: false,
  ...over,
})

describe('cipher', () => {
  it('caesar round-trips', () => {
    expect(caesar(caesar('GRANOF//Hello', 3), -3)).toBe('GRANOF//Hello')
  })
  it('tryDecrypt accepts the right key and rejects wrong ones', () => {
    const c = caesar('GRANOF//SECRET', 5)
    expect(tryDecrypt(c, '5')).toBe('GRANOF//SECRET')
    expect(tryDecrypt(c, '4')).toBeNull()
    const x = xorEncode('GRANOF//DEEP', 'KEY')
    expect(tryDecrypt(x, 'key')).toBe('GRANOF//DEEP')
    expect(tryDecrypt(x, 'wrong')).toBeNull()
  })
})

describe('filesystem', () => {
  it('resolves relative, absolute, and dotted paths', () => {
    expect(resolvePath('/home/commander', '..')).toBe('/home')
    expect(resolvePath('/home/commander', '/classified')).toBe('/classified')
    expect(resolvePath('/', 'var/log')).toBe('/var/log')
  })
  it('walks the real tree', () => {
    const node = getNode(FS_ROOT, '/classified/dossier.enc')
    expect(node?.type).toBe('file')
    const dir = getNode(FS_ROOT, '/classified')
    expect(dir && dir.type === 'dir' && listDir(dir).join(' ')).toContain('[ENCRYPTED]')
  })
  it('completes paths', () => {
    expect(completePath(FS_ROOT, '/', 'cl')).toEqual(['classified/'])
    expect(completePath(FS_ROOT, '/classified', 'al')).toEqual(['alpha.enc'])
  })
})

describe('commands', () => {
  it('opens windows, including missionlog (lowercase) → camelCase id', () => {
    expect(execute('projects', state()).openWindow).toBe('projects')
    expect(execute('missionlog', state()).openWindow).toBe('missionLog')
    expect(execute('open missionlog', state()).openWindow).toBe('missionLog')
  })
  it('suggests the closest command', () => {
    expect(execute('projetcs', state()).lines.join(' ')).toContain("Did you mean 'projects'?")
  })
  it('navigates and reads files', () => {
    expect(execute('pwd', state()).lines).toEqual([HOME])
    expect(execute('cd /var/log', state()).cwd).toBe('/var/log')
    expect(execute('cat system.log', state({ cwd: '/var/log' })).lines.join('\n')).toContain('ROTATION-3')
    expect(execute('cat nope.txt', state()).lines[0]).toContain('no such file')
  })
  it('runs the full puzzle: alpha with 3, dossier with leaked key', () => {
    const s = state({ cwd: '/classified' })
    const alpha = execute('decrypt alpha.enc 3', s)
    expect(alpha.lines.join('\n')).toContain('REDSHIFT')
    const wrong = execute('decrypt dossier.enc BLUESHIFT', s)
    expect(wrong.lines.join(' ')).toContain('FAILED')
    const dossier = execute('decrypt dossier.enc REDSHIFT', s)
    expect(dossier.unlockDossier).toBe(true)
    expect(dossier.lines.join(' ')).toContain('dossier')
  })
  it('gates the dossier window on the unlock', () => {
    expect(execute('dossier', state()).openWindow).toBeUndefined()
    expect(execute('dossier', state({ dossierUnlocked: true })).openWindow).toBe('dossier')
  })
  it('completes commands and file paths', () => {
    expect(complete('pr', state())).toEqual(['projects'])
    expect(complete('cat /classified/do', state())).toEqual(['/classified/dossier.enc'])
  })
  it('help hides easter eggs and locked windows', () => {
    const lines = execute('help', state()).lines.join('\n')
    expect(lines).not.toContain('sudo')
    expect(lines).not.toContain('dossier')
    expect(lines).toContain('decrypt')
  })
})
