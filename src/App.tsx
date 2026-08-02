import { useState, useRef } from "react"
import RoomBackground from "./components/RoomBackground"
import Monitor from "./components/Monitor"
import Screen from "./components/Screen"
import MissionControl from "./components/MissionControl"
import BootSequence from "./components/BootSequence"
import HandheldDevice from "./components/HandheldDevice"
import { useIsHandheld } from "./hooks/useIsHandheld"
import { useTerminalEngine } from "./hooks/useTerminalEngine"

const alreadyBooted = (): boolean => {
  try {
    if (sessionStorage.getItem('granof-booted') === '1') return true
  } catch { /* private browsing — boot every load */ }
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

function App() {
  const [booted, setBooted] = useState(alreadyBooted)
  const handheld = useIsHandheld()

  // The active shell (desktop or handheld) registers its window-opener here, so
  // the terminal engine — and all its state — survives crossing the breakpoint.
  const openWindowRef = useRef<((windowId: string) => void) | null>(null)
  const engine = useTerminalEngine({ onOpenWindow: (id) => openWindowRef.current?.(id) })

  const finishBoot = () => {
    try { sessionStorage.setItem('granof-booted', '1') } catch { /* ignore */ }
    setBooted(true)
  }

  if (handheld) {
    return (
      <div className="handheld-root">
        {booted ? <HandheldDevice engine={engine} openWindowRef={openWindowRef} /> : <BootSequence onDone={finishBoot} />}
      </div>
    )
  }

  return (
    <>
      <RoomBackground />
      <Monitor>
        <Screen>
          {booted ? <MissionControl engine={engine} openWindowRef={openWindowRef} /> : <BootSequence onDone={finishBoot} />}
        </Screen>
      </Monitor>
    </>
  )
}

export default App
