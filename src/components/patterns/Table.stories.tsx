import type { Meta, StoryObj } from '@storybook/react'
import { PATTERN_TONES } from './tones'
import { Table } from './Table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
  args: {
    columns: ['Service', 'Launch', 'Operate'],
    rows: [
      ['Production hosting', 'Included', 'Included'],
      ['Deployment support', 'One launch', 'Monthly'],
      ['Bilingual handoff', 'Email', 'Priority'],
    ],
    tone: 'card',
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: [...PATTERN_TONES],
    },
    columns: { control: 'object' },
    rows: { control: 'object' },
    className: { table: { disable: true } },
  },
}

export default meta

type Story = StoryObj<typeof Table>

export const HeaderTone: Story = {
  name: 'Tone-controlled header',
}
