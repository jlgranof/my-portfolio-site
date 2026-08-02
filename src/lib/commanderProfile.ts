// Persistent visitor progression: XP, ranks, achievements (localStorage).
// The NamePlate is Jeff's identity; this is the *visitor's* service record.

export interface CommanderData {
  xp: number
  achievements: string[]
  windows: string[]
  commands: string[]
}

const KEY = 'granof-commander'
const ACHIEVEMENT_XP = 15

export const RANKS: Array<[string, number]> = [
  ['CADET', 0],
  ['ENSIGN', 50],
  ['LIEUTENANT', 150],
  ['COMMANDER', 350],
  ['STATION CHIEF', 700],
]

export const ACHIEVEMENTS: Record<string, string> = {
  'first-contact': 'First Contact — run your first command',
  'explorer': 'Explorer — open every window',
  'codebreaker': 'Codebreaker — crack a classified file',
  'deep-clearance': 'Deep Clearance — recover the dossier',
  'night-shift': 'Night Shift — recalibrate the phosphor',
  'defender': 'Defender — engage radar defense',
  'ace': 'Ace — survive to wave 5',
  'veteran': 'Veteran — score 500+ in one defense',
}

const EXPLORER_WINDOWS = ['about', 'projects', 'skills', 'resume', 'contact', 'missionLog']

function load(): CommanderData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { xp: 0, achievements: [], windows: [], commands: [], ...JSON.parse(raw) }
  } catch { /* fresh commander */ }
  return { xp: 0, achievements: [], windows: [], commands: [] }
}

let data = load()

function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* session only */ }
  try { window.dispatchEvent(new CustomEvent('granof:xp')) } catch { /* non-DOM env */ }
}

export function getData(): CommanderData {
  return data
}

export function currentRank(): string {
  let name = RANKS[0][0]
  for (const [rank, threshold] of RANKS) {
    if (data.xp >= threshold) name = rank
  }
  return name
}

export function nextRank(): [string, number] | null {
  for (const [rank, threshold] of RANKS) {
    if (data.xp < threshold) return [rank, threshold]
  }
  return null
}

export function addXp(amount: number): void {
  if (amount <= 0) return
  data.xp += amount
  persist()
}

export function award(id: string): boolean {
  if (!(id in ACHIEVEMENTS) || data.achievements.includes(id)) return false
  data.achievements = [...data.achievements, id]
  data.xp += ACHIEVEMENT_XP
  persist()
  return true
}

export function trackCommand(name: string): void {
  if (data.commands.includes(name)) return
  data.commands = [...data.commands, name]
  data.xp += 2
  if (data.commands.length === 1) award('first-contact')
  persist()
}

export function trackWindowOpen(id: string): void {
  if (data.windows.includes(id)) return
  data.windows = [...data.windows, id]
  data.xp += 5
  if (EXPLORER_WINDOWS.every(w => data.windows.includes(w))) award('explorer')
  persist()
}

/** Test hook: reset in-memory state (does not touch storage). */
export function resetForTest(): void {
  data = { xp: 0, achievements: [], windows: [], commands: [] }
}
