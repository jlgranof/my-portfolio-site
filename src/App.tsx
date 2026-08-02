import { useState } from "react"
import RoomBackground from "./components/RoomBackground"
import Monitor from "./components/Monitor"
import Screen from "./components/Screen"
import MissionControl from "./components/MissionControl"
import BootSequence from "./components/BootSequence"
import HandheldDevice from "./components/HandheldDevice"
import { useIsHandheld } from "./hooks/useIsHandheld"

const alreadyBooted = (): boolean => {
  try {
    if (sessionStorage.getItem('granof-booted') === '1') return true
  } catch { /* private browsing — boot every load */ }
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

function App() {
  const [booted, setBooted] = useState(alreadyBooted)
  const handheld = useIsHandheld()

  const finishBoot = () => {
    try { sessionStorage.setItem('granof-booted', '1') } catch { /* ignore */ }
    setBooted(true)
  }

  if (handheld) {
    return (
      <div className="handheld-root">
        {booted ? <HandheldDevice /> : <BootSequence onDone={finishBoot} />}
      </div>
    )
  }

  return (
    <>
      <RoomBackground />
      <Monitor>
        <Screen>
          {booted ? <MissionControl /> : <BootSequence onDone={finishBoot} />}
        </Screen>
      </Monitor>
    </>
  )
}

export default App
