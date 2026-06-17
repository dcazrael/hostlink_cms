import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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

/**
 * Default section frame with accent rule, eyebrow, title, and description.
 * Use as the standard editorial wrapper for pamphlet sections.
 *
 * @summary standard editorial section wrapper
 */
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

/**
 * Section frame with subtle background tone.
 * Use to visually alternate sections on a page while keeping the frame structure.
 *
 * @summary alternate section using subtle background
 */
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

/**
 * Section frame without the mint accent rule.
 * Use when the section sits on a busy background where the rule would compete.
 *
 * @summary section frame with accent rule hidden
 */
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
