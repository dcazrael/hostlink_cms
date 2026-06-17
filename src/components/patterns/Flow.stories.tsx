import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FlowSteps } from './Patterns'

const meta: Meta = {
  title: 'Compositions/Flow',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

/**
 * Three-step FlowSteps composition showing Audit, Build, Launch sequence.
 * Use for process overviews where each step has a title and body description.
 *
 * @summary three-step process flow
 */
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
