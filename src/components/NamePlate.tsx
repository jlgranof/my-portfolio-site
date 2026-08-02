import { profile } from "../data/profile"

export default function NamePlate() {
  const { name, rank, clearance, status } = profile.identity
  const fields = [
    ["NAME:", name],
    ["RANK:", rank],
    ["CLEARANCE:", clearance],
    ["STATUS:", status],
  ] as const
  return (
    <div className="name-plate">
      <div className="name-plate-header">
        <div style={{ margin: '5px' }} className="led green" />
        <span style={{ padding: '10px' }}>ENGINEER IDENTITY</span>
      </div>
      <div className="name-plate-content">
        {fields.map(([label, value]) => (
          <div className="field" key={label}>
            <span className="label">{label}</span>
            <span className="value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
