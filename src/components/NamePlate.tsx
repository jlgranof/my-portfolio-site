export default function NamePlate() {
  return (
    <div className="name-plate">
      <div className="name-plate-header">
        <div style={{ margin: '5px' }} className="led green" />
        <span style={{ padding: '10px' }}>ENGINEER IDENTITY</span>
      </div>
      <div className="name-plate-content">
        <div className="field">
          <span className="label">NAME:</span>
          <span className="value">Jeff Granof</span>
        </div>
        <div className="field">
          <span className="label">RANK:</span>
          <span className="value">Full Stack Engineer</span>
        </div>
        <div className="field">
          <span className="label">CLEARANCE:</span>
          <span className="value">Above Top Secret</span>
        </div>
        <div className="field">
          <span className="label">STATUS:</span>
          <span className="value">ACTIVE</span>
        </div>
      </div>
    </div>
  )
}
