export default function SkillsWindow() {
  return (
    <div className="skills-window">
      <div className="skills-content">
        <h3>TECHNICAL SKILLS</h3>
        
        <h4>LANGUAGES:</h4>
        <ul>
          <li>JavaScript/TypeScript</li>
          <li>Python</li>
          <li>Java</li>
          <li>SQL</li>
          <li>HTML/CSS</li>
        </ul>
        
        <h4>FRAMEWORKS & LIBRARIES:</h4>
        <ul>
          <li>React & React Native</li>
          <li>Node.js & Express</li>
          <li>Django & Flask</li>
          <li>Vue.js</li>
          <li>Next.js</li>
        </ul>
        
        <h4>TOOLS & TECHNOLOGIES:</h4>
        <ul>
          <li>Git & GitHub</li>
          <li>Docker & Kubernetes</li>
          <li>AWS & Azure</li>
          <li>MongoDB & PostgreSQL</li>
          <li>Jenkins & GitHub Actions</li>
        </ul>
        
        <div className="status-indicator">
          <span className="label">SKILL LEVEL:</span>
          <span className="value active">EXPERT</span>
        </div>
      </div>
    </div>
  )
}
