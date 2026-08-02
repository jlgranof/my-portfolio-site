// Pure command execution core: takes raw input + a state snapshot, returns
// output lines and effects for the engine hook to apply. No React in here.

import { FS_ROOT } from '../../data/fsTree'
import {
  HOME,
  resolvePath,
  getNode,
  listDir,
  completePath,
} from './filesystem'
import { tryDecrypt } from './cipher'

export interface TermState {
  cwd: string
  dossierUnlocked: boolean
}

export interface ExecResult {
  lines: string[]
  clear?: boolean
  cwd?: string
  openWindow?: string
  unlockDossier?: boolean
}

export const BANNER = [
  'GRANOF COMPUTER v4.12.16',
  "Type 'help' for available commands.",
  '',
]

interface Command {
  name: string
  description: string
  usage: string
  category: 'windows' | 'files' | 'system'
  hidden?: boolean
  run: (args: string[], state: TermState) => ExecResult
}

const openWindowResult = (id: string, label: string): ExecResult => ({
  lines: [`Opening ${label} window...`],
  openWindow: id,
})

// window command name → WINDOW_CONFIGS id (ids stay camelCase; commands are lowercase)
const WINDOW_TARGETS: Record<string, string> = {
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  resume: 'resume',
  contact: 'contact',
  missionlog: 'missionLog',
}

function windowCommand(name: string): Command {
  return {
    name,
    description: `Open ${name === 'missionlog' ? 'mission log' : name} window`,
    usage: name,
    category: 'windows',
    run: () => openWindowResult(WINDOW_TARGETS[name], name),
  }
}

const COMMANDS: Command[] = [
  {
    name: 'help',
    description: 'List commands, or detail one',
    usage: 'help [command]',
    category: 'system',
    run: (args, state) => {
      if (args[0]) {
        const cmd = findCommand(args[0])
        return cmd
          ? { lines: [`${cmd.name} — ${cmd.description}`, `usage: ${cmd.usage}`] }
          : { lines: [`No such command: ${args[0]}`] }
      }
      const visible = COMMANDS.filter(c => !c.hidden || (c.name === 'dossier' && state.dossierUnlocked))
      const section = (cat: Command['category'], title: string) => [
        title,
        ...visible.filter(c => c.category === cat).map(c => `  ${c.name.padEnd(13)} ${c.description}`),
      ]
      return {
        lines: [
          ...section('windows', 'WINDOWS'),
          ...section('files', 'FILES'),
          ...section('system', 'SYSTEM'),
          '',
          "Tip: 'help <command>' for usage. Tab completes. The archives keep secrets.",
        ],
      }
    },
  },
  { name: 'clear', description: 'Clear terminal', usage: 'clear', category: 'system', run: () => ({ lines: [], clear: true }) },
  ...Object.keys(WINDOW_TARGETS).map(windowCommand),
  { name: 'log', description: 'Alias of missionlog', usage: 'log', category: 'windows', hidden: true, run: () => openWindowResult('missionLog', 'mission log') },
  {
    name: 'dossier',
    description: 'Open the recovered dossier',
    usage: 'dossier',
    category: 'windows',
    hidden: true,
    run: (_a, state) =>
      state.dossierUnlocked
        ? openWindowResult('dossier', 'dossier')
        : { lines: ['ACCESS DENIED. FILE NOT RECOVERED.'] },
  },
  {
    name: 'open',
    description: 'Open a window by name',
    usage: 'open <about|projects|skills|resume|contact|missionlog>',
    category: 'windows',
    run: (args, state) => {
      const name = (args[0] ?? '').toLowerCase()
      if (name === 'dossier') return findCommand('dossier')!.run([], state)
      const target = WINDOW_TARGETS[name]
      return target
        ? openWindowResult(target, name)
        : { lines: [`Unknown window: ${args[0] ?? '(none)'}`, 'usage: open <about|projects|skills|resume|contact|missionlog>'] }
    },
  },
  {
    name: 'ls',
    description: 'List directory',
    usage: 'ls [path]',
    category: 'files',
    run: (args, state) => {
      const path = resolvePath(state.cwd, args[0])
      const node = getNode(FS_ROOT, path)
      if (!node) return { lines: [`ls: no such path: ${args[0] ?? path}`] }
      return node.type === 'dir' ? { lines: listDir(node) } : { lines: [args[0] ?? path] }
    },
  },
  {
    name: 'cd',
    description: 'Change directory',
    usage: 'cd <path>',
    category: 'files',
    run: (args, state) => {
      const path = resolvePath(state.cwd, args[0] ?? HOME)
      const node = getNode(FS_ROOT, path)
      if (!node || node.type !== 'dir') return { lines: [`cd: not a directory: ${args[0] ?? path}`] }
      return { lines: [], cwd: path }
    },
  },
  { name: 'pwd', description: 'Print working directory', usage: 'pwd', category: 'files', run: (_a, state) => ({ lines: [state.cwd] }) },
  {
    name: 'cat',
    description: 'Print a file',
    usage: 'cat <file>',
    category: 'files',
    run: (args, state) => {
      if (!args[0]) return { lines: ['usage: cat <file>'] }
      const node = getNode(FS_ROOT, resolvePath(state.cwd, args[0]))
      if (!node || node.type !== 'file') return { lines: [`cat: no such file: ${args[0]}`] }
      if (node.encrypted) {
        return { lines: ['[ENCRYPTED — CIPHERTEXT FOLLOWS]', ...node.content.match(/.{1,48}/g) ?? [node.content], '', "Use: decrypt <file> <key>"] }
      }
      return { lines: node.content.split('\n') }
    },
  },
  {
    name: 'decrypt',
    description: 'Attempt to decrypt a classified file',
    usage: 'decrypt <file> <key>',
    category: 'files',
    run: (args, state) => {
      const [file, key] = args
      if (!file || !key) return { lines: ['usage: decrypt <file> <key>'] }
      const node = getNode(FS_ROOT, resolvePath(state.cwd, file))
      if (!node || node.type !== 'file' || !node.encrypted) return { lines: [`decrypt: not an encrypted file: ${file}`] }
      const plain = tryDecrypt(node.content, key)
      if (!plain) return { lines: ['DECRYPTION FAILED. KEY REJECTED.'] }
      const result: ExecResult = { lines: ['DECRYPTION SUCCESSFUL:', '', ...plain.split('\n')] }
      if (node.onDecrypt === 'dossier') {
        result.unlockDossier = true
        result.lines.push('', '>>> NEW WINDOW UNLOCKED: dossier <<<')
      }
      return result
    },
  },
  { name: 'whoami', description: 'Identify operator', usage: 'whoami', category: 'system', run: () => ({ lines: ['visitor — clearance: PROVISIONAL', "(the station belongs to Jeff Granof; type 'about')"] }) },
  { name: 'sudo', description: '', usage: 'sudo <anything>', category: 'system', hidden: true, run: () => ({ lines: ['visitor is not in the sudoers file.', 'This incident will be reported to STATION COMMAND.'] }) },
  { name: 'coffee', description: '', usage: 'coffee', category: 'system', hidden: true, run: () => ({ lines: ['DISPENSING... ☕', 'CAFFEINE LEVELS NOMINAL. CARRY ON, COMMANDER.'] }) },
  {
    name: 'self-destruct',
    description: '',
    usage: 'self-destruct',
    category: 'system',
    hidden: true,
    run: () => ({
      lines: [
        'SELF-DESTRUCT SEQUENCE INITIATED...',
        '3...', '2...', '1...',
        'ABORTED — clearance PROVISIONAL cannot destroy the station.',
        'Nice try, though.',
      ],
    }),
  },
]

function findCommand(name: string): Command | undefined {
  return COMMANDS.find(c => c.name === name.toLowerCase())
}

function closest(name: string): string | null {
  const dist = (a: string, b: string): number => {
    const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
    for (let j = 1; j <= b.length; j++) m[0][j] = j
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    return m[a.length][b.length]
  }
  let best: string | null = null
  let bestD = 3
  for (const c of COMMANDS.filter(c => !c.hidden)) {
    const d = dist(name.toLowerCase(), c.name)
    if (d < bestD) { bestD = d; best = c.name }
  }
  return best
}

export function execute(raw: string, state: TermState): ExecResult {
  const [name, ...args] = raw.trim().split(/\s+/)
  if (!name) return { lines: [] }
  const cmd = findCommand(name)
  if (!cmd) {
    const hint = closest(name)
    return { lines: [`Command not found: ${name}`, hint ? `Did you mean '${hint}'?` : "Type 'help' for available commands."] }
  }
  return cmd.run(args, state)
}

/** Tab completion: first token → command names; later tokens → fs paths. */
export function complete(input: string, state: TermState): string[] {
  const tokens = input.split(/\s+/)
  if (tokens.length <= 1) {
    return COMMANDS.filter(c => !c.hidden && c.name.startsWith(tokens[0] ?? '')).map(c => c.name).sort()
  }
  const partial = tokens[tokens.length - 1]
  return completePath(FS_ROOT, state.cwd, partial)
}
