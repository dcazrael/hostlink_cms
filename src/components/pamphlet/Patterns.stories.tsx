import type { Meta, StoryObj } from '@storybook/react'
import {
  ContactPanel,
  FAQStack,
  FlowSteps,
  GridBlockItem,
  ImageFrame,
  PamphletButton,
  PamphletCard,
  PamphletTable,
  PricingCard,
  SectionShape,
  SectionWithImage,
} from './Patterns'
import { MintBulletList } from './MintBullet'

const meta: Meta = {
  title: 'Pamphlet/Patterns',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

const features = [
  'Dedicated production workspace',
  'Managed Payload and Next.js deploys',
  'Bilingual support window',
]

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <PamphletButton>Primary action</PamphletButton>
      <PamphletButton tone="mint">Mint action</PamphletButton>
      <PamphletButton tone="outline">Secondary action</PamphletButton>
    </div>
  ),
}

export const Cards: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      <PamphletCard eyebrow="Hosting" title="Managed infrastructure">
        Production hosting, CMS maintenance, and deploy support in one predictable workflow.
      </PamphletCard>
      <PamphletCard eyebrow="Support" title="Human handoff" tone="mint">
        A direct support path for launch questions, content updates, and operational changes.
      </PamphletCard>
      <PamphletCard eyebrow="SLA" title="Priority response" tone="navy">
        Critical issues get a clear escalation path and bilingual status updates.
      </PamphletCard>
    </div>
  ),
}

export const PricingCards: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      <PricingCard
        name="Launch"
        price="¥80k"
        description="For teams preparing a single production site."
        features={features}
      />
      <PricingCard
        featured
        name="Operate"
        price="¥160k"
        description="For active teams that need support and deployments."
        features={features}
      />
      <PricingCard
        name="Scale"
        price="Custom"
        description="For multiple brands, environments, or compliance needs."
        features={features}
      />
    </div>
  ),
}

export const GridBlockItems: Story = {
  render: () => (
    <div className="grid gap-8 md:grid-cols-3">
      <GridBlockItem number="01" title="Provision">
        Create a stable workspace with project-specific deployment settings.
      </GridBlockItem>
      <GridBlockItem number="02" title="Migrate">
        Move content and launch assets into the managed Payload workflow.
      </GridBlockItem>
      <GridBlockItem number="03" title="Operate">
        Keep releases, support, and infrastructure changes moving safely.
      </GridBlockItem>
    </div>
  ),
}

export const Flow: Story = {
  render: () => (
    <FlowSteps
      steps={[
        {
          title: 'Audit',
          body: 'Confirm hosting, CMS, and content constraints before migration.',
        },
        {
          title: 'Build',
          body: 'Prepare the managed environment and connect release automation.',
        },
        {
          title: 'Launch',
          body: 'Coordinate DNS, final checks, and support handoff.',
        },
      ]}
    />
  ),
}

export const FAQ: Story = {
  render: () => (
    <FAQStack
      items={[
        {
          question: 'Can this run in our container setup?',
          answer: 'Yes. The workflow assumes containerized local services and avoids worktrees.',
        },
        {
          question: 'Do editors choose these visuals?',
          answer:
            'Not yet. Visuals remain hardcoded by slot until a concrete CMS workflow needs selection.',
        },
        {
          question: 'Can the pattern layer be reused on pages?',
          answer: 'Yes. The components are Payload-independent React primitives.',
        },
      ]}
    />
  ),
}

export const Tables: Story = {
  render: () => (
    <PamphletTable
      columns={['Service', 'Launch', 'Operate']}
      rows={[
        ['Production hosting', 'Included', 'Included'],
        ['Deployment support', 'One launch', 'Monthly'],
        ['Bilingual handoff', 'Email', 'Priority'],
      ]}
    />
  ),
}

export const ContactForm: Story = {
  render: () => <ContactPanel />,
}

export const BulletedLists: Story = {
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <MintBulletList items={features.map((title) => ({ title }))} shape="square" />
      <MintBulletList
        items={features.map((title) => ({
          title,
          body: 'Aligned to the title line with optional body text.',
        }))}
        shape="diamond"
      />
    </div>
  ),
}

export const ImageFrames: Story = {
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

export const SectionShapes: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      <SectionShape tone="subtle">
        <PamphletCard eyebrow="Subtle" title="Soft background">
          Section shell with an inset geometric mask.
        </PamphletCard>
      </SectionShape>
      <SectionShape tone="mint">
        <PamphletCard eyebrow="Mint" title="Accent field">
          Brighter geometric layer for proof and CTA areas.
        </PamphletCard>
      </SectionShape>
      <SectionShape tone="navy">
        <PamphletCard eyebrow="Navy" title="Strong close">
          High-contrast section shell for closing panels.
        </PamphletCard>
      </SectionShape>
    </div>
  ),
}

export const SectionWithImageStory: Story = {
  name: 'Section with image',
  render: () => (
    <SectionWithImage
      eyebrow="Operations"
      title="A managed workspace with a visual slot"
      description="A full-width composition combining section copy, title-aligned bullets, and an abstract image frame."
      bullets={features.map((title) => ({ title }))}
      bulletShape="bar"
    />
  ),
}
