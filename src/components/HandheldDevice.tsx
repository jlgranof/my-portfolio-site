import { useState, useEffect } from "react"
import Terminal from "./Terminal"
import MissionLog from "./MissionLog"
import AboutWindow from "./windows/AboutWindow"
import ProjectsWindow from "./windows/ProjectsWindow"
import SkillsWindow from "./windows/SkillsWindow"
import ResumeWindow from "./windows/ResumeWindow"
import ContactWindow from "./windows/ContactWindow"
import DossierWindow from "./windows/DossierWindow"
import RadarDefense from "./RadarDefense"
import { getRandomMessage, processMessage } from "../data/missionLogMessages"
import { trackWindowOpen } from "../lib/commanderProfile"
import type { TerminalEngine } from "../hooks/useTerminalEngine"

type PanelId =
  | 'terminal' | 'about' | 'projects' | 'skills'
  | 'resume' | 'contact' | 'missionLog' | 'dossier' | 'defend'

const PANELS: Record<Exclude<PanelId, 'terminal' | 'defend'>, React.ComponentType> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  resume: ResumeWindow,
  contact: ContactWindow,
  missionLog: MissionLog,
  dossier: DossierWindow,
}

const BUTTONS: Array<[PanelId, string]> = [
  ['about', 'ABT'],
  ['projects', 'OPS'],
  ['skills', 'SKL'],
  ['resume', 'PRO'],
  ['contact', 'COM'],
  ['terminal', 'TRM'],
]

/** One-line rotating telemetry strip (the handheld's mission log lite). */
function Ticker() {
  const [line, setLine] = useState('FIELD OPS LINK ESTABLISHED')
  useEffect(() => {
    const interval = setInterval(() => {
      setLine(processMessage(getRandomMessage()))
    }, 3500)
    return () => clearInterval(interval)
  }, [])
  return <div className="handheld-ticker">{line}</div>
}

interface HandheldDeviceProps {
  engine: TerminalEngine
  openWindowRef: React.MutableRefObject<((windowId: string) => void) | null>
}

export default function HandheldDevice({ engine, openWindowRef }: HandheldDeviceProps) {
  const [panel, setPanel] = useState<PanelId>('terminal')

  // `defend` command fires this event
  useEffect(() => {
    const start = () => setPanel('defend')
    window.addEventListener('granof:defend', start)
    return () => window.removeEventListener('granof:defend', start)
  }, [])

  // Terminal commands (about, projects, decrypt→dossier…) switch panels here.
  const openWindow = (windowId: string) => {
    if (windowId in PANELS) setPanel(windowId as PanelId)
  }

  useEffect(() => {
    openWindowRef.current = openWindow
    return () => { openWindowRef.current = null }
  }, [openWindowRef])

  const Panel = panel === 'terminal' || panel === 'defend' ? null : PANELS[panel]

  return (
    <div className="handheld">
      <div className="handheld-plaque">
        <span className="main-text">FIELD OPS UNIT</span>
        <span className="sub-text">GRANOF STATION — REMOTE</span>
      </div>
      <Ticker />
      <div className="handheld-screen">
        {/* Terminal stays mounted so its output/state survives panel switches */}
        <div className={panel === 'terminal' ? 'handheld-panel' : 'handheld-panel hidden'}>
          <Terminal engine={engine} />
        </div>
        {panel === 'defend' && (
          <div className="handheld-panel">
            <RadarDefense onExit={() => setPanel('terminal')} />
          </div>
        )}
        {Panel && (
          <div className="handheld-panel">
            <Panel />
          </div>
        )}
      </div>
      <div className="handheld-buttons">
        {BUTTONS.map(([id, label]) => (
          <button
            key={id}
            className={`handheld-button ${panel === id ? 'active' : ''}`}
            onClick={() => {
              setPanel(id)
              if (id !== 'terminal') trackWindowOpen(id)
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="handheld-screws">
        <div className="screw tl" />
        <div className="screw tr" />
      </div>
    </div>
  )
}
