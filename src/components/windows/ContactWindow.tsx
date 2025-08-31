export default function ContactWindow() {
  return (
    <div className="contact-window">
      <div className="contact-content">
        <h3>COMMUNICATIONS CHANNEL</h3>
        
        <div className="contact-section">
          <h4>PRIMARY CONTACTS</h4>
          <div className="contact-item">
            <span className="label">EMAIL:</span>
            <a href="mailto:jeff@example.com" className="value">jeff@example.com</a>
          </div>
          <div className="contact-item">
            <span className="label">PHONE:</span>
            <a href="tel:+1234567890" className="value">+1 (234) 567-890</a>
          </div>
          <div className="contact-item">
            <span className="label">LOCATION:</span>
            <span className="value">San Francisco, CA</span>
          </div>
        </div>
        
        <div className="contact-section">
          <h4>DIGITAL PRESENCE</h4>
          <div className="social-links">
            <a href="#" className="social-link">
              <span className="platform">GitHub</span>
              <span className="handle">@jeffgranof</span>
            </a>
            <a href="#" className="social-link">
              <span className="platform">LinkedIn</span>
              <span className="handle">/in/jeffgranof</span>
            </a>
            <a href="#" className="social-link">
              <span className="platform">Twitter</span>
              <span className="handle">@jeffgranof</span>
            </a>
            <a href="#" className="social-link">
              <span className="platform">Portfolio</span>
              <span className="handle">jeffgranof.dev</span>
            </a>
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
              <span className="value">Within 24 hours</span>
            </div>
          </div>
        </div>
        
        <div className="contact-actions">
          <a href="mailto:jeff@example.com" className="contact-btn primary">
            INITIATE COMMUNICATION
          </a>
          <a href="#" className="contact-btn secondary">
            SCHEDULE BRIEFING
          </a>
        </div>
      </div>
    </div>
  )
}
