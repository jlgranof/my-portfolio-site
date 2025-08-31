import AboutWindow from "../components/windows/AboutWindow"
import ProjectsWindow from "../components/windows/ProjectsWindow"
import ResumeWindow from "../components/windows/ResumeWindow"
import ContactWindow from "../components/windows/ContactWindow"
import SkillsWindow from "../components/windows/SkillsWindow"
import MissionLog from "../components/MissionLog"

export interface WindowPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface WindowConfig {
  id: string
  title: string
  component: React.ComponentType
  defaultPosition: WindowPosition
  defaultZIndex: number
}

// Window configuration - easy to add/modify windows
export const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  about: {
    id: 'about',
    title: 'About',
    component: AboutWindow,
    defaultPosition: { x: 0, y: 0, width: 400, height: 300 },
    defaultZIndex: 100
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    component: ProjectsWindow,
    defaultPosition: { x: 0, y: 0, width: 500, height: 300 },
    defaultZIndex: 101
  },
  resume: {
    id: 'resume',
    title: 'Resume',
    component: ResumeWindow,
    defaultPosition: { x: 0, y: 0, width: 450, height: 300 },
    defaultZIndex: 102
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    component: ContactWindow,
    defaultPosition: { x: 0, y: 0, width: 350, height: 300 },
    defaultZIndex: 103
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    component: SkillsWindow,
    defaultPosition: { x: 0, y: 0, width: 400, height: 400 },
    defaultZIndex: 104
  },
  missionLog: {
    id: 'missionLog',
    title: 'Mission Log',
    component: MissionLog,
    defaultPosition: { x: 0, y: 0, width: 500, height: 400 },
    defaultZIndex: 105
  }
}

// Helper function to get all window IDs
export const getWindowIds = (): string[] => {
  return Object.keys(WINDOW_CONFIGS)
}

// Helper function to get a specific window config
export const getWindowConfig = (id: string): WindowConfig | undefined => {
  return WINDOW_CONFIGS[id]
}

// Helper function to check if a window ID is valid
export const isValidWindowId = (id: string): boolean => {
  return id in WINDOW_CONFIGS
}
