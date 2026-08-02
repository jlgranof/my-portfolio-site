import { profile } from "../../data/profile"

export default function AboutWindow() {
  const { briefing, specializations, objectives } = profile.about
  return (
    <div className="about-window">
      <div className="about-content">
        <h3>MISSION BRIEFING</h3>
        <p>{briefing}</p>
        <h4>SPECIALIZATIONS:</h4>
        <ul>{specializations.map(s => <li key={s}>{s}</li>)}</ul>
        <h4>MISSION OBJECTIVES:</h4>
        <ul>{objectives.map(o => <li key={o}>{o}</li>)}</ul>
        <div className="status-indicator">
          <span className="label">STATUS:</span>
          <span className="value active">MISSION READY</span>
        </div>
      </div>
    </div>
  )
}
