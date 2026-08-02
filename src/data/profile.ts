// ============================================================
// SINGLE SOURCE OF TRUTH for all personal content on the site.
// Anything marked TODO(jeff) needs real data. Placeholder values
// are wrapped in [BRACKETS] so they are visibly unfinished —
// never replace them with plausible-looking fakes.
// ============================================================

export interface Identity {
  name: string
  rank: string
  clearance: string
  status: string
}

export interface About {
  briefing: string
  specializations: string[]
  objectives: string[]
}

export interface Skills {
  languages: string[]
  frameworks: string[]
  tools: string[]
}

export type ProjectStatus = 'COMPLETED' | 'IN PROGRESS' | 'PLANNING'

export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  status: ProjectStatus
  /** null = no public link yet; UI renders "DETAILS CLASSIFIED" */
  link: string | null
  /** true while this entry is bracketed placeholder content */
  placeholder?: boolean
}

export interface ExperienceItem {
  title: string
  company: string
  period: string
  highlights: string[]
  placeholder?: boolean
}

export interface EducationItem {
  degree: string
  school: string
  year: string
  placeholder?: boolean
}

export interface Resume {
  experience: ExperienceItem[]
  education: EducationItem[]
  /** Only certifications actually held. Empty array renders nothing. */
  certifications: string[]
  /** null hides the download button until a real PDF exists */
  downloadUrl: string | null
}

export interface SocialLink {
  platform: string
  handle: string
  url: string
}

export interface Contact {
  /** null renders "[CHANNEL PENDING]" instead of a mailto link */
  email: string | null
  location: string | null
  responseTime: string
  social: SocialLink[]
}

export interface Profile {
  identity: Identity
  about: About
  skills: Skills
  projects: Project[]
  resume: Resume
  contact: Contact
}

export const profile: Profile = {
  identity: {
    name: 'Jeff Granof',
    rank: 'Full Stack Engineer',
    clearance: 'Above Top Secret',
    status: 'ACTIVE',
  },

  about: {
    // TODO(jeff): rewrite in your own voice
    briefing:
      'Greetings, Commander. I am Jeff Granof, a Full Stack Developer ' +
      'building robust, scalable applications that solve real-world problems.',
    // TODO(jeff): confirm these are your actual specializations
    specializations: [
      'Frontend Development (React, TypeScript)',
      'Backend Development (Node.js, Python)',
      'Database Design & Management',
    ],
    // TODO(jeff): confirm or rewrite
    objectives: [
      'Deliver high-quality, maintainable code',
      'Collaborate effectively in agile environments',
      'Stay current with emerging technologies',
    ],
  },

  skills: {
    // TODO(jeff): trim to what you actually use
    languages: ['JavaScript/TypeScript', 'Python', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Node.js & Express'],
    tools: ['Git & GitHub', 'Docker', 'PostgreSQL'],
  },

  projects: [
    // TODO(jeff): replace with real projects (this site itself is a good first entry)
    {
      id: 'placeholder-1',
      name: '[PROJECT NAME]',
      description: '[One-sentence description of a real project goes here.]',
      tech: ['[TECH]'],
      status: 'IN PROGRESS',
      link: null,
      placeholder: true,
    },
  ],

  resume: {
    // TODO(jeff): real work history
    experience: [
      {
        title: '[TITLE]',
        company: '[COMPANY]',
        period: '[YYYY – YYYY]',
        highlights: ['[What you did there.]'],
        placeholder: true,
      },
    ],
    // TODO(jeff): real education
    education: [
      { degree: '[DEGREE]', school: '[SCHOOL]', year: '[YYYY]', placeholder: true },
    ],
    certifications: [], // TODO(jeff): only ones you actually hold
    downloadUrl: null, // TODO(jeff): add /resume.pdf to public/ then set '/resume.pdf'
  },

  contact: {
    email: null, // TODO(jeff): the address you want published
    location: null, // TODO(jeff): e.g. 'Chicago, IL' — or leave null to hide
    responseTime: 'Within 24 hours',
    social: [
      // TODO(jeff): verify handle/urls, add LinkedIn etc.
      { platform: 'GitHub', handle: '@jlgranof', url: 'https://github.com/jlgranof' },
    ],
  },
}
