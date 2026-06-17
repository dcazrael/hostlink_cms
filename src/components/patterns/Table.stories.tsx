import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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

/**
 * Table with tone-controlled header background.
 * Use for data grids or feature comparison tables where column headers must stand out.
 *
 * @summary table with themed header row
 */
export const HeaderTone: Story = {
  name: 'Tone-controlled header',
}
