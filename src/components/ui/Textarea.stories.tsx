import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { Textarea } from './textarea'

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Write your message here…',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default textarea with placeholder text.
 * Use as an empty multi-line text input ready for user content.
 *
 * @summary empty textarea with placeholder
 */
export const Default: Story = {
  args: { placeholder: 'Write your message here…' },
  play: async ({ canvas }) => {
    const textarea = canvas.getByPlaceholderText('Write your message here…')
    await expect(textarea).toBeVisible()
  },
}

/**
 * Textarea pre-filled with saved content.
 * Use to display existing notes, descriptions, or editable content.
 *
 * @summary pre-filled with existing content
 */
export const WithContent: Story = {
  args: { defaultValue: 'This is a saved note.', readOnly: true },
}

/**
 * Disabled textarea — non-interactive, reduced styling.
 * Use to show read-only content in a textarea container.
 *
 * @summary disabled non-interactive state
 */
export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled textarea' },
}
