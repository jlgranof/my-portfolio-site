import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NamePlate from './NamePlate'

describe('NamePlate', () => {
  it('renders the engineer identity header', () => {
    render(<NamePlate />)
    expect(screen.getByText('ENGINEER IDENTITY')).toBeTruthy()
    expect(screen.getByText('Jeff Granof')).toBeTruthy()
  })
})
