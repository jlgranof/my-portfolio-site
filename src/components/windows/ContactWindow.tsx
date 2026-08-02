import { profile } from "../../data/profile"

export default function ContactWindow() {
  const { email, location, responseTime, social } = profile.contact
  return (
    <div className="contact-window">
      <div className="contact-content">
        <h3>COMMUNICATIONS CHANNEL</h3>

        <div className="contact-section">
          <h4>PRIMARY CONTACTS</h4>
          <div className="contact-item">
            <span className="label">EMAIL:</span>
            {email ? (
              <a href={`mailto:${email}`} className="value">{email}</a>
            ) : (
              <span className="value">[CHANNEL PENDING]</span>
            )}
          </div>
          {location && (
            <div className="contact-item">
              <span className="label">LOCATION:</span>
              <span className="value">{location}</span>
            </div>
          )}
        </div>

        <div className="contact-section">
          <h4>DIGITAL PRESENCE</h4>
          <div className="social-links">
            {social.map(link => (
              <a key={link.platform} href={link.url} className="social-link" target="_blank" rel="noreferrer">
                <span className="platform">{link.platform}</span>
                <span className="handle">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-section">
          <h4>AVAILABILITY</h4>
          <div className="availability">
            <div className="status-indicator">
              <span className="label">STATUS:</span>
              <span className="value available">AVAILABLE FOR MISSIONS</span>
            </div>
            <div className="response-time">
              <span className="label">RESPONSE TIME:</span>
              <span className="value">{responseTime}</span>
            </div>
          </div>
        </div>

        {email && (
          <div className="contact-actions">
            <a href={`mailto:${email}`} className="contact-btn primary">
              INITIATE COMMUNICATION
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
