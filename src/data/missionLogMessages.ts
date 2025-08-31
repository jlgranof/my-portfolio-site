export type MessageType = 'info' | 'success' | 'system_warning' | 'mission_success' | 'mission_failed' | 'alert'

export interface LogMessage {
  message: string
  type: MessageType
  hasRandomNumber?: boolean
  numberRange?: [number, number]
}

// Helper function to generate random numbers
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to replace placeholders with random numbers
export const processMessage = (message: LogMessage): string => {
  if (!message.hasRandomNumber || !message.numberRange) {
    return message.message
  }
  
  const [min, max] = message.numberRange
  const randomNum = getRandomNumber(min, max)
  return message.message.replace('{N}', randomNum.toString())
}

export const MISSION_LOG_MESSAGES: LogMessage[] = [
  // INFO MESSAGES (normal color)
  { message: "SIGNAL STRENGTH: {N}%", type: 'info', hasRandomNumber: true, numberRange: [75, 99] },
  { message: "COMM LINK: ACTIVE", type: 'info' },
  { message: "DATA PACKET RECEIVED", type: 'info' },
  { message: "NETWORK LATENCY: {N}ms", type: 'info', hasRandomNumber: true, numberRange: [8, 45] },
  { message: "BACKUP SYSTEMS: ONLINE", type: 'info' },
  { message: "MEMORY USAGE: {N}%", type: 'info', hasRandomNumber: true, numberRange: [45, 85] },
  { message: "CPU UTILIZATION: {N}%", type: 'info', hasRandomNumber: true, numberRange: [30, 78] },
  { message: "DISK SPACE: {N}GB AVAILABLE", type: 'info', hasRandomNumber: true, numberRange: [125, 847] },
  { message: "ENVIRONMENTAL SCAN: IN PROGRESS", type: 'info' },
  { message: "SECURITY PROTOCOL: ACTIVE", type: 'info' },
  { message: "FIREWALL STATUS: OPERATIONAL", type: 'info' },
  { message: "ANTIVIRUS: UPDATED", type: 'info' },
  { message: "SYSTEM TIME: SYNCHRONIZED", type: 'info' },
  { message: "GPS COORDINATES: LOCKED", type: 'info' },
  { message: "SATELLITE LINK: ESTABLISHED", type: 'info' },
  { message: "DATA ENCRYPTION: ENABLED", type: 'info' },
  { message: "BACKUP POWER: READY", type: 'info' },
  { message: "COOLING SYSTEM: NOMINAL", type: 'info' },
  { message: "SENSOR ARRAY: CALIBRATED", type: 'info' },
  { message: "COMMUNICATION PROTOCOLS: LOADED", type: 'info' },

  // SUCCESS MESSAGES (green)
  { message: "POWER CORE: STABLE", type: 'success' },
  { message: "ENVIRONMENTAL: NOMINAL", type: 'success' },
  { message: "SYSTEM SCAN COMPLETE", type: 'success' },
  { message: "DATA TRANSFER: SUCCESSFUL", type: 'success' },
  { message: "BACKUP COMPLETE: {N} FILES", type: 'success', hasRandomNumber: true, numberRange: [150, 2047] },
  { message: "SECURITY SCAN: CLEAN", type: 'success' },
  { message: "UPDATE INSTALLED: VERSION {N}.{N}.{N}", type: 'success', hasRandomNumber: true, numberRange: [1, 9] },
  { message: "CONNECTION ESTABLISHED", type: 'success' },
  { message: "AUTHENTICATION: VERIFIED", type: 'success' },
  { message: "ENCRYPTION: COMPLETE", type: 'success' },
  { message: "SYSTEM OPTIMIZATION: FINISHED", type: 'success' },
  { message: "CACHE CLEARED: {N}MB FREED", type: 'success', hasRandomNumber: true, numberRange: [25, 156] },
  { message: "DATABASE: INTEGRITY CHECK PASSED", type: 'success' },
  { message: "NETWORK: OPTIMAL PERFORMANCE", type: 'success' },
  { message: "HARDWARE: ALL SYSTEMS GO", type: 'success' },
  { message: "SOFTWARE: UPDATED SUCCESSFULLY", type: 'success' },
  { message: "CONFIGURATION: SAVED", type: 'success' },
  { message: "BACKUP VERIFICATION: PASSED", type: 'success' },
  { message: "SYSTEM HEALTH: EXCELLENT", type: 'success' },

  // SYSTEM WARNING MESSAGES (red - computer stuff)
  { message: "MEMORY USAGE: {N}% - HIGH", type: 'system_warning', hasRandomNumber: true, numberRange: [85, 95] },
  { message: "CPU TEMPERATURE: {N}°C - ELEVATED", type: 'system_warning', hasRandomNumber: true, numberRange: [75, 89] },
  { message: "DISK SPACE: {N}GB REMAINING", type: 'system_warning', hasRandomNumber: true, numberRange: [5, 25] },
  { message: "NETWORK LATENCY: {N}ms - SLOW", type: 'system_warning', hasRandomNumber: true, numberRange: [50, 200] },
  { message: "BATTERY LEVEL: {N}% - LOW", type: 'system_warning', hasRandomNumber: true, numberRange: [10, 25] },
  { message: "FAN SPEED: {N}RPM - INCREASED", type: 'system_warning', hasRandomNumber: true, numberRange: [3000, 5000] },
  { message: "VOLTAGE FLUCTUATION: DETECTED", type: 'system_warning' },
  { message: "CACHE OVERFLOW: CLEANING REQUIRED", type: 'system_warning' },
  { message: "PROCESS QUEUE: BACKLOG DETECTED", type: 'system_warning' },
  { message: "SIGNAL INTERFERENCE: MINOR", type: 'system_warning' },
  { message: "BUFFER OVERFLOW: PREVENTED", type: 'system_warning' },
  { message: "THREAD CONFLICT: RESOLVED", type: 'system_warning' },
  { message: "MEMORY LEAK: DETECTED", type: 'system_warning' },
  { message: "DISK FRAGMENTATION: {N}%", type: 'system_warning', hasRandomNumber: true, numberRange: [15, 35] },
  { message: "NETWORK PACKET LOSS: {N}%", type: 'system_warning', hasRandomNumber: true, numberRange: [2, 8] },
  { message: "SYSTEM RESOURCES: STRESSED", type: 'system_warning' },
  { message: "BACKGROUND PROCESSES: EXCESSIVE", type: 'system_warning' },
  { message: "REGISTRY CORRUPTION: DETECTED", type: 'system_warning' },
  { message: "DRIVER CONFLICT: RESOLVED", type: 'system_warning' },
  { message: "SERVICE TIMEOUT: RECOVERED", type: 'system_warning' },
  { message: "CONNECTION DROPOUT: RECONNECTED", type: 'system_warning' },

  // MISSION SUCCESS MESSAGES (blue)
  { message: "MISSION ALPHA-{N}: COMPLETED SUCCESSFULLY", type: 'mission_success', hasRandomNumber: true, numberRange: [1, 999] },
  { message: "TARGET ACQUIRED: OBJECTIVE ACHIEVED", type: 'mission_success' },
  { message: "DATA EXTRACTION: {N}MB RECOVERED", type: 'mission_success', hasRandomNumber: true, numberRange: [50, 500] },
  { message: "SURVEILLANCE: TARGET TRACKED", type: 'mission_success' },
  { message: "INFILTRATION: SUCCESSFUL", type: 'mission_success' },
  { message: "EXFILTRATION: CLEAN EXIT", type: 'mission_success' },
  { message: "INTELLIGENCE GATHERED: {N} FILES", type: 'mission_success', hasRandomNumber: true, numberRange: [10, 100] },
  { message: "COMMUNICATION INTERCEPTED", type: 'mission_success' },
  { message: "SATELLITE DEPLOYMENT: ORBITAL", type: 'mission_success' },
  { message: "RECONNAISSANCE: AREA MAPPED", type: 'mission_success' },
  { message: "SIGNAL JAMMING: EFFECTIVE", type: 'mission_success' },
  { message: "COUNTER-INTELLIGENCE: SUCCESSFUL", type: 'mission_success' },
  { message: "CYBER OPERATION: COMPLETE", type: 'mission_success' },
  { message: "PHYSICAL SECURITY: BYPASSED", type: 'mission_success' },
  { message: "ENCRYPTION BREACH: SUCCESSFUL", type: 'mission_success' },
  { message: "BACKUP RECOVERY: {N}% COMPLETE", type: 'mission_success', hasRandomNumber: true, numberRange: [95, 100] },
  { message: "SYSTEM INTEGRATION: SEAMLESS", type: 'mission_success' },
  { message: "PROTOCOL OVERRIDE: SUCCESSFUL", type: 'mission_success' },
  { message: "ACCESS GRANTED: ADMIN LEVEL", type: 'mission_success' },
  { message: "FIREWALL PENETRATION: CLEAN", type: 'mission_success' },
  { message: "DATABASE INFILTRATION: SUCCESSFUL", type: 'mission_success' },
  { message: "NETWORK DOMINANCE: ACHIEVED", type: 'mission_success' },
  { message: "SURVEILLANCE FEED: ACTIVE", type: 'mission_success' },
  { message: "COUNTERMEASURES: NEUTRALIZED", type: 'mission_success' },
  { message: "STEALTH OPERATION: UNDETECTED", type: 'mission_success' },

  // MISSION FAILED MESSAGES (purple)
  { message: "MISSION BETA-{N}: FAILED", type: 'mission_failed', hasRandomNumber: true, numberRange: [1, 999] },
  { message: "TARGET LOST: TRACKING FAILED", type: 'mission_failed' },
  { message: "ACCESS DENIED: INSUFFICIENT PRIVILEGES", type: 'mission_failed' },
  { message: "CONNECTION TIMEOUT: ABORTED", type: 'mission_failed' },
  { message: "ENCRYPTION BREAK: FAILED", type: 'mission_failed' },
  { message: "FIREWALL: IMPENETRABLE", type: 'mission_failed' },
  { message: "SURVEILLANCE: TARGET EVADED", type: 'mission_failed' },
  { message: "INFILTRATION: DETECTED", type: 'mission_failed' },
  { message: "EXFILTRATION: COMPROMISED", type: 'mission_failed' },
  { message: "SIGNAL JAMMING: INEFFECTIVE", type: 'mission_failed' },
  { message: "COUNTER-INTELLIGENCE: FAILED", type: 'mission_failed' },
  { message: "CYBER OPERATION: BLOCKED", type: 'mission_failed' },
  { message: "PHYSICAL SECURITY: IMPASSABLE", type: 'mission_failed' },
  { message: "BACKUP RECOVERY: {N}% FAILED", type: 'mission_failed', hasRandomNumber: true, numberRange: [15, 85] },
  { message: "SYSTEM INTEGRATION: INCOMPATIBLE", type: 'mission_failed' },
  { message: "PROTOCOL OVERRIDE: DENIED", type: 'mission_failed' },
  { message: "ACCESS REVOKED: SECURITY BREACH", type: 'mission_failed' },
  { message: "DATABASE INFILTRATION: BLOCKED", type: 'mission_failed' },
  { message: "NETWORK DOMINANCE: LOST", type: 'mission_failed' },
  { message: "SURVEILLANCE FEED: DISRUPTED", type: 'mission_failed' },
  { message: "COUNTERMEASURES: OVERWHELMING", type: 'mission_failed' },
  { message: "STEALTH OPERATION: COMPROMISED", type: 'mission_failed' },
  { message: "INTELLIGENCE GATHERING: INCOMPLETE", type: 'mission_failed' },
  { message: "COMMUNICATION INTERCEPT: FAILED", type: 'mission_failed' },
  { message: "SATELLITE DEPLOYMENT: ABORTED", type: 'mission_failed' },
  { message: "RECONNAISSANCE: AREA UNKNOWN", type: 'mission_failed' },
  { message: "DATA EXTRACTION: CORRUPTED", type: 'mission_failed' },
  { message: "TARGET ACQUISITION: MISSED", type: 'mission_failed' },

  // ALERT MESSAGES (ALL CAPS FLASHING RED)
  { message: "INCOMING ATTACK: MULTIPLE THREATS DETECTED", type: 'alert' },
  { message: "NATURAL DISASTER: SEISMIC ACTIVITY DETECTED", type: 'alert' },
  { message: "CYBER ATTACK: FIREWALL BREACH IMMINENT", type: 'alert' },
  { message: "SYSTEM OVERLOAD: CRITICAL FAILURE", type: 'alert' },
  { message: "UNAUTHORIZED ACCESS: SECURITY BREACH", type: 'alert' },
  { message: "VIRUS DETECTED: QUARANTINE REQUIRED", type: 'alert' },
  { message: "POWER SURGE: EMERGENCY SHUTDOWN", type: 'alert' },
  { message: "METEOR SHOWER: SHIELD ACTIVATION", type: 'alert' },
  { message: "SOLAR FLARE: RADIATION SHIELDING", type: 'alert' },
  { message: "GRAVITY ANOMALY: STABILIZATION REQUIRED", type: 'alert' },
  { message: "QUANTUM FLUX: REALITY DISTORTION", type: 'alert' },
  { message: "TIME DILATION: TEMPORAL SHIFT", type: 'alert' },
  { message: "DIMENSIONAL RIFT: CONTAINMENT BREACH", type: 'alert' },
  { message: "PLASMA STORM: MAGNETIC SHIELDING", type: 'alert' },
  { message: "ANTIMATTER DETECTED: EVACUATION PROTOCOL", type: 'alert' },
  { message: "NEUTRON BOMBARDMENT: RADIATION ALERT", type: 'alert' },
  { message: "COSMIC RAYS: SHIELDING INSUFFICIENT", type: 'alert' },
  { message: "BLACK HOLE PROXIMITY: GRAVITY WELL", type: 'alert' },
  { message: "WORMHOLE ACTIVATION: SPATIAL DISTORTION", type: 'alert' },
  { message: "DARK MATTER INTERACTION: UNKNOWN EFFECTS", type: 'alert' },
  { message: "QUANTUM ENTANGLEMENT: REALITY SHIFT", type: 'alert' },
  { message: "TEMPORAL PARADOX: TIMELINE CORRUPTION", type: 'alert' },
  { message: "DIMENSIONAL COLLAPSE: SPACE-TIME FRACTURE", type: 'alert' },
  { message: "REALITY ANOMALY: PHYSICS VIOLATION", type: 'alert' },
  { message: "EXISTENTIAL THREAT: IMMEDIATE ACTION REQUIRED", type: 'alert' },
  { message: "UNIVERSAL CONSTANT SHIFT: CALIBRATION LOST", type: 'alert' },
  { message: "QUANTUM DECOHERENCE: OBSERVER EFFECT", type: 'alert' },
  { message: "TEMPORAL LOOP: CAUSALITY BREACH", type: 'alert' },
  { message: "DIMENSIONAL INVASION: HOSTILE ENTITIES", type: 'alert' },
  { message: "REALITY FABRIC TEAR: SPACE-TIME DAMAGE", type: 'alert' },
  { message: "EXISTENTIAL CRISIS: REALITY QUESTIONED", type: 'alert' },
  { message: "UNIVERSAL RESET: ALL SYSTEMS FAILING", type: 'alert' },
  { message: "QUANTUM CATASTROPHE: PROBABILITY COLLAPSE", type: 'alert' },
  { message: "TEMPORAL ARMAGEDDON: TIME ITSELF ENDS", type: 'alert' },
  { message: "DIMENSIONAL APOCALYPSE: REALITY DESTROYED", type: 'alert' },
  { message: "FINAL ALERT: EXISTENCE TERMINATED", type: 'alert' }
]

// Helper function to get random message
export const getRandomMessage = (): LogMessage => {
  return MISSION_LOG_MESSAGES[Math.floor(Math.random() * MISSION_LOG_MESSAGES.length)]
}

// Helper function to get messages by type
export const getMessagesByType = (type: MessageType): LogMessage[] => {
  return MISSION_LOG_MESSAGES.filter(msg => msg.type === type)
}
