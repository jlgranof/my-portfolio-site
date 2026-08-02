# Mission Control Refit — Design

**Date:** 2026-08-02
**Status:** Approved by Jeff (pending final spec review)
**Site:** jeffgranof.com — personal portfolio, GitHub Pages, pure static

## Context

The site is a retro mission-control portfolio: a CRT monitor frame containing a
command terminal that opens draggable windows (About, Projects, Skills, Resume,
Contact), alongside an animated radar and auto-scrolling mission log. The
concept works; the execution has gaps.

### Problems identified in the deep dive

1. **All personal content is mock data** — fake email, fake projects with `#`
   links, invented employers/certifications, dead resume download.
2. **No site identity** — `index.html` title is "Vite + React + TS", Vite
   favicon, no meta description, no Open Graph tags.
3. **No mobile support** — fixed 1100px layout, zero media queries,
   mouse-only drag/resize (no touch events).
4. **Shallow terminal** — no history, no completion, no arguments, fragile
   contentEditable input with a hardcoded `input.length * 7.2px` cursor hack.
5. **Radar renders as an ellipse**, not a circle (fills container width and
   height independently).
6. **UX/quality issues** — all windows open stacked at (0,0); no
   `prefers-reduced-motion` support; mission log tone occasionally off for a
   professional audience; minor React anti-patterns (interval churn in
   RadarWindow, state-in-effect in WindowManager, handler rebuild in
   useTerminalOutput); no tests; no CI; 1,563-line monolithic stylesheet.

### Goals (from brainstorming with Jeff)

- **Audience:** recruiters, fellow developers, and Jeff himself — equally.
  Impressive toy on the surface; a hurried recruiter still gets essentials fast.
- **Priorities:** visual polish/feel, deeper interactivity, works on every
  device. Fake data fixed structurally (Jeff fills content in later).
- **Interactivity directions chosen:** pro-grade terminal, cinematic moments,
  hidden depth/games, plus standout features: **Radar Defense minigame with
  commander ranks** and **crackable classified files**.
- **Hard constraint:** pure static site. No backends, no API keys, no
  third-party services. GitHub Pages hosting stays.

## Architecture Overview

Five phases, each independently shippable, plus cross-cutting testing/CI.
The Phase 1 data layer underpins everything later.

```
src/
  data/
    profile.ts          # single typed source of all personal content
    filesystem.ts       # virtual FS tree (flavor + classified files)
    missionLogMessages.ts (revised tone; clue hooks)
  lib/                  # pure logic, unit-tested
    commandParser.ts    # tokenizer + registry dispatch
    virtualFs.ts        # ls/cd/pwd/cat operations
    cipher.ts           # Caesar + keyword-XOR encrypt/decrypt
    commanderProfile.ts # XP, ranks, achievements (localStorage-backed)
    radarDefense.ts     # game state machine / wave logic
  components/           # rendering only; windows read profile.ts
  styles/               # split per-area CSS, custom-property palette
```

## Phase 1 — Foundation

- **`profile.ts` data layer.** Typed interfaces for identity, about, skills,
  projects, resume (experience/education/certifications), contact/social
  links. All five window components become pure renderers of this data.
  Unfilled values marked `// TODO(jeff)` for grep-ability. No fabricated
  employers/certifications remain in the rendered output; placeholders are
  visibly placeholders (e.g., "[PROJECT NAME]"), never plausible fakes.
- **Site identity.** Real `<title>` ("Jeff Granof — Mission Control"), meta
  description, Open Graph + Twitter card tags, custom radar-themed SVG
  favicon, static social preview image (`public/og-image.png`).
- **Radar circle fix.** Radar element uses `aspect-ratio: 1` sized from one
  dimension so it is always a true circle.
- **Window UX.** Cascade placement for newly opened windows (staggered
  offsets). Drag/resize converted from mouse events to **pointer events**
  (touch works on hybrids). `document.querySelector` calls in
  ResizableWindow replaced by refs provided by WindowManager.
- **CSS reorganization.** `styles.css` splits into per-area files
  (`base.css`, `monitor.css`, `terminal.css`, `windows.css`, `radar.css`,
  `log.css`, …) imported from one entry. All colors become CSS custom
  properties (enables Phase 3 themes).
- **React cleanups.** RadarWindow interval no longer recreated per target
  (id counter via ref); WindowManager's `previousActiveWindows` state
  replaced with a ref comparison; `useTerminalOutput` uses functional
  setState so its handler is stable.
- **Motion baseline.** Global `prefers-reduced-motion` handling: flashing/
  sweeping animations get static or gentle equivalents. Applies to all
  later phases.

## Phase 2 — Terminal 2.0

- **Input rebuild.** Replace contentEditable with a hidden `<input>` plus
  rendered text span; block cursor positioned in `ch` units on a monospace
  font. Fixes cursor drift, paste, selection.
- **Parser.** `commandParser.ts`: tokenize `command [args...]`, dispatch
  via an extended command registry. Existing commands preserved;
  `open <window>` works for all windows; `missionLog` renamed `log`.
  `help` shows categorized commands; `help <cmd>` shows detail. Unknown
  commands suggest the closest match (edit distance).
- **History & completion.** ↑/↓ history persisted to localStorage. Tab
  completes commands and file paths; double-tab lists candidates.
- **Virtual filesystem.** `filesystem.ts` defines the tree
  (`/home/commander/`, `/var/log/`, `/classified/`); `virtualFs.ts`
  implements `ls`, `cd`, `pwd`, `cat`. File content references
  `profile.ts` — personal content is never duplicated.
- **Easter eggs.** `sudo`, `coffee`, `whoami`, `self-destruct`
  (cancellable countdown), `matrix`, konami code. Cheap per-egg once the
  parser exists.

## Phase 2.5 — Crackable Classified Files

- `/classified/` contains encrypted files; ciphers escalate: Caesar first,
  keyword-XOR later. `decrypt <file> <key>` attempts decryption with
  in-fiction success/failure output.
- **Clue trail:** key hints planted in mission log messages, other files,
  and radar coordinates. Final crack unlocks a hidden **DOSSIER** window
  (Jeff's out-of-fiction bio, content from `profile.ts`) and grants an
  achievement.
- Keys ship in the bundle lightly obfuscated. Reading source to find them
  is an accepted (and welcomed) solution path — a source comment
  congratulates whoever does.

## Phase 3 — Cinematic Layer

- **Boot sequence.** First visit per session (`sessionStorage`): CRT
  power-on flash → BIOS-style self-test scroll ("GRANOF COMPUTER
  v4.12.16… MEMORY CHECK… OK") → interface fade-in. Any key/click skips.
  Reduced-motion users get a quick fade.
- **CRT feel.** Subtle phosphor glow, occasional flicker on existing
  glass/noise overlays. `theme green|amber|blue` switches phosphor
  palettes via custom properties; persisted to localStorage.
- **Sound, opt-in only.** `sound on|off` command + bezel speaker toggle.
  Web Audio-synthesized key clicks, beeps, alert tone. No audio files; no
  autoplay (first sound only after user gesture).
- **Alert events.** Rare scripted "INCOMING TRANSMISSION" story beats:
  screen-edge glow + mission log entry; some carry classified-files
  clues. Replaces constant random alert spam. Mission log message pool
  gets a tone pass (playful, not menacing).

## Phase 4 — Mobile Handheld Shell (FIELD OPS UNIT)

- **Detection.** CSS breakpoint + `pointer: coarse` media query select a
  handheld shell instead of the monitor.
- **Shell.** Ruggedized military handheld drawn with the same design
  language (bezel, screws, LEDs). Full-screen panels; bottom
  hardware-style button row: ABOUT · OPS (projects) · PROFILE (resume) ·
  COMMS (contact) · TERM. Panels reuse the same window components,
  restyled full-screen; all content still flows from `profile.ts`.
- **Terminal panel.** Real `<input>` so the OS keyboard behaves. History
  via tappable recent-commands row; completion via tappable suggestions.
- **Radar/Log.** Rendered as a compact status ticker strip, not always-on
  panels. Boot sequence has a compact handheld variant. Radar Defense is
  touch-first and fully playable here.

## Phase 5 — Radar Defense + Commander Ranks

- **Game.** `defend` command (or tapping the radar 3 times) expands the
  radar into a Missile Command-style canvas game inside the radar circle.
  Hostile blips spawn at the rim and descend toward center; click/tap
  detonates interceptors; friendlies must not be hit. Waves escalate;
  three hostiles reaching center ends the run. ~60fps, pausable,
  identical mouse/touch behavior.
- **Commander profile.** `commanderProfile.ts` tracks XP + achievements in
  localStorage. XP sources: windows explored, distinct commands used,
  files read, ciphers cracked, game score. Ranks: CADET → ENSIGN →
  LIEUTENANT → COMMANDER → STATION CHIEF. ~12 achievements ("First
  Contact", "Codebreaker", "Ace Defender", "Completionist", …).
- **Surfacing.** Visitor rank chip on the terminal header (NamePlate
  remains Jeff's identity). `rank` and `achievements` commands; rank-ups
  celebrated in the mission log. Without localStorage everything still
  works — progress just doesn't persist.

## Cross-cutting — Testing & CI

- **Vitest + React Testing Library.** Unit tests for all `lib/` modules
  (parser, virtual FS, cipher round-trips, XP/rank math, wave logic) plus
  component smoke tests (terminal renders and dispatches, windows render
  profile data).
- **GitHub Actions.** On push: lint → typecheck → test → build. On
  `main`: auto-deploy to GitHub Pages, replacing manual `npm run deploy`.

## Error Handling

- localStorage access wrapped in guarded helpers (private-browsing safe).
- Web Audio initialized only after a user gesture.
- Game loop clamps delta-time (background-tab safety).
- All animation honors `prefers-reduced-motion`.
- Terminal never throws on input; worst case is an in-fiction error line.

## Out of Scope

- Live external data (GitHub API radar) — declined; pure-static rule.
- Backend-dependent features (visitor presence, AI chat, contact form
  handling beyond `mailto:`).
- Writing Jeff's real content — structure ships with marked placeholders;
  Jeff fills in `profile.ts` himself.

## Build Order

Phases ship in order 1 → 2 → 2.5 → 3 → 4 → 5; testing/CI lands with
Phase 1 and grows with each phase. Each phase leaves `main` deployable.
