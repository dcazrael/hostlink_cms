import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { Logo } from './Logo'

const meta = {
  component: Logo,
  tags: ['ai-generated'],
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Hostlink logo asset rendered as a 300px image.
 * Use to preview the brand mark at its default size.
 *
 * @summary default brand logo
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', { name: /hostlink logo/i })
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('src', '/logo.svg')
    await expect(img).toHaveAttribute('width', '300')
  },
}
