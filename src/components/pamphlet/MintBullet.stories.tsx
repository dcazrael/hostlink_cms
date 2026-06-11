import type { Meta, StoryObj } from '@storybook/react'
import { MintBullet } from './MintBullet'

const meta: Meta<typeof MintBullet> = {
  title: 'Pamphlet/Primitives/MintBullet',
  component: MintBullet,
  parameters: { layout: 'padded' },
  args: {
    shape: 'square',
    sizeClassName: 'size-2.5',
  },
  argTypes: {
    shape: {
      control: 'inline-radio',
      options: ['square', 'diamond', 'bar', 'circle'],
    },
  },
}

export default meta

type Story = StoryObj<typeof MintBullet>

const labels: Array<{ title: string; body: string }> = [
  { title: 'Dedicated workspace', body: 'A managed environment per team.' },
  { title: 'Same-day setup', body: 'Provisioned in under 24 hours.' },
  { title: 'Bilingual support', body: 'Native JP and EN coverage.' },
]

export const ListWithSquares: Story = {
  name: 'List · controlled bullet shape',
  render: (args) => (
    <ul className="flex flex-col gap-3">
      {labels.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <span className="inline-flex h-5 items-center">
            <MintBullet {...args} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  ),
}

export const ShapeGallery: Story = {
  name: 'All shapes',
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['square', 'diamond', 'bar', 'circle'] as const).map((shape) => (
        <div key={shape} className="flex items-center gap-4">
          <MintBullet {...args} shape={shape} />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {shape}
          </span>
        </div>
      ))}
    </div>
  ),
}
