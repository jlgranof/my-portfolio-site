import { useRef, useEffect, useState, useCallback } from "react"
import { createGame, step, shoot, CORE_RADIUS } from "../lib/radarDefense"
import type { GameState } from "../lib/radarDefense"
import { addXp, award } from "../lib/commanderProfile"
import { confirmBeep, errorBeep } from "../lib/sound"

interface RadarDefenseProps {
  onExit: () => void
}

function draw(ctx: CanvasRenderingContext2D, state: GameState, size: number): void {
  const c = size / 2
  const scale = size / 2 - 4
  const styles = getComputedStyle(document.documentElement)
  const phosphor = styles.getPropertyValue('--phosphor').trim() || '#6cffda'
  const danger = styles.getPropertyValue('--danger').trim() || '#ff6b6b'

  ctx.clearRect(0, 0, size, size)

  // rim + rings + core
  ctx.strokeStyle = phosphor
  ctx.globalAlpha = 0.6
  for (const r of [1, 0.66, 0.33]) {
    ctx.beginPath()
    ctx.arc(c, c, scale * r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.fillStyle = phosphor
  ctx.beginPath()
  ctx.arc(c, c, scale * CORE_RADIUS, 0, Math.PI * 2)
  ctx.fill()

  // blips
  for (const blip of state.blips) {
    const x = c + Math.cos(blip.angle) * blip.r * scale
    const y = c + Math.sin(blip.angle) * blip.r * scale
    ctx.fillStyle = blip.type === 'hostile' ? danger : phosphor
    ctx.beginPath()
    ctx.arc(x, y, blip.type === 'hostile' ? 5 : 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // explosions
  for (const ex of state.explosions) {
    ctx.strokeStyle = danger
    ctx.globalAlpha = Math.max(0, 1 - ex.age / 0.35)
    ctx.beginPath()
    ctx.arc(c + ex.x * scale, c + ex.y * scale, 6 + ex.age * 90, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

export default function RadarDefense({ onExit }: RadarDefenseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(createGame())
  const grantedRef = useRef(false)
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1, over: false })

  const restart = useCallback(() => {
    stateRef.current = createGame()
    grantedRef.current = false
    setHud({ score: 0, lives: 3, wave: 1, over: false })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  useEffect(() => {
    award('defender')
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05) // clamp: background tabs can't explode
      last = now
      const state = step(stateRef.current, dt)
      const canvas = canvasRef.current
      if (canvas) {
        const size = canvas.width
        const ctx = canvas.getContext('2d')
        if (ctx) draw(ctx, state, size)
      }
      setHud(prev =>
        prev.score !== state.score || prev.lives !== state.lives || prev.wave !== state.wave || prev.over !== state.over
          ? { score: state.score, lives: state.lives, wave: state.wave, over: state.over }
          : prev,
      )
      if (state.over && !grantedRef.current) {
        grantedRef.current = true
        errorBeep()
        addXp(Math.round(state.score / 10))
        if (state.wave >= 5) award('ace')
        if (state.score >= 500) award('veteran')
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || stateRef.current.over) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    if (Math.hypot(x, y) > 1.05) return
    confirmBeep()
    shoot(stateRef.current, x, y)
  }

  return (
    <div className="radar-defense">
      <div className="defense-hud">
        <span>WAVE {hud.wave}</span>
        <span>SCORE {hud.score}</span>
        <span>{'♥'.repeat(Math.max(0, hud.lives))}{'·'.repeat(Math.max(0, 3 - hud.lives))}</span>
      </div>
      <div className="defense-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="defense-canvas"
          onPointerDown={handlePointerDown}
          aria-label="Radar defense game — tap to intercept hostiles"
        />
        {hud.over && (
          <div className="defense-over">
            <div className="defense-over-title">STATION OVERRUN</div>
            <div>FINAL SCORE: {hud.score}</div>
            <div className="defense-over-actions">
              <button onClick={restart}>RE-ENGAGE</button>
              <button onClick={onExit}>STAND DOWN</button>
            </div>
          </div>
        )}
      </div>
      <div className="defense-help">
        tap to intercept — red hostile, green friendly (do NOT shoot)
        <button className="defense-exit" onClick={onExit}>EXIT</button>
      </div>
    </div>
  )
}
