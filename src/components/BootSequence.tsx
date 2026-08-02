import { useState, useEffect } from "react"

const BOOT_LINES = [
  'GRANOF COMPUTER v4.12.16',
  'BIOS SELF-TEST ............ OK',
  'MEMORY 64K ................ OK',
  'PHOSPHOR ARRAY ............ OK',
  'RADAR UPLINK .............. SYNCED',
  'CLASSIFIED ARCHIVE ........ SEALED',
  'MISSION CONTROL ........... ONLINE',
]

interface BootSequenceProps {
  onDone: () => void
}

export default function BootSequence({ onDone }: BootSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount >= BOOT_LINES.length) {
      const t = setTimeout(onDone, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleCount(c => c + 1), 320)
    return () => clearTimeout(t)
  }, [visibleCount, onDone])

  useEffect(() => {
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  return (
    <div className="boot-sequence" role="status" aria-label="System booting">
      <div className="boot-lines">
        {BOOT_LINES.slice(0, visibleCount).map(line => (
          <div key={line} className="boot-line">{line}</div>
        ))}
        <span className="cursor blinking">█</span>
      </div>
      <div className="boot-skip">press any key to skip</div>
    </div>
  )
}
