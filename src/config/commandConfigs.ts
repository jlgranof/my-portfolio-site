export interface CommandConfig {
  name: string
  description: string
  action: 'openWindow' | 'clear' | 'help' | 'custom'
  target?: string // for openWindow actions
  customHandler?: () => void // for custom actions
}

export const COMMAND_CONFIGS: Record<string, CommandConfig> = {
  help: {
    name: 'help',
    description: 'Show this help message',
    action: 'help'
  },
  about: {
    name: 'about',
    description: 'Open about window',
    action: 'openWindow',
    target: 'about'
  },
  projects: {
    name: 'projects',
    description: 'Open projects window',
    action: 'openWindow',
    target: 'projects'
  },
  resume: {
    name: 'resume',
    description: 'Open resume window',
    action: 'openWindow',
    target: 'resume'
  },
  contact: {
    name: 'contact',
    description: 'Open contact window',
    action: 'openWindow',
    target: 'contact'
  },
  skills: {
    name: 'skills',
    description: 'Open skills window',
    action: 'openWindow',
    target: 'skills'
  },
  missionLog: {
    name: 'missionLog',
    description: 'Open mission log',
    action: 'openWindow',
    target: 'missionLog'
  },
  clear: {
    name: 'clear',
    description: 'Clear terminal',
    action: 'clear'
  }
}

// Helper function to get all available commands
export const getAvailableCommands = (): CommandConfig[] => {
  return Object.values(COMMAND_CONFIGS)
}

// Helper function to get a specific command
export const getCommand = (commandName: string): CommandConfig | undefined => {
  return COMMAND_CONFIGS[commandName.toLowerCase()]
}

// Helper function to check if a command exists
export const isValidCommand = (commandName: string): boolean => {
  return commandName.toLowerCase() in COMMAND_CONFIGS
}
