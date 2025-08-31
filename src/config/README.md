# Window Configuration System

This directory contains the configuration for the reusable window system in the portfolio site.

## How to Add a New Window

Adding a new window is now simple and requires only a few steps:

### 1. Create the Window Component

Create a new React component in `src/components/windows/`:

```tsx
// src/components/windows/MyNewWindow.tsx
export default function MyNewWindow() {
  return (
    <div className="my-new-window">
      <div className="my-new-content">
        <h3>MY NEW WINDOW</h3>
        <p>Your content here...</p>
      </div>
    </div>
  )
}
```

### 2. Add to Window Configuration

Import your component and add it to the `WINDOW_CONFIGS` in `src/config/windowConfigs.ts`:

```tsx
import MyNewWindow from "../components/windows/MyNewWindow"

export const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  // ... existing windows ...
  myNewWindow: {
    id: 'myNewWindow',
    title: 'My New Window',
    component: MyNewWindow,
    defaultPosition: { x: 0, y: 0, width: 400, height: 300 },
    defaultZIndex: 105  // Make sure this is unique and higher than existing
  }
}
```

### 3. Add Terminal Command (Optional)

If you want the window to be accessible via terminal command, add it to `src/config/commandConfigs.ts`:

```tsx
export const COMMAND_CONFIGS: Record<string, CommandConfig> = {
  // ... existing commands ...
  myNewWindow: {
    name: 'myNewWindow',
    description: 'Open my new window',
    action: 'openWindow',
    target: 'myNewWindow'
  }
}
```

### 4. Update Navigation (if needed)

If you want the window to be accessible from the navigation, update the component that handles window opening (likely in your main App or navigation component).

## Architecture Overview

The system follows a clean separation of concerns with modular hooks:

### Terminal Architecture
- **Terminal Component**: Clean UI component that uses custom hooks
- **useTerminal**: Combined hook providing all terminal functionality
- **useTerminalOutput**: Manages command processing and output
- **useTerminalInput**: Manages input state and interactions
- **useTerminalCursor**: Manages cursor blinking animation
- **useTerminalScroll**: Manages output scrolling

### Window Management
- **RightPanel**: Coordinates between Terminal and WindowManager
- **WindowManager**: Renders windows based on configuration
- **Config Files**: Define available windows and commands

### Mission Log System
- **MissionLog Component**: Displays real-time mission log entries
- **Message System**: 100+ different messages across 6 types
- **Random Number Generation**: Dynamic content for variety
- **Message Types**: info, success, system_warning, mission_success, mission_failed, alert

## Window Configuration Options

Each window configuration includes:

- **id**: Unique identifier for the window
- **title**: Display title in the window titlebar
- **component**: React component to render inside the window
- **defaultPosition**: Initial position and size `{ x, y, width, height }`
- **defaultZIndex**: Initial z-index for layering

## Command Configuration Options

Each command configuration includes:

- **name**: Command name (what user types)
- **description**: Help text description
- **action**: Type of action ('openWindow', 'clear', 'help', 'custom')
- **target**: Window ID (for 'openWindow' actions)
- **customHandler**: Custom function (for 'custom' actions)

## Mission Log Message Types

The Mission Log system includes 6 different message types with distinct styling:

1. **info** (Normal color): System status and routine operations
2. **success** (Green): Successful operations and positive status
3. **system_warning** (Red): Computer system warnings and issues
4. **mission_success** (Blue): Successful mission operations
5. **mission_failed** (Purple): Failed mission operations
6. **alert** (Flashing Red): Critical alerts and emergencies

### Message Features
- **100+ Unique Messages**: Wide variety of content
- **Random Number Generation**: Dynamic values for realism
- **Type-Specific Styling**: Visual distinction between message types
- **Real-time Updates**: Continuous log streaming
- **Alert Animations**: Flashing effects for critical messages

## Available Hooks

### Terminal Hooks
- `useTerminal()`: Combined hook for all terminal functionality
- `useTerminalOutput()`: Command processing and output management
- `useTerminalInput()`: Input state and interactions
- `useTerminalCursor()`: Cursor blinking animation
- `useTerminalScroll()`: Output scrolling behavior

### Helper Functions

#### Window Helpers
- `getWindowIds()`: Returns array of all window IDs
- `getWindowConfig(id)`: Returns config for a specific window
- `isValidWindowId(id)`: Checks if a window ID exists

#### Command Helpers
- `getAvailableCommands()`: Returns array of all command configs
- `getCommand(name)`: Returns config for a specific command
- `isValidCommand(name)`: Checks if a command exists

#### Mission Log Helpers
- `getRandomMessage()`: Returns a random message from the system
- `processMessage(message)`: Processes message with random numbers
- `getMessagesByType(type)`: Returns all messages of a specific type

## Benefits

- **Modular Hooks**: Each piece of functionality is in its own hook
- **Reusable**: Hooks can be used independently or together
- **Self-contained Terminal**: Terminal handles all its own logic
- **Clean Props**: Terminal just receives `onOpenWindow` function
- **Comprehensive Mission Log**: 100+ messages with 6 distinct types
- **Dynamic Content**: Random numbers ensure variety
- **Easy to add**: Just create component + add to configs
- **Type-safe**: Full TypeScript support
- **Consistent**: All windows and commands follow the same pattern
- **Maintainable**: Centralized configuration
- **Flexible**: Easy to modify positions, titles, commands, etc.

## Example Usage

### Using the Terminal Component
```tsx
<Terminal onOpenWindow={handleOpenWindow} />
```

### Using Individual Hooks
```tsx
const { output, handleCommand } = useTerminalOutput({ onOpenWindow })
const { input, inputRef, clearInput } = useTerminalInput()
const cursorVisible = useTerminalCursor()
```

### Using the Combined Hook
```tsx
const {
  output,
  handleCommand,
  input,
  inputRef,
  clearInput,
  cursorVisible
} = useTerminal({ onOpenWindow })
```

### Mission Log Messages
```tsx
import { getRandomMessage, processMessage } from '../data/missionLogMessages'

const message = getRandomMessage()
const processedMessage = processMessage(message)
console.log(processedMessage) // "SIGNAL STRENGTH: 87%"
```

### Configuration Helpers
```tsx
import { getWindowIds, isValidWindowId } from '../config/windowConfigs'
import { getAvailableCommands, isValidCommand } from '../config/commandConfigs'

// Check if a window exists
if (isValidWindowId('missionLog')) {
  // Open the mission log window
}

// Get all available window IDs
const allWindows = getWindowIds() // ['about', 'projects', 'resume', 'contact', 'skills', 'missionLog']

// Check if a command exists
if (isValidCommand('missionLog')) {
  // Command is valid
}

// Get all available commands
const allCommands = getAvailableCommands()
```
