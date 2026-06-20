import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { Stepper, type StepperStep } from './Stepper'

const THREE_STEPS: StepperStep[] = [
  {
    step: 1,
    title: 'Audit',
    description: 'Confirm hosting, CMS, and content constraints before migration.',
  },
  {
    step: 2,
    title: 'Build',
    description: 'Prepare the managed environment and connect release automation.',
  },
  {
    step: 3,
    title: 'Launch',
    description: 'Coordinate DNS, final checks, and support handoff.',
  },
]

const meta: Meta<typeof Stepper> = {
  title: 'Compositions/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  args: {
    steps: THREE_STEPS,
    onChange: fn(),
  },
  argTypes: {
    defaultActiveStep: { control: { type: 'number', min: 1, step: 1 } },
    activeStep: { control: { type: 'number', min: 1, step: 1 } },
    autoAdvanceInterval: {
      control: { type: 'range', min: 500, max: 15000, step: 500 },
    },
    // variant is encoded by which story you view (Interactive / AutoAdvance).
    variant: { table: { disable: true } },
    steps: { table: { disable: true } },
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Stepper>

/**
 * Default interactive stepper. Click any step to jump to it, or use the
 * Back / Next buttons to advance one step at a time. The active step
 * shows an expanded detail panel with current-focus items.
 *
 * Use this variant when the viewer drives the pace — multi-step forms,
 * onboarding wizards, or guided walkthroughs where each step has
 * enough content to justify the vertical layout.
 *
 * @summary viewer-driven stepper with Back / Next controls
 */
export const Interactive: Story = {
  args: {
    variant: 'interactive',
    steps: THREE_STEPS,
  },
  play: async ({ canvas, args }) => {
    // Should start on step 1
    await expect(canvas.getByText('Step 1 of 3')).toBeTruthy()

    // Click Next → step 2
    await userEvent.click(canvas.getByText('Next →'))
    await expect(canvas.getByText('Step 2 of 3')).toBeTruthy()
    await expect(args.onChange).toHaveBeenCalledWith(2)

    // Click Next → step 3
    await userEvent.click(canvas.getByText('Next →'))
    await expect(canvas.getByText('Step 3 of 3')).toBeTruthy()
    await expect(args.onChange).toHaveBeenCalledWith(3)

    // Next button should be disabled
    const nextBtn = canvas.getByText('Next →').closest('button')
    await expect(nextBtn).toBeDisabled()

    // Click Back → step 2
    await userEvent.click(canvas.getByText('← Back'))
    await expect(canvas.getByText('Step 2 of 3')).toBeTruthy()

    // Click step 1 indicator directly
    await userEvent.click(canvas.getByText('Audit'))
    await expect(canvas.getByText('Step 1 of 3')).toBeTruthy()
  },
}

/**
 * For scenarios where you want the narrative to unfold on its own —
 * kiosks, hero-section walkthroughs, or auto-playing feature tours —
 * the auto variant advances steps on a configurable timer. The
 * pulsing accent ring on the active step gives a visual cue that the
 * stepper is live. A Play / Pause button gives the viewer control.
 *
 * This story uses the default 5-second interval. Change
 * `autoAdvanceInterval` in the Controls panel to speed up or slow down.
 *
 * @summary timer-driven stepper with Play / Pause control
 */
export const AutoAdvance: Story = {
  args: {
    variant: 'auto',
    steps: THREE_STEPS,
    autoAdvanceInterval: 5000,
  },
}
