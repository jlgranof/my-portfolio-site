export default function ResumeWindow() {
  return (
    <div className="resume-window">
      <div className="resume-content">
        <h3>MISSION PROFILE</h3>
        
        <div className="resume-section">
          <h4>EXPERIENCE</h4>
          <div className="experience-item">
            <div className="experience-header">
              <span className="title">Senior Full Stack Developer</span>
              <span className="company">TechCorp Industries</span>
              <span className="period">2022 - Present</span>
            </div>
            <ul>
              <li>Led development of enterprise-scale applications</li>
              <li>Mentored junior developers and conducted code reviews</li>
              <li>Implemented CI/CD pipelines and DevOps practices</li>
            </ul>
          </div>
          
          <div className="experience-item">
            <div className="experience-header">
              <span className="title">Full Stack Developer</span>
              <span className="company">Digital Solutions Inc.</span>
              <span className="period">2020 - 2022</span>
            </div>
            <ul>
              <li>Built responsive web applications using React and Node.js</li>
              <li>Collaborated with design and product teams</li>
              <li>Optimized application performance and user experience</li>
            </ul>
          </div>
        </div>
        
        <div className="resume-section">
          <h4>EDUCATION</h4>
          <div className="education-item">
            <span className="degree">Bachelor of Science in Computer Science</span>
            <span className="school">University of Technology</span>
            <span className="year">2020</span>
          </div>
        </div>
        
        <div className="resume-section">
          <h4>CERTIFICATIONS</h4>
          <div className="certifications">
            <span className="cert">AWS Certified Developer</span>
            <span className="cert">Google Cloud Professional</span>
            <span className="cert">Certified Scrum Master</span>
          </div>
        </div>
        
        <div className="resume-actions">
          <a href="#" className="download-btn">DOWNLOAD FULL PROFILE</a>
        </div>
      </div>
    </div>
  )
}
