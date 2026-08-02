import { profile } from "../../data/profile"

export default function ProjectsWindow() {
  return (
    <div className="projects-window">
      <div className="projects-content">
        <h3>ACTIVE MISSIONS</h3>
        <div className="projects-grid">
          {profile.projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h4>{project.name}</h4>
                <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tech.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              {project.link ? (
                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                  VIEW MISSION DETAILS →
                </a>
              ) : (
                <span className="project-link">DETAILS CLASSIFIED</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
