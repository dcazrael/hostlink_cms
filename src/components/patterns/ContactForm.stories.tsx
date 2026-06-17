import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ContactPanel } from './Patterns'

const meta: Meta = {
  title: 'Compositions/ContactForm',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

/**
 * Full contact panel with input fields and submit button.
 * Use for inquiry or consultation request sections.
 *
 * @summary inquiry contact form
 */
export const Default: Story = {
  render: () => <ContactPanel />,
}
