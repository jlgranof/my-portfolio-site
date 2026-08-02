import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { profile } from '../../data/profile'
import AboutWindow from './AboutWindow'
import SkillsWindow from './SkillsWindow'
import ProjectsWindow from './ProjectsWindow'
import ResumeWindow from './ResumeWindow'
import ContactWindow from './ContactWindow'

describe('windows render from profile data', () => {
  it('AboutWindow shows briefing and specializations', () => {
    render(<AboutWindow />)
    expect(screen.getByText(profile.about.briefing)).toBeTruthy()
    expect(screen.getByText(profile.about.specializations[0])).toBeTruthy()
  })

  it('SkillsWindow shows languages from profile', () => {
    render(<SkillsWindow />)
    expect(screen.getByText(profile.skills.languages[0])).toBeTruthy()
  })

  it('ProjectsWindow shows project names; classified when no link', () => {
    render(<ProjectsWindow />)
    expect(screen.getByText(profile.projects[0].name)).toBeTruthy()
    if (profile.projects[0].link === null) {
      expect(screen.getAllByText('DETAILS CLASSIFIED').length).toBeGreaterThan(0)
    }
  })

  it('ResumeWindow hides download button when no downloadUrl', () => {
    render(<ResumeWindow />)
    if (profile.resume.downloadUrl === null) {
      expect(screen.queryByText('DOWNLOAD FULL PROFILE')).toBeNull()
    }
  })

  it('ContactWindow shows pending channel when no email, and no fakes', () => {
    const { container } = render(<ContactWindow />)
    if (profile.contact.email === null) {
      expect(screen.getByText('[CHANNEL PENDING]')).toBeTruthy()
    }
    expect(container.innerHTML).not.toContain('example.com')
  })
})
