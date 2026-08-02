// Opt-in retro sound, synthesized with Web Audio — no files, no autoplay.
// The AudioContext is only created after a user gesture (a command/keypress).

const KEY = 'granof-sound'

let ctx: AudioContext | null = null
let enabled = (() => {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
})()

export function soundEnabled(): boolean {
  return enabled
}

export function setSoundEnabled(on: boolean): void {
  enabled = on
  try { localStorage.setItem(KEY, on ? '1' : '0') } catch { /* session only */ }
  try { window.dispatchEvent(new CustomEvent('granof:sound')) } catch { /* non-DOM */ }
}

function tone(freq: number, duration: number, type: OscillatorType = 'square', gain = 0.02): void {
  if (!enabled) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(gain, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(g).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch { /* audio unavailable — stay silent */ }
}

export const keyClick = (): void => tone(1600, 0.02, 'square', 0.006)
export const confirmBeep = (): void => tone(880, 0.07)
export const errorBeep = (): void => tone(220, 0.12, 'sawtooth')
export const alertTone = (): void => {
  tone(440, 0.15)
  setTimeout(() => tone(330, 0.2), 160)
}
