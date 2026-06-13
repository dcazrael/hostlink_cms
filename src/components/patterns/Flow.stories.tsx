import type { Meta, StoryObj } from '@storybook/react'
import { FlowSteps } from './Patterns'

const meta: Meta = {
  title: 'Components/Flow',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

export const ThreeSteps: Story = {
  name: 'Three steps',
  render: () => (
    <FlowSteps
      steps={[
        {
          title: 'Audit',
          body: 'Confirm hosting, CMS, and content constraints before migration.',
        },
        {
          title: 'Build',
          body: 'Prepare the managed environment and connect release automation.',
        },
        {
          title: 'Launch',
          body: 'Coordinate DNS, final checks, and support handoff.',
        },
      ]}
    />
  ),
}
