export default function ProjectsWindow() {
  const projects = [
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React frontend and Node.js backend",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      status: "COMPLETED",
      link: "#"
    },
    {
      id: 2,
      name: "Task Management System",
      description: "Real-time collaborative task management with WebSocket integration",
      tech: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
      status: "IN PROGRESS",
      link: "#"
    },
    {
      id: 3,
      name: "Data Visualization Dashboard",
      description: "Interactive dashboard for business intelligence and analytics",
      tech: ["D3.js", "Python", "Flask", "Redis"],
      status: "COMPLETED",
      link: "#"
    },
    {
      id: 4,
      name: "Mobile Fitness App",
      description: "Cross-platform mobile app for workout tracking and social features",
      tech: ["React Native", "Firebase", "Redux", "Expo"],
      status: "PLANNING",
      link: "#"
    }
  ]

  return (
    <div className="projects-window">
      <div className="projects-content">
        <h3>ACTIVE MISSIONS</h3>
        <div className="projects-grid">
          {projects.map(project => (
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
              <a href={project.link} className="project-link">
                VIEW MISSION DETAILS →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
