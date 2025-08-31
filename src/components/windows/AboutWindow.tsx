export default function AboutWindow() {
  return (
    <div className="about-window">
      <div className="about-content">
        <h3>MISSION BRIEFING</h3>
        <p>
          Greetings, Commander. I am Jeff Granof, a Full Stack Developer with a passion 
          for creating innovative digital solutions. My mission is to build robust, 
          scalable applications that solve real-world problems.
        </p>
        
        <h4>SPECIALIZATIONS:</h4>
        <ul>
          <li>Frontend Development (React, TypeScript)</li>
          <li>Backend Development (Node.js, Python)</li>
          <li>Database Design & Management</li>
          <li>Cloud Infrastructure (AWS, Azure)</li>
          <li>DevOps & CI/CD Pipelines</li>
        </ul>
        
        <h4>MISSION OBJECTIVES:</h4>
        <ul>
          <li>Deliver high-quality, maintainable code</li>
          <li>Collaborate effectively in agile environments</li>
          <li>Stay current with emerging technologies</li>
          <li>Mentor junior developers</li>
        </ul>
        
        <div className="status-indicator">
          <span className="label">STATUS:</span>
          <span className="value active">MISSION READY</span>
        </div>
      </div>
    </div>
  )
}
