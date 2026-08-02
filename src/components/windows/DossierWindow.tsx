import { profile } from "../../data/profile"

export default function DossierWindow() {
  return (
    <div className="about-window">
      <div className="about-content">
        <h3>RECOVERED DOSSIER — EYES ONLY</h3>
        <p>{profile.dossier}</p>
        <div className="status-indicator">
          <span className="label">CLEARANCE:</span>
          <span className="value active">EARNED, NOT GRANTED</span>
        </div>
      </div>
    </div>
  )
}
