import type { Meta, StoryObj } from '@storybook/react'
import { SectionFrame } from './SectionFrame'

const meta: Meta<typeof SectionFrame> = {
  title: 'Components/SectionFrame',
  component: SectionFrame,
  parameters: { layout: 'fullscreen' },
  args: {
    tone: 'default',
    eyebrow: 'Operations',
    title: 'How it works',
    description:
      'A short paragraph that frames the content the section holds. The frame adds an editorial top rule and reserves space for an eyebrow, title, and supporting text.',
    headingLevel: 2,
    showAccentRule: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'even', 'subtle', 'navy', 'card'],
    },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
}

export default meta

type Story = StoryObj<typeof SectionFrame>

export const Default: Story = {
  name: 'Default · with accent rule',
  render: (args) => (
    <SectionFrame {...args}>
      <p className="text-sm text-muted-foreground">
        Body content slot. Drop steps, tables, or component composition here.
      </p>
    </SectionFrame>
  ),
}

export const SubtleBackground: Story = {
  name: 'Subtle background tone',
  args: { tone: 'subtle' },
  render: (args) => (
    <SectionFrame {...args}>
      <p className="text-sm text-(--heading)">
        The subtle tone uses <code>--subtle-background</code> — the same token the hero/contact
        sections draw from.
      </p>
    </SectionFrame>
  ),
}

export const NoAccentRule: Story = {
  name: 'No accent rule',
  args: { showAccentRule: false, eyebrow: 'Proof', title: 'Trusted by' },
  render: (args) => (
    <SectionFrame {...args}>
      <p className="text-sm text-muted-foreground">
        Disable the mint rule when the section is sitting on a busy band.
      </p>
    </SectionFrame>
  ),
}
