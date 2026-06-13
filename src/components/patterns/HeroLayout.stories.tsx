import type { Meta, StoryObj } from '@storybook/react'
import { SectionWithImage } from './Patterns'

const meta: Meta = {
  title: 'Compositions/HeroLayout',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

const features = [
  'Dedicated production workspace',
  'Managed Payload and Next.js deploys',
  'Bilingual support window',
]

export const Default: Story = {
  name: 'Section with image',
  render: () => (
    <SectionWithImage
      eyebrow="Operations"
      title="A managed workspace with a visual slot"
      description="A full-width composition combining section copy, title-aligned bullets, and an abstract image frame."
      bullets={features.map((title) => ({ title }))}
      bulletShape="bar"
    />
  ),
}
