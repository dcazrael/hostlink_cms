import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bullet, BulletList, FeatureList } from './BulletList'

const meta: Meta<typeof BulletList> = {
  title: 'Atoms/BulletList',
  component: BulletList,
  parameters: { layout: 'padded' },
  args: {
    items: ['Dedicated workspace', 'Same-day setup', 'Bilingual support'],
    shape: 'square',
  },
  argTypes: {
    shape: {
      control: 'inline-radio',
      options: ['square', 'diamond', 'bar', 'circle', 'polygon'],
    },
  },
}

export default meta

type Story = StoryObj<typeof BulletList>

const featureItems = [
  { title: 'Dedicated workspace', text: 'A managed environment per team.' },
  { title: 'Same-day setup', text: 'Provisioned in under 24 hours.' },
  { title: 'Bilingual support', text: 'Native JP and EN coverage.' },
]

/**
 * Primitive bullet list with default square markers.
 * Use for simple unordered lists with consistent bullet styling.
 *
 * @summary simple bullet list with square markers
 */
export const PrimitiveList: Story = {
  name: 'Primitive list',
}

/**
 * FeatureList variant with title and supporting text per item.
 * Use for feature grids or specification lists where each item needs a heading.
 *
 * @summary title-and-text feature list
 */
export const FeatureRows: Story = {
  name: 'FeatureList · title and text',
  render: (args) => <FeatureList items={featureItems} shape={args.shape} />,
}

/**
 * All five marker shapes (square, diamond, polygon, circle, bar) shown side-by-side.
 * Use to preview shape options before choosing one for your list.
 *
 * @summary marker shape comparison gallery
 */
export const ShapeGallery: Story = {
  name: 'All marker shapes',
  render: () => (
    <div className="flex flex-col gap-6">
      {(['square', 'diamond', 'polygon', 'circle', 'bar'] as const).map((shape) => (
        <div key={shape} className="flex items-center gap-4">
          <Bullet shape={shape} />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {shape}
          </span>
        </div>
      ))}
    </div>
  ),
}
