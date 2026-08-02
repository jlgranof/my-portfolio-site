import { profile } from "../../data/profile"

export default function ResumeWindow() {
  const { experience, education, certifications, downloadUrl } = profile.resume
  return (
    <div className="resume-window">
      <div className="resume-content">
        <h3>MISSION PROFILE</h3>

        <div className="resume-section">
          <h4>EXPERIENCE</h4>
          {experience.map(item => (
            <div className="experience-item" key={`${item.company}-${item.period}`}>
              <div className="experience-header">
                <span className="title">{item.title}</span>
                <span className="company">{item.company}</span>
                <span className="period">{item.period}</span>
              </div>
              <ul>{item.highlights.map(h => <li key={h}>{h}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <h4>EDUCATION</h4>
          {education.map(item => (
            <div className="education-item" key={`${item.school}-${item.year}`}>
              <span className="degree">{item.degree}</span>
              <span className="school">{item.school}</span>
              <span className="year">{item.year}</span>
            </div>
          ))}
        </div>

        {certifications.length > 0 && (
          <div className="resume-section">
            <h4>CERTIFICATIONS</h4>
            <div className="certifications">
              {certifications.map(cert => <span key={cert} className="cert">{cert}</span>)}
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="resume-actions">
            <a href={downloadUrl} className="download-btn" download>DOWNLOAD FULL PROFILE</a>
          </div>
        )}
      </div>
    </div>
  )
}
