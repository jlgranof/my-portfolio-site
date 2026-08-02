// Phosphor themes: swap the CSS custom-property palette via data-theme.

export type Theme = 'green' | 'amber' | 'blue'
export const THEMES: Theme[] = ['green', 'amber', 'blue']

const KEY = 'granof-theme'

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem(KEY, theme) } catch { /* session only */ }
}

export function initTheme(): void {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved && (THEMES as string[]).includes(saved)) {
      document.documentElement.dataset.theme = saved
    }
  } catch { /* default green */ }
}
