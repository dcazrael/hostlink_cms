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

const FIVE_STEPS: StepperStep[] = [
  {
    step: 1,
    title: 'Discovery',
    description: 'Initial consultation and requirements gathering.',
  },
  {
    step: 2,
    title: 'Design',
    description: 'Wireframes, mockups, and technical architecture.',
  },
  {
    step: 3,
    title: 'Develop',
    description: 'Build, integrate, and iterate on the solution.',
  },
  {
    step: 4,
    title: 'Review',
    description: 'QA, stakeholder review, and revisions.',
  },
  {
    step: 5,
    title: 'Deploy',
    description: 'Production release, monitoring, and handoff.',
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
    variant: {
      control: 'inline-radio',
      options: ['interactive', 'auto'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Stepper>

/**
 * Default interactive stepper. Click any step to jump to it, or use the
 * Back / Next buttons to advance one step at a time. The active step shows
 * an expanded detail panel with current-focus items.
 *
 * Use this variant when the viewer drives the pace — multi-step forms,
 * onboarding wizards, or guided walkthroughs where each step has enough
 * content to justify the vertical layout.
 */
export const Interactive: Story = {
  args: {
    variant: 'interactive',
    steps: THREE_STEPS,
  },
}

/**
 * For scenarios where you want the narrative to unfold on its own — kiosks,
 * hero-section walkthroughs, or auto-playing feature tours — the auto
 * variant advances steps on a configurable timer. The pulsing accent ring
 * on the active step gives a visual cue that the stepper is live. A Play /
 * Pause button gives the viewer control.
 *
 * This story uses the default 5-second interval. Change `autoAdvanceInterval`
 * in the Controls panel to speed up or slow down.
 */
export const AutoAdvance: Story = {
  args: {
    variant: 'auto',
    steps: THREE_STEPS,
    autoAdvanceInterval: 5000,
  },
}

/**
 * Five-step variant showing how the stepper handles a longer sequence.
 * All steps fit the vertical layout without crowding, making it suitable
 * for detailed project plans or milestone trackers.
 */
export const FiveSteps: Story = {
  args: {
    variant: 'interactive',
    steps: FIVE_STEPS,
  },
}

/**
 * Controlled-mode example: the stepper starts at step 2 and an external
 * `onChange` handler logs every navigation. Useful for form integrations
 * where a parent component owns the active-step state.
 */
export const ControlledStartAtStep2: Story = {
  args: {
    variant: 'interactive',
    steps: THREE_STEPS,
    activeStep: 2,
    onChange: fn(),
  },
}

/**
 * Play function test: clicks the "Next" button twice and verifies
 * the stepper lands on step 3, then clicks "Back" to return to step 2.
 * Also clicks step 1 directly to verify indicator-based navigation.
 */
export const InteractiveNavigation: Story = {
  args: {
    variant: 'interactive',
    steps: THREE_STEPS,
    onChange: fn(),
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
