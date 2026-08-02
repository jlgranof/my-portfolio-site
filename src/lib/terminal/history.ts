// localStorage-backed command history & unlock flags, safe in private browsing.

const HISTORY_KEY = 'granof-terminal-history'
const DOSSIER_KEY = 'granof-dossier-unlocked'
const MAX = 50

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value) } catch { /* private browsing — session only */ }
}

export function loadHistory(): string[] {
  try { return JSON.parse(safeGet(HISTORY_KEY) ?? '[]') as string[] } catch { return [] }
}
export function saveHistory(history: string[]): void {
  safeSet(HISTORY_KEY, JSON.stringify(history.slice(-MAX)))
}
export function loadDossierUnlocked(): boolean {
  return safeGet(DOSSIER_KEY) === '1'
}
export function saveDossierUnlocked(): void {
  safeSet(DOSSIER_KEY, '1')
}
