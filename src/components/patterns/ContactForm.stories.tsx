import type { Meta, StoryObj } from '@storybook/react'
import { ContactPanel } from './Patterns'

const meta: Meta = {
  title: 'Compositions/ContactForm',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <ContactPanel />,
}
