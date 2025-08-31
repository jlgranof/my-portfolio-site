import type { PropsWithChildren } from "react"

interface ScreenProps extends PropsWithChildren {
  className?: string;
}

export default function Screen({ children, className }: ScreenProps) {
  return (
    <div className={`screen ${className || ''}`}>
      {children}
      <div className="glass" />
      <div className="noise" />
    </div>
  )
}
