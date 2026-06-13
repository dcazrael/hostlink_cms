import type { Meta, StoryObj } from '@storybook/react'
import { ImageFrame } from './Patterns'

const meta: Meta = {
  title: 'Components/ImageFrames',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <ImageFrame alt="Abstract hostlink workspace visual" caption="Operations visual" />
      <ImageFrame
        alt="Abstract contact visual"
        caption="Contact visual"
        className="bg-(--subtle-background)"
      />
    </div>
  ),
}
