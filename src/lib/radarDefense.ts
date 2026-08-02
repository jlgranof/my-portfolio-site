// Pure game logic for Radar Defense. Polar coordinates: r=1 is the rim,
// r=0 the station core. The component owns rendering and input mapping.

export interface Blip {
  id: number
  angle: number
  r: number
  speed: number
  type: 'hostile' | 'friendly'
}

export interface Explosion {
  x: number
  y: number
  age: number
}

export interface GameState {
  blips: Blip[]
  explosions: Explosion[]
  score: number
  lives: number
  wave: number
  toSpawn: number
  spawnTimer: number
  over: boolean
  nextId: number
}

export const CORE_RADIUS = 0.08
export const BLAST_RADIUS = 0.14
const SPAWN_INTERVAL = 0.9
const FRIENDLY_CHANCE = 0.15

export function createGame(): GameState {
  return {
    blips: [],
    explosions: [],
    score: 0,
    lives: 3,
    wave: 1,
    toSpawn: 5,
    spawnTimer: 0.5,
    over: false,
    nextId: 1,
  }
}

function spawn(state: GameState, rand: () => number): void {
  state.blips.push({
    id: state.nextId++,
    angle: rand() * Math.PI * 2,
    r: 1,
    speed: 0.055 + state.wave * 0.012,
    type: rand() < FRIENDLY_CHANCE ? 'friendly' : 'hostile',
  })
  state.toSpawn--
}

export function step(state: GameState, dt: number, rand: () => number = Math.random): GameState {
  if (state.over) return state

  state.spawnTimer -= dt
  if (state.toSpawn > 0 && state.spawnTimer <= 0) {
    spawn(state, rand)
    state.spawnTimer = SPAWN_INTERVAL
  }

  for (const blip of state.blips) blip.r -= blip.speed * dt

  for (const blip of state.blips) {
    if (blip.r <= CORE_RADIUS && blip.type === 'hostile') {
      state.lives--
    }
  }
  state.blips = state.blips.filter(b => b.r > CORE_RADIUS)

  state.explosions.forEach(e => { e.age += dt })
  state.explosions = state.explosions.filter(e => e.age < 0.35)

  if (state.lives <= 0) {
    state.over = true
  } else if (state.toSpawn === 0 && state.blips.length === 0) {
    state.wave++
    state.toSpawn = 4 + state.wave * 2
    state.spawnTimer = 1.2
  }

  return state
}

/** Fire an interceptor at cartesian (x, y) in [-1, 1] space. */
export function shoot(state: GameState, x: number, y: number): GameState {
  if (state.over) return state
  state.explosions.push({ x, y, age: 0 })

  const survivors: Blip[] = []
  for (const blip of state.blips) {
    const bx = Math.cos(blip.angle) * blip.r
    const by = Math.sin(blip.angle) * blip.r
    const hit = Math.hypot(bx - x, by - y) <= BLAST_RADIUS
    if (hit && blip.type === 'hostile') {
      state.score += 10 * state.wave
    } else if (hit && blip.type === 'friendly') {
      state.lives--
    } else {
      survivors.push(blip)
    }
  }
  state.blips = survivors
  if (state.lives <= 0) state.over = true
  return state
}
