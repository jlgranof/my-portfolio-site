import NamePlate from "./NamePlate"
import RadarWindow from "./RadarWindow"
import MissionLog from "./MissionLog"

export default function LeftPanel() {
  return (
    <div className="left-panel">
      <NamePlate />
      <RadarWindow />
      <MissionLog />
    </div>
  )
}
