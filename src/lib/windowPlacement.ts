import type { WindowPosition } from '../config/windowConfigs'

const BASE = 24
const STEP = 32
const WRAP = 8

/** Staggered "cascade" placement for the Nth opened window. */
export function cascadePosition(
  openIndex: number,
  size: { width: number; height: number },
): WindowPosition {
  const offset = (openIndex % WRAP) * STEP
  return { x: BASE + offset, y: BASE + offset, width: size.width, height: size.height }
}
