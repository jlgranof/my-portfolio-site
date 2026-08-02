# Mission Control

My personal site — [jeffgranof.com](https://jeffgranof.com)

Instead of another scroll-past-my-headshot portfolio, I built a retro mission-control station. There's a CRT monitor, a command terminal, a radar that's more than it looks, and a mission log that never shuts up. You want to know about me? Type `help` and go find out.

## Things to try

- `about`, `projects`, `resume`, `contact` — the actual portfolio part, served in draggable windows
- `ls`, `cd`, `cat` — poke around the station's filesystem. Read the logs. Especially the logs.
- `defend` — the radar is playable. Tapping it three times fast works too.
- `theme amber` — if green phosphor isn't your thing
- `sound on` — beeps, obviously
- `rank` — yes, you earn XP for snooping around my website. Yes, there are achievements.

There's an encrypted archive in `/classified`. Everything you need to crack it is on the station. If you crack it, you get the file on me they don't want you to see.

(And if you skip all that and just find the keys in this repo's source instead — honestly, respect. That counts.)

## On phones

Small screens get the FIELD OPS UNIT — a handheld version of the same station. Same terminal, same secrets, buttons instead of windows.

## Stack

React 19 + TypeScript + Vite. No UI libraries, no CSS frameworks, no backend — just components, hand-rolled CSS, and localStorage. Tests with Vitest. Pushes to `main` lint, test, build, and deploy to GitHub Pages via Actions.

```bash
npm install
npm run dev     # boot the station
npm test        # 35 tests, mostly on the terminal/game/cipher logic
npm run build
```

## Why

Because a portfolio should prove something, and a PDF proves you own a word processor. This proves I'll happily over-engineer a personal website with a virtual filesystem, a Caesar cipher puzzle, and a Missile Command clone — and ship it with CI and a test suite anyway.

— Jeff
