import NamePlate from "./NamePlate"
import RadarWindow from "./RadarWindow"
import TelemetryWindow from "./TelemetryWindow"

export default function LeftPanel() {
  return (
    <div className="left-panel">
      <NamePlate />
      <RadarWindow />
      <TelemetryWindow />
    </div>
  )
}
