# Mission Control Refit — Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the load-bearing foundation: typed content data layer, site identity/SEO, radar circle fix, window UX cleanups, split stylesheet with custom properties, reduced-motion baseline, and test + CI infrastructure.

**Architecture:** All personal content moves into one typed module (`src/data/profile.ts`) that window components render from. The 1,563-line `styles.css` splits into per-area files along its existing section comments. React anti-patterns (state-in-effect, interval churn, `document.querySelector`) are replaced with refs. Vitest + React Testing Library and a GitHub Actions CI/deploy pipeline land first so every later task is tested.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Vitest, @testing-library/react, jsdom, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-02-mission-control-refit-design.md`

## Global Constraints

- Pure static site; no runtime dependencies added — dev dependencies only.
- Custom domain preserved: `public/CNAME` contains `jeffgranof.com`; Vite `base: '/'` stays.
- Placeholder content must be visibly placeholder (e.g. `[PROJECT NAME]`), never a plausible fake (no invented employers, certifications, or contact info). Mark every value Jeff must supply with a `// TODO(jeff)` comment.
- All flashing/sweeping animations must respect `prefers-reduced-motion`.
- Test files import test APIs explicitly (`import { describe, it, expect } from 'vitest'`); do not use jest-dom matchers (plain `toBeTruthy()`/`toBe()` assertions only) — keeps `tsc -b` clean without type shims.
- `npm run build` (which runs `tsc -b`) must pass after every task.
- Existing CSS class names must not change in Tasks 2–5 (components depend on them).

---

### Task 1: Test infrastructure (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`
- Create: `src/components/NamePlate.test.tsx`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `npm test` (vitest run) and `npm run test:watch` commands used by every later task and by CI (Task 10).

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest jsdom @testing-library/react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    css: false,
  },
})
```

- [ ] **Step 3: Add scripts to `package.json`**

In the `"scripts"` block add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a smoke test that exercises real rendering**

`src/components/NamePlate.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NamePlate from './NamePlate'

describe('NamePlate', () => {
  it('renders the engineer identity header', () => {
    render(<NamePlate />)
    expect(screen.getByText('ENGINEER IDENTITY')).toBeTruthy()
    expect(screen.getByText('Jeff Granof')).toBeTruthy()
  })
})
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test`
Expected: 1 file, 1 test, PASS.

- [ ] **Step 6: Verify build still passes**

Run: `npm run build`
Expected: exit 0. (`tsc -b` type-checks the test file too; the explicit vitest imports keep it clean.)

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/components/NamePlate.test.tsx
git commit -m "test: add Vitest + React Testing Library infrastructure"
```

---

### Task 2: Split `styles.css` into per-area files

**Files:**
- Create: `src/styles/index.css`, `src/styles/base.css`, `src/styles/room.css`, `src/styles/monitor.css`, `src/styles/screen.css`, `src/styles/layout.css`, `src/styles/nameplate.css`, `src/styles/radar.css`, `src/styles/log.css`, `src/styles/terminal.css`, `src/styles/windows.css`, `src/styles/window-content.css`
- Modify: `src/main.tsx:4` (import path)
- Delete: `src/styles.css`

**Interfaces:**
- Consumes: existing `src/styles.css` (1,563 lines, organized by `/* Section */` comments).
- Produces: `src/styles/index.css` as the single CSS entry; `src/styles/base.css` owns the `:root` custom-property palette that Tasks 3, 6, 7 and later phases extend. Rules move verbatim — no selector or declaration changes in this task.

- [ ] **Step 1: Create the directory and move rules verbatim**

Create `src/styles/` and cut-paste blocks from `styles.css` **unchanged**, using its existing section comments as boundaries:

| Target file | Contents (source sections / selectors) |
|---|---|
| `base.css` | `:root` block, `*` reset, `html/body/#root`, `body`, `a`, `a:hover` (lines ~1–70) |
| `room.css` | `.room-background`, `@keyframes roomMove` |
| `monitor.css` | `.monitor`, `.status`, `.led` (+ `.green`/`.red`), `@keyframes blink`, `.screws`, `.screw` (+ corners, `::after`), the whole `/* Monitor Plaque */` section |
| `screen.css` | `.screen`, `.glass`, `.noise`, `@keyframes noiseMove` |
| `layout.css` | `.mission-control`, `.left-panel`, `.right-panel`, `.window-container`, the shared `.name-plate, .radar-window, .telemetry-window` group, `.window-header` (+ `.window-header .led`) |
| `nameplate.css` | `/* Name Plate */` section (`.name-plate`, `.name-plate-content`, `.field` rules) |
| `radar.css` | `/* Radar Window */` section through `.target-type .indicator.unknown` (includes sweep/grid/target keyframes, `.radar-stats`, `.stat`) |
| `log.css` | `/* Mission Log Window */` section (`.mission-log` through `.log-indicator`) |
| `terminal.css` | `.terminal` through `.cursor.visible` |
| `windows.css` | `/* Window Manager */` + `/* Resize Handles */` sections (`.window-manager`, `.resizable-window`, titlebar, close button, scrollbars, handles) |
| `window-content.css` | `/* About Window */`, `/* Projects Window */`, `/* Resume Window */`, `/* Contact Window */` sections plus `.status-indicator` rules |

- [ ] **Step 2: Create `src/styles/index.css`**

```css
@import './base.css';
@import './room.css';
@import './monitor.css';
@import './screen.css';
@import './layout.css';
@import './nameplate.css';
@import './radar.css';
@import './log.css';
@import './terminal.css';
@import './windows.css';
@import './window-content.css';
```

- [ ] **Step 3: Point `main.tsx` at the new entry and delete the monolith**

In `src/main.tsx` change `import './styles.css'` to `import './styles/index.css'`, then `rm src/styles.css`.

- [ ] **Step 4: Verify nothing was lost**

Run: `cat src/styles/*.css | grep -c '{'` and compare against the pre-split count from git: `git show HEAD:src/styles.css | grep -c '{'`
Expected: identical numbers.

- [ ] **Step 5: Lift remaining color literals into custom properties**

The `:root` block already defines the core palette. Enumerate stragglers with
`grep -rnoE '#[0-9a-fA-F]{3,8}' src/styles/ | grep -v base.css` and replace the
**recurring** ones with variables added to `:root` in `base.css`:

| New variable | Value | Used by |
|---|---|---|
| `--danger` | `#ff6b6b` | log warnings, hostile targets, red LEDs |
| `--info-blue` | `#4dabf7` | mission_success log entries |
| `--mission-failed` | `#ae3ec9` | mission_failed log entries |
| `--alert-red` | `#ff0000` | flashing alert entries |

One-off shades (gradients, shadows) may stay literal — the goal is that every
*semantic* color is themeable for Phase 3's `theme` command. Leave the
hardcoded hex values inside `RadarWindow.tsx`/`MissionLog.tsx` TSX alone for
now; Phase 3 migrates those to CSS classes when themes land.

- [ ] **Step 6: Verify build and visual parity**

Run: `npm run build && npm test`
Expected: both pass. Then `npm run dev`, load the site, and confirm the monitor, terminal, radar, log, and an opened window all look unchanged.

- [ ] **Step 7: Commit**

```bash
git add -A src/styles src/styles.css src/main.tsx
git commit -m "refactor: split styles.css into per-area files under src/styles/"
```

---

### Task 3: Reduced-motion baseline

**Files:**
- Modify: `src/styles/base.css` (append)

**Interfaces:**
- Produces: a global `prefers-reduced-motion` guard that every current and future animation inherits. Later phases (boot sequence, alerts) rely on this existing.

- [ ] **Step 1: Append the guard to `base.css`**

```css
/* Reduced-motion baseline: freeze decorative animation for users who ask */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: pass. In the browser (DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion"), confirm the radar sweep, LED blink, and background drift freeze without breaking layout.

- [ ] **Step 3: Commit**

```bash
git add src/styles/base.css
git commit -m "feat: respect prefers-reduced-motion globally"
```

---

### Task 4: `profile.ts` data layer

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/data/profile.test.ts`

**Interfaces:**
- Produces: `profile` (default-less named export) of type `Profile`, consumed by Task 5's components and by all later phases (terminal filesystem, mobile shell, DOSSIER window). Exact types below — later tasks must match these names.

- [ ] **Step 1: Write the failing test**

`src/data/profile.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { profile } from './profile'

describe('profile', () => {
  it('has identity fields', () => {
    expect(profile.identity.name).toBe('Jeff Granof')
    expect(profile.identity.rank.length).toBeGreaterThan(0)
  })

  it('never contains plausible-fake contact data', () => {
    expect(JSON.stringify(profile)).not.toContain('example.com')
    expect(JSON.stringify(profile)).not.toContain('234) 567')
  })

  it('marks unfinished content with visible placeholders, not fakes', () => {
    for (const project of profile.projects) {
      if (project.placeholder) {
        expect(project.name.startsWith('[')).toBe(true)
      }
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './profile'`.

- [ ] **Step 3: Create `src/data/profile.ts`**

```ts
// ============================================================
// SINGLE SOURCE OF TRUTH for all personal content on the site.
// Anything marked TODO(jeff) needs real data. Placeholder values
// are wrapped in [BRACKETS] so they are visibly unfinished —
// never replace them with plausible-looking fakes.
// ============================================================

export interface Identity {
  name: string
  rank: string
  clearance: string
  status: string
}

export interface About {
  briefing: string
  specializations: string[]
  objectives: string[]
}

export interface Skills {
  languages: string[]
  frameworks: string[]
  tools: string[]
}

export type ProjectStatus = 'COMPLETED' | 'IN PROGRESS' | 'PLANNING'

export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  status: ProjectStatus
  /** null = no public link yet; UI renders "DETAILS CLASSIFIED" */
  link: string | null
  /** true while this entry is bracketed placeholder content */
  placeholder?: boolean
}

export interface ExperienceItem {
  title: string
  company: string
  period: string
  highlights: string[]
  placeholder?: boolean
}

export interface EducationItem {
  degree: string
  school: string
  year: string
  placeholder?: boolean
}

export interface Resume {
  experience: ExperienceItem[]
  education: EducationItem[]
  /** Only certifications actually held. Empty array renders nothing. */
  certifications: string[]
  /** null hides the download button until a real PDF exists */
  downloadUrl: string | null
}

export interface SocialLink {
  platform: string
  handle: string
  url: string
}

export interface Contact {
  /** null renders "[CHANNEL PENDING]" instead of a mailto link */
  email: string | null
  location: string | null
  responseTime: string
  social: SocialLink[]
}

export interface Profile {
  identity: Identity
  about: About
  skills: Skills
  projects: Project[]
  resume: Resume
  contact: Contact
}

export const profile: Profile = {
  identity: {
    name: 'Jeff Granof',
    rank: 'Full Stack Engineer',
    clearance: 'Above Top Secret',
    status: 'ACTIVE',
  },

  about: {
    // TODO(jeff): rewrite in your own voice
    briefing:
      'Greetings, Commander. I am Jeff Granof, a Full Stack Developer ' +
      'building robust, scalable applications that solve real-world problems.',
    // TODO(jeff): confirm these are your actual specializations
    specializations: [
      'Frontend Development (React, TypeScript)',
      'Backend Development (Node.js, Python)',
      'Database Design & Management',
    ],
    // TODO(jeff): confirm or rewrite
    objectives: [
      'Deliver high-quality, maintainable code',
      'Collaborate effectively in agile environments',
      'Stay current with emerging technologies',
    ],
  },

  skills: {
    // TODO(jeff): trim to what you actually use
    languages: ['JavaScript/TypeScript', 'Python', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Node.js & Express'],
    tools: ['Git & GitHub', 'Docker', 'PostgreSQL'],
  },

  projects: [
    // TODO(jeff): replace with real projects (this site itself is a good first entry)
    {
      id: 'placeholder-1',
      name: '[PROJECT NAME]',
      description: '[One-sentence description of a real project goes here.]',
      tech: ['[TECH]'],
      status: 'IN PROGRESS',
      link: null,
      placeholder: true,
    },
  ],

  resume: {
    // TODO(jeff): real work history
    experience: [
      {
        title: '[TITLE]',
        company: '[COMPANY]',
        period: '[YYYY – YYYY]',
        highlights: ['[What you did there.]'],
        placeholder: true,
      },
    ],
    // TODO(jeff): real education
    education: [
      { degree: '[DEGREE]', school: '[SCHOOL]', year: '[YYYY]', placeholder: true },
    ],
    certifications: [], // TODO(jeff): only ones you actually hold
    downloadUrl: null, // TODO(jeff): add /resume.pdf to public/ then set '/resume.pdf'
  },

  contact: {
    email: null, // TODO(jeff): the address you want published
    location: null, // TODO(jeff): e.g. 'Chicago, IL' — or leave null to hide
    responseTime: 'Within 24 hours',
    social: [
      // TODO(jeff): verify handle/urls, add LinkedIn etc.
      { platform: 'GitHub', handle: '@jlgranof', url: 'https://github.com/jlgranof' },
    ],
  },
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all `profile.test.ts` tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/profile.ts src/data/profile.test.ts
git commit -m "feat: add typed profile data layer with marked placeholders"
```

---

### Task 5: Windows render from `profile.ts`

**Files:**
- Modify: `src/components/NamePlate.tsx`
- Modify: `src/components/windows/AboutWindow.tsx`
- Modify: `src/components/windows/SkillsWindow.tsx`
- Modify: `src/components/windows/ProjectsWindow.tsx`
- Modify: `src/components/windows/ResumeWindow.tsx`
- Modify: `src/components/windows/ContactWindow.tsx`
- Create: `src/components/windows/windows.test.tsx`

**Interfaces:**
- Consumes: `profile` and types from Task 4 (`import { profile } from '../../data/profile'`; NamePlate uses `'../data/profile'`).
- Produces: all six components free of hardcoded personal content. CSS class names unchanged.

- [ ] **Step 1: Write the failing tests**

`src/components/windows/windows.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { profile } from '../../data/profile'
import AboutWindow from './AboutWindow'
import SkillsWindow from './SkillsWindow'
import ProjectsWindow from './ProjectsWindow'
import ResumeWindow from './ResumeWindow'
import ContactWindow from './ContactWindow'

describe('windows render from profile data', () => {
  it('AboutWindow shows briefing and specializations', () => {
    render(<AboutWindow />)
    expect(screen.getByText(profile.about.briefing)).toBeTruthy()
    expect(screen.getByText(profile.about.specializations[0])).toBeTruthy()
  })

  it('SkillsWindow shows languages from profile', () => {
    render(<SkillsWindow />)
    expect(screen.getByText(profile.skills.languages[0])).toBeTruthy()
  })

  it('ProjectsWindow shows project names; classified when no link', () => {
    render(<ProjectsWindow />)
    expect(screen.getByText(profile.projects[0].name)).toBeTruthy()
    if (profile.projects[0].link === null) {
      expect(screen.getAllByText('DETAILS CLASSIFIED').length).toBeGreaterThan(0)
    }
  })

  it('ResumeWindow hides download button when no downloadUrl', () => {
    render(<ResumeWindow />)
    if (profile.resume.downloadUrl === null) {
      expect(screen.queryByText('DOWNLOAD FULL PROFILE')).toBeNull()
    }
  })

  it('ContactWindow shows pending channel when no email, and no fakes', () => {
    const { container } = render(<ContactWindow />)
    if (profile.contact.email === null) {
      expect(screen.getByText('[CHANNEL PENDING]')).toBeTruthy()
    }
    expect(container.innerHTML).not.toContain('example.com')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — windows still render hardcoded mock content (`example.com` present, briefing text mismatch).

- [ ] **Step 3: Rewrite the components**

`src/components/NamePlate.tsx`:

```tsx
import { profile } from "../data/profile"

export default function NamePlate() {
  const { name, rank, clearance, status } = profile.identity
  const fields = [
    ["NAME:", name],
    ["RANK:", rank],
    ["CLEARANCE:", clearance],
    ["STATUS:", status],
  ] as const
  return (
    <div className="name-plate">
      <div className="name-plate-header">
        <div style={{ margin: '5px' }} className="led green" />
        <span style={{ padding: '10px' }}>ENGINEER IDENTITY</span>
      </div>
      <div className="name-plate-content">
        {fields.map(([label, value]) => (
          <div className="field" key={label}>
            <span className="label">{label}</span>
            <span className="value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

`src/components/windows/AboutWindow.tsx`:

```tsx
import { profile } from "../../data/profile"

export default function AboutWindow() {
  const { briefing, specializations, objectives } = profile.about
  return (
    <div className="about-window">
      <div className="about-content">
        <h3>MISSION BRIEFING</h3>
        <p>{briefing}</p>
        <h4>SPECIALIZATIONS:</h4>
        <ul>{specializations.map(s => <li key={s}>{s}</li>)}</ul>
        <h4>MISSION OBJECTIVES:</h4>
        <ul>{objectives.map(o => <li key={o}>{o}</li>)}</ul>
        <div className="status-indicator">
          <span className="label">STATUS:</span>
          <span className="value active">MISSION READY</span>
        </div>
      </div>
    </div>
  )
}
```

`src/components/windows/SkillsWindow.tsx`:

```tsx
import { profile } from "../../data/profile"

export default function SkillsWindow() {
  const { languages, frameworks, tools } = profile.skills
  const sections = [
    ["LANGUAGES:", languages],
    ["FRAMEWORKS & LIBRARIES:", frameworks],
    ["TOOLS & TECHNOLOGIES:", tools],
  ] as const
  return (
    <div className="skills-window">
      <div className="skills-content">
        <h3>TECHNICAL SKILLS</h3>
        {sections.map(([title, items]) => (
          <div key={title}>
            <h4>{title}</h4>
            <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  )
}
```

`src/components/windows/ProjectsWindow.tsx`:

```tsx
import { profile } from "../../data/profile"

export default function ProjectsWindow() {
  return (
    <div className="projects-window">
      <div className="projects-content">
        <h3>ACTIVE MISSIONS</h3>
        <div className="projects-grid">
          {profile.projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h4>{project.name}</h4>
                <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tech.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              {project.link ? (
                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                  VIEW MISSION DETAILS →
                </a>
              ) : (
                <span className="project-link">DETAILS CLASSIFIED</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

`src/components/windows/ResumeWindow.tsx`:

```tsx
import { profile } from "../../data/profile"

export default function ResumeWindow() {
  const { experience, education, certifications, downloadUrl } = profile.resume
  return (
    <div className="resume-window">
      <div className="resume-content">
        <h3>MISSION PROFILE</h3>

        <div className="resume-section">
          <h4>EXPERIENCE</h4>
          {experience.map(item => (
            <div className="experience-item" key={`${item.company}-${item.period}`}>
              <div className="experience-header">
                <span className="title">{item.title}</span>
                <span className="company">{item.company}</span>
                <span className="period">{item.period}</span>
              </div>
              <ul>{item.highlights.map(h => <li key={h}>{h}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <h4>EDUCATION</h4>
          {education.map(item => (
            <div className="education-item" key={`${item.school}-${item.year}`}>
              <span className="degree">{item.degree}</span>
              <span className="school">{item.school}</span>
              <span className="year">{item.year}</span>
            </div>
          ))}
        </div>

        {certifications.length > 0 && (
          <div className="resume-section">
            <h4>CERTIFICATIONS</h4>
            <div className="certifications">
              {certifications.map(cert => <span key={cert} className="cert">{cert}</span>)}
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="resume-actions">
            <a href={downloadUrl} className="download-btn" download>DOWNLOAD FULL PROFILE</a>
          </div>
        )}
      </div>
    </div>
  )
}
```

`src/components/windows/ContactWindow.tsx`:

```tsx
import { profile } from "../../data/profile"

export default function ContactWindow() {
  const { email, location, responseTime, social } = profile.contact
  return (
    <div className="contact-window">
      <div className="contact-content">
        <h3>COMMUNICATIONS CHANNEL</h3>

        <div className="contact-section">
          <h4>PRIMARY CONTACTS</h4>
          <div className="contact-item">
            <span className="label">EMAIL:</span>
            {email ? (
              <a href={`mailto:${email}`} className="value">{email}</a>
            ) : (
              <span className="value">[CHANNEL PENDING]</span>
            )}
          </div>
          {location && (
            <div className="contact-item">
              <span className="label">LOCATION:</span>
              <span className="value">{location}</span>
            </div>
          )}
        </div>

        <div className="contact-section">
          <h4>DIGITAL PRESENCE</h4>
          <div className="social-links">
            {social.map(link => (
              <a key={link.platform} href={link.url} className="social-link" target="_blank" rel="noreferrer">
                <span className="platform">{link.platform}</span>
                <span className="handle">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-section">
          <h4>AVAILABILITY</h4>
          <div className="availability">
            <div className="status-indicator">
              <span className="label">STATUS:</span>
              <span className="value available">AVAILABLE FOR MISSIONS</span>
            </div>
            <div className="response-time">
              <span className="label">RESPONSE TIME:</span>
              <span className="value">{responseTime}</span>
            </div>
          </div>
        </div>

        {email && (
          <div className="contact-actions">
            <a href={`mailto:${email}`} className="contact-btn primary">
              INITIATE COMMUNICATION
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS (including Task 1's NamePlate test — it asserts profile-sourced values).

- [ ] **Step 5: Verify build and visual check**

Run: `npm run build`, then `npm run dev` — open each window via terminal commands; placeholder content should read as bracketed placeholders, nothing fake.

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "refactor: render all windows and nameplate from profile data layer"
```

---

### Task 6: Site identity — title, meta, favicon, social preview

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg`
- Create: `public/og-image.png` (generated from a throwaway HTML template)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: final `<head>`; later phases don't touch `index.html` except to keep the title.

- [ ] **Step 1: Create `public/favicon.svg`** (radar motif, site palette)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#020507"/>
  <circle cx="32" cy="32" r="24" fill="none" stroke="#6cffda" stroke-width="3"/>
  <circle cx="32" cy="32" r="12" fill="none" stroke="#6cffda" stroke-width="1.5" opacity=".5"/>
  <path d="M32 32 L32 8 A24 24 0 0 1 49 15 Z" fill="#6cffda" opacity=".35"/>
  <circle cx="41" cy="24" r="3.5" fill="#ffcc55"/>
</svg>
```

- [ ] **Step 2: Replace the `<head>` of `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeff Granof — Mission Control</title>
    <meta name="description" content="Jeff Granof is a full stack engineer. Step into mission control: a retro terminal portfolio with live radar, a command line, and classified files." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content="Jeff Granof — Mission Control" />
    <meta property="og:description" content="A retro mission-control portfolio. Type 'help' to begin." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://jeffgranof.com/" />
    <meta property="og:image" content="https://jeffgranof.com/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Jeff Granof — Mission Control" />
    <meta name="twitter:description" content="A retro mission-control portfolio. Type 'help' to begin." />
    <meta name="twitter:image" content="https://jeffgranof.com/og-image.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Generate `public/og-image.png` (1200×630)**

Write a throwaway `scratch-og.html` (do NOT commit it) in the scratchpad or repo root:

```html
<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1200px;height:630px;background:#020507;color:#6cffda;
    font-family:ui-monospace,Menlo,Consolas,monospace;display:flex;
    flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box}
  .frame{border:3px solid #1a212b;border-radius:22px;padding:60px 70px;
    background:radial-gradient(ellipse at center,#06131a 0%,#020507 80%)}
  h1{font-size:64px;margin:0 0 12px;letter-spacing:2px}
  p{font-size:30px;color:#9ad5c6;margin:0 0 28px}
  .prompt{font-size:26px;color:#ffcc55}
  .cursor{display:inline-block;width:14px;height:28px;background:#6cffda;vertical-align:middle}
</style></head><body><div class="frame">
  <h1>JEFF GRANOF</h1>
  <p>FULL STACK ENGINEER // MISSION CONTROL</p>
  <div class="prompt">&gt; type 'help' to begin <span class="cursor"></span></div>
</div></body></html>
```

Then screenshot it headlessly:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --screenshot=public/og-image.png --window-size=1200,630 \
  --default-background-color=00000000 "file://$(pwd)/scratch-og.html" && rm scratch-og.html
```

(Fallback if Chrome is unavailable: open the HTML in any browser at exactly 1200×630 and screenshot manually.)

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: pass; `dist/` contains `favicon.svg` and `og-image.png`. Open the dev site — tab shows the radar favicon and new title.

- [ ] **Step 5: Commit**

```bash
git add index.html public/favicon.svg public/og-image.png
git commit -m "feat: real site identity — title, meta, OG tags, favicon, social image"
```

---

### Task 7: Radar — true circle + React cleanup

**Files:**
- Modify: `src/styles/radar.css` (`.radar-circle` sizing)
- Modify: `src/components/RadarWindow.tsx`
- Create: `src/components/RadarWindow.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: RadarWindow with a stable 2s interval and derived `activeCount`; `.radar-circle` guaranteed circular. Phase 5's game reuses this circle geometry.

- [ ] **Step 1: Fix the CSS**

In `src/styles/radar.css`, find `.radar-circle` and replace only its **sizing** declarations (keep border, background, overflow, position etc.) with:

```css
.radar-circle {
  width: min(100%, 240px);
  aspect-ratio: 1 / 1;
  height: auto;
  margin: 0 auto;
  border-radius: 50%;
  /* ...existing non-sizing declarations stay... */
}
```

If `.radar-display` forces the circle to stretch (e.g. `align-items: stretch` or fixed heights), change it to center the circle: `display: flex; flex-direction: column; align-items: center;`. Verify in dev tools that the rendered box is exactly square at multiple window sizes.

- [ ] **Step 2: Write the failing test for the React cleanup**

`src/components/RadarWindow.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import RadarWindow from './RadarWindow'

describe('RadarWindow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('spawns targets over time using a single stable interval', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2) // < 0.3 → always spawn
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    render(<RadarWindow />)
    act(() => {
      vi.advanceTimersByTime(10_000) // 5 ticks
    })
    // interval registered exactly once (twice under StrictMode double-mount is
    // not at play here since render() mounts once)
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)
    // active count reflects spawned targets (cap is 5)
    const count = Number(screen.getByText('ACTIVE TARGETS:').nextElementSibling?.textContent)
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(5)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — current code recreates the interval whenever `nextId` changes (`setIntervalSpy` called many times).

- [ ] **Step 4: Refactor `RadarWindow.tsx`**

Replace the `nextId` state with a ref, empty the interval's dependency array, and derive `activeCount` instead of mirroring it in state:

```tsx
import { useState, useEffect, useRef } from "react"

interface RadarTarget {
  id: number
  x: number
  y: number
  size: number
  intensity: number
  isActive: boolean
  type: 'hostile' | 'friendly' | 'unknown'
}

export default function RadarWindow() {
  const [targets, setTargets] = useState<RadarTarget[]>([])
  const idRef = useRef(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setTargets(prev => {
        let newTargets = prev.map(target =>
          target.isActive && Math.random() < 0.1
            ? { ...target, isActive: false }
            : target
        )

        if (Math.random() < 0.3 && newTargets.filter(t => t.isActive).length < 5) {
          newTargets.push({
            id: idRef.current++,
            x: Math.random() * 0.8 + 0.1,
            y: Math.random() * 0.8 + 0.1,
            size: Math.random() * 2 + 1,
            intensity: Math.random() * 0.5 + 0.5,
            isActive: true,
            type: ['hostile', 'friendly', 'unknown'][Math.floor(Math.random() * 3)] as RadarTarget['type'],
          })
        }

        newTargets = newTargets.filter(target => target.isActive || Math.random() > 0.05)
        return newTargets
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const activeCount = targets.filter(t => t.isActive).length
  // ...getTargetColor and the JSX below are unchanged from the current file...
```

Keep the existing `getTargetColor` function and the entire returned JSX exactly as-is (it already reads `activeCount` and `targets`).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Visual check + commit**

`npm run dev` — radar is a perfect circle, sweep animates, targets appear/fade.

```bash
git add src/styles/radar.css src/components/RadarWindow.tsx src/components/RadarWindow.test.tsx
git commit -m "fix: radar renders as a true circle; stabilize spawn interval"
```

---

### Task 8: Window cascade + WindowManager/ResizableWindow cleanup

**Files:**
- Create: `src/lib/windowPlacement.ts`
- Create: `src/lib/windowPlacement.test.ts`
- Modify: `src/components/WindowManager.tsx`
- Modify: `src/components/ResizableWindow.tsx`
- Modify: `src/styles/windows.css` (touch-action)

**Interfaces:**
- Consumes: `WindowPosition` from `src/config/windowConfigs.ts`.
- Produces: `cascadePosition(openIndex: number, size: { width: number; height: number }): WindowPosition`; `ResizableWindow` gains a required `containerRef: React.RefObject<HTMLDivElement | null>` prop and uses pointer events. Phase 4 reuses none of the drag code (mobile has no draggable windows), but Phase 2+ windows all open through this cascade.

- [ ] **Step 1: Write the failing test**

`src/lib/windowPlacement.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cascadePosition } from './windowPlacement'

describe('cascadePosition', () => {
  const size = { width: 400, height: 300 }

  it('offsets each successive window by a fixed step', () => {
    expect(cascadePosition(0, size)).toEqual({ x: 24, y: 24, width: 400, height: 300 })
    expect(cascadePosition(1, size)).toEqual({ x: 56, y: 56, width: 400, height: 300 })
    expect(cascadePosition(3, size)).toEqual({ x: 120, y: 120, width: 400, height: 300 })
  })

  it('wraps back to the origin after 8 windows', () => {
    expect(cascadePosition(8, size)).toEqual(cascadePosition(0, size))
  })

  it('preserves the requested size', () => {
    expect(cascadePosition(2, { width: 500, height: 400 }).width).toBe(500)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './windowPlacement'`.

- [ ] **Step 3: Implement `src/lib/windowPlacement.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test` — PASS.

- [ ] **Step 5: Rewrite `WindowManager.tsx`**

Replace the whole file (changes: cascade on open, refs instead of `previousActiveWindows` state, z-counter ref, container ref passed down):

```tsx
import { useState, useEffect, useRef } from "react"
import ResizableWindow from "./ResizableWindow"
import { WINDOW_CONFIGS } from "../config/windowConfigs"
import type { WindowPosition } from "../config/windowConfigs"
import { cascadePosition } from "../lib/windowPlacement"

interface WindowManagerProps {
  activeWindows: string[]
  onCloseWindow: (windowId: string) => void
}

export default function WindowManager({ activeWindows, onCloseWindow }: WindowManagerProps) {
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>({})
  const [windowZIndexes, setWindowZIndexes] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const zCounterRef = useRef(100)
  const openCounterRef = useRef(0)
  const prevActiveRef = useRef<string[]>([])

  const updateWindowPosition = (windowId: string, position: Partial<WindowPosition>) => {
    setWindowPositions(prev => ({
      ...prev,
      [windowId]: { ...prev[windowId], ...position },
    }))
  }

  const bringWindowToFront = (windowId: string) => {
    zCounterRef.current += 1
    const z = zCounterRef.current
    setWindowZIndexes(prev => ({ ...prev, [windowId]: z }))
  }

  useEffect(() => {
    const newWindows = activeWindows.filter(
      id => id !== 'terminal' && !prevActiveRef.current.includes(id),
    )
    prevActiveRef.current = activeWindows

    newWindows.forEach(windowId => {
      const config = WINDOW_CONFIGS[windowId]
      if (!config) return
      const { width, height } = config.defaultPosition
      const pos = cascadePosition(openCounterRef.current, { width, height })
      openCounterRef.current += 1
      setWindowPositions(prev => ({ ...prev, [windowId]: pos }))
      bringWindowToFront(windowId)
    })
  }, [activeWindows])

  const renderWindow = (windowId: string) => {
    const config = WINDOW_CONFIGS[windowId]
    const position = windowPositions[windowId]
    if (!config || !position) return null

    const WindowComponent = config.component

    return (
      <ResizableWindow
        key={windowId}
        title={config.title}
        position={position}
        zIndex={windowZIndexes[windowId] ?? config.defaultZIndex}
        containerRef={containerRef}
        onPositionChange={(pos) => updateWindowPosition(windowId, pos)}
        onClose={() => onCloseWindow(windowId)}
        onClick={() => bringWindowToFront(windowId)}
      >
        <WindowComponent />
      </ResizableWindow>
    )
  }

  return (
    <div className="window-manager" ref={containerRef}>
      {activeWindows.filter(id => id !== 'terminal').map(renderWindow)}
    </div>
  )
}
```

Then in `src/styles/windows.css`, ensure `.window-manager` fills its parent and positions children:

```css
.window-manager {
  position: relative;
  width: 100%;
  height: 100%;
}
```

(Merge with existing `.window-manager` declarations; keep anything else already there.)

- [ ] **Step 6: Rewrite `ResizableWindow.tsx` — container ref + pointer events**

Replace the whole file:

```tsx
import { useState, useRef, useEffect, type PropsWithChildren } from "react"
import type { WindowPosition } from "../config/windowConfigs"

interface ResizableWindowProps extends PropsWithChildren {
  title: string
  position: WindowPosition
  zIndex: number
  containerRef: React.RefObject<HTMLDivElement | null>
  onPositionChange: (position: WindowPosition) => void
  onClose: () => void
  onClick: () => void
}

const MIN_W = 200
const MIN_H = 150

export default function ResizableWindow({
  title,
  position,
  zIndex,
  containerRef,
  onPositionChange,
  onClose,
  onClick,
  children,
}: ResizableWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const constrainPosition = (x: number, y: number, width: number, height: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x, y, width, height }

    const finalWidth = Math.min(width, containerRect.width - 20)
    const finalHeight = Math.min(height, containerRect.height - 20)
    const constrainedX = Math.max(0, Math.min(x, containerRect.width - finalWidth))
    const constrainedY = Math.max(0, Math.min(y, containerRect.height - finalHeight))
    return { x: constrainedX, y: constrainedY, width: finalWidth, height: finalHeight }
  }

  const handlePointerDown = (e: React.PointerEvent, type: 'drag' | 'resize', handle?: string) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()

    if (type === 'drag') {
      setIsDragging(true)
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        setDragOffset({
          x: e.clientX - (containerRect.left + position.x),
          y: e.clientY - (containerRect.top + position.y),
        })
      } else {
        setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    } else if (type === 'resize' && handle) {
      setIsResizing(true)
      setResizeHandle(handle)
    }
  }

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return

      if (isDragging) {
        const relativeX = e.clientX - dragOffset.x - containerRect.left
        const relativeY = e.clientY - dragOffset.y - containerRect.top
        const c = constrainPosition(relativeX, relativeY, position.width, position.height)
        onPositionChange({ x: c.x, y: c.y, width: c.width, height: c.height })
      } else if (isResizing && resizeHandle) {
        const rect = windowRef.current?.getBoundingClientRect()
        if (!rect) return

        let newWidth = position.width
        let newHeight = position.height
        let newX = position.x
        let newY = position.y

        switch (resizeHandle) {
          case 'se':
            newWidth = Math.max(MIN_W, e.clientX - rect.left)
            newHeight = Math.max(MIN_H, e.clientY - rect.top)
            break
          case 'sw':
            newWidth = Math.max(MIN_W, rect.right - e.clientX)
            newHeight = Math.max(MIN_H, e.clientY - rect.top)
            newX = position.x + (position.width - newWidth)
            break
          case 'ne':
            newWidth = Math.max(MIN_W, e.clientX - rect.left)
            newHeight = Math.max(MIN_H, rect.bottom - e.clientY)
            newY = position.y + (position.height - newHeight)
            break
          case 'nw':
            newWidth = Math.max(MIN_W, rect.right - e.clientX)
            newHeight = Math.max(MIN_H, rect.bottom - e.clientY)
            newX = position.x + (position.width - newWidth)
            newY = position.y + (position.height - newHeight)
            break
        }

        const c = constrainPosition(newX, newY, newWidth, newHeight)
        onPositionChange({ x: c.x, y: c.y, width: c.width, height: c.height })
      }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    }
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, isResizing, resizeHandle, dragOffset, position, onPositionChange])

  return (
    <div
      ref={windowRef}
      className="resizable-window"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        zIndex: isDragging || isResizing ? 1000 : zIndex,
      }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      <div
        className="window-titlebar"
        onPointerDown={(e) => handlePointerDown(e, 'drag')}
      >
        <div className="window-title">
          <div className="led green" />
          <span>{title}</span>
        </div>
        <button className="window-close" onClick={onClose}>×</button>
      </div>
      <div className="window-content">{children}</div>
      {(['se', 'sw', 'ne', 'nw'] as const).map(handle => (
        <div
          key={handle}
          className={`resize-handle ${handle}`}
          onPointerDown={(e) => handlePointerDown(e, 'resize', handle)}
        />
      ))}
    </div>
  )
}
```

Add to `src/styles/windows.css` (touch devices must not scroll while dragging):

```css
.window-titlebar,
.resize-handle {
  touch-action: none;
}
```

- [ ] **Step 7: Run all tests + lint + build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass. (If eslint flags the `constrainPosition` dependency in the effect, inline it into the effect or wrap it in `useCallback` — either is acceptable.)

- [ ] **Step 8: Manual verification**

`npm run dev`: open three windows — they cascade (24/24, 56/56, 88/88), don't stack at origin; dragging and all four resize corners work; clicking a window brings it to front; windows can't leave the container.

- [ ] **Step 9: Commit**

```bash
git add src/lib src/components/WindowManager.tsx src/components/ResizableWindow.tsx src/styles/windows.css
git commit -m "feat: cascade window placement; pointer events + ref-based bounds"
```

---

### Task 9: Stable terminal output handler

**Files:**
- Modify: `src/hooks/useTerminalOutput.ts`
- Create: `src/hooks/useTerminalOutput.test.ts`

**Interfaces:**
- Consumes: `getCommand`, `getAvailableCommands` from `src/config/commandConfigs.ts` (unchanged).
- Produces: same hook API (`{ output, handleCommand }`) — `handleCommand` no longer changes identity on every output update. Phase 2's parser replaces the internals of this hook; the API shape stays.

- [ ] **Step 1: Write the failing test**

`src/hooks/useTerminalOutput.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTerminalOutput } from './useTerminalOutput'

describe('useTerminalOutput', () => {
  it('echoes the command and reports unknown commands', () => {
    const { result } = renderHook(() => useTerminalOutput({}))
    act(() => result.current.handleCommand('warp9'))
    expect(result.current.output).toContain('> warp9')
    expect(result.current.output).toContain('Command not found: warp9')
  })

  it('opens windows through the callback', () => {
    const onOpenWindow = vi.fn()
    const { result } = renderHook(() => useTerminalOutput({ onOpenWindow }))
    act(() => result.current.handleCommand('projects'))
    expect(onOpenWindow).toHaveBeenCalledWith('projects')
  })

  it('clear resets to the banner', () => {
    const { result } = renderHook(() => useTerminalOutput({}))
    act(() => result.current.handleCommand('help'))
    act(() => result.current.handleCommand('clear'))
    expect(result.current.output[0]).toBe('GRANOF COMPUTER v4.12.16')
    expect(result.current.output).not.toContain('> help')
  })

  it('handleCommand identity is stable across outputs', () => {
    const { result } = renderHook(() => useTerminalOutput({}))
    const first = result.current.handleCommand
    act(() => result.current.handleCommand('help'))
    expect(result.current.handleCommand).toBe(first)
  })
})
```

- [ ] **Step 2: Run tests to verify the stability test fails**

Run: `npm test`
Expected: first three tests PASS against current code; the identity test FAILS (handler depends on `output`).

- [ ] **Step 3: Refactor to functional setState**

Replace the body of `useTerminalOutput.ts`:

```ts
import { useState, useCallback } from 'react'
import { getCommand, getAvailableCommands } from '../config/commandConfigs'

interface UseTerminalOutputProps {
  onOpenWindow?: (windowId: string) => void
}

const DEFAULT_OUTPUT = [
  "GRANOF COMPUTER v4.12.16",
  "Type 'help' for available commands.",
  ""
]

export function useTerminalOutput({ onOpenWindow }: UseTerminalOutputProps) {
  const [output, setOutput] = useState<string[]>(DEFAULT_OUTPUT)

  const handleCommand = useCallback((command: string) => {
    const commandConfig = getCommand(command)

    if (commandConfig?.action === 'clear') {
      setOutput(DEFAULT_OUTPUT)
      return
    }

    const lines: string[] = []
    if (!commandConfig) {
      lines.push(`Command not found: ${command}`, "Type 'help' for available commands.", "")
    } else if (commandConfig.action === 'help') {
      const commands = getAvailableCommands()
      lines.push(
        "Available commands:",
        ...commands.map(cmd => `  ${cmd.name.padEnd(10)} - ${cmd.description}`),
        ""
      )
    } else if (commandConfig.action === 'openWindow') {
      if (commandConfig.target && onOpenWindow) {
        onOpenWindow(commandConfig.target)
        lines.push(`Opening ${commandConfig.target} window...`, "")
      }
    } else if (commandConfig.action === 'custom') {
      if (commandConfig.customHandler) {
        commandConfig.customHandler()
        lines.push(`Executing ${command}...`, "")
      }
    }

    setOutput(prev => [...prev, `> ${command}`, ...lines])
  }, [onOpenWindow])

  return { output, handleCommand }
}
```

- [ ] **Step 4: Run tests to verify all pass**

Run: `npm test` — all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTerminalOutput.ts src/hooks/useTerminalOutput.test.ts
git commit -m "refactor: stable terminal command handler via functional setState"
```

---

### Task 10: CI + GitHub Pages auto-deploy

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `package.json` (remove `predeploy`/`deploy` scripts once Actions deploy works)

**Interfaces:**
- Consumes: `npm run lint`, `npm test`, `npm run build` from earlier tasks.
- Produces: every push runs lint → test → build; pushes to `main` deploy `dist/` to GitHub Pages. Replaces manual `npm run deploy`.

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        if: github.ref == 'refs/heads/main'
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: check
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: MANUAL STEP — switch Pages source (requires Jeff or `gh`)**

The repo currently deploys from the `gh-pages` branch. Switch it to Actions:

```bash
gh api repos/{owner}/{repo}/pages -X PUT -f build_type=workflow
```

(or in the GitHub UI: Settings → Pages → Source → "GitHub Actions"). The custom domain `jeffgranof.com` setting is preserved; `public/CNAME` continues to ship in `dist/` as a belt-and-braces.

- [ ] **Step 3: Push and verify the workflow**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: lint, test, build and deploy to Pages via GitHub Actions"
git push
gh run watch
```

Expected: `check` and `deploy` both green; https://jeffgranof.com serves the new build (check the page `<title>` is "Jeff Granof — Mission Control").

- [ ] **Step 4: Remove the manual deploy path**

Delete `"predeploy"` and `"deploy"` scripts from `package.json`, and remove the now-unused `gh-pages` dev dependency:

```bash
npm uninstall gh-pages
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: retire manual gh-pages deploy in favor of Actions"
git push
```

---

## Phase 1 Exit Criteria

- `npm test`, `npm run lint`, `npm run build` all green locally and in CI.
- Site deployed by Actions to jeffgranof.com with real title/favicon/OG tags.
- Radar is a true circle. Windows cascade and drag/resize via pointer events.
- Zero personal mock data rendered — placeholders are visibly bracketed.
- `git grep "TODO(jeff)" src/data/profile.ts` lists everything Jeff still owes.

**Next:** Phase 2 (Terminal 2.0) gets its own plan once Phase 1 ships.
