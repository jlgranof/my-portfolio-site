import { profile } from "../../data/profile"

export default function SkillsWindow() {
  const { languages, frameworks, tools } = profile.skills
  const sections = [
    ["LANGUAGES:", languages],
    ["FRAMEWORKS & LIBRARIES:", frameworks],
    ["TOOLS & TECHNOLOGIES:", tools],
  ] as const
  return (
    <div className="skills-window">
      <div className="skills-content">
        <h3>TECHNICAL SKILLS</h3>
        {sections.map(([title, items]) => (
          <div key={title}>
            <h4>{title}</h4>
            <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  )
}
