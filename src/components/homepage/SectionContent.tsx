import React from 'react'

import { CompanyBlockComponent } from '@/blocks/Company/Component'
import { ContactBlockComponent } from '@/blocks/Contact/Component'
import { FaqBlockComponent } from '@/blocks/Faq/Component'
import { FlowBlockComponent } from '@/blocks/Flow/Component'
import { GridBlockComponent } from '@/blocks/GridBlock/Component'
import { PricingBlockComponent } from '@/blocks/Pricing/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'
import type { SectionComponentBlock } from '@/components/homepage/types'

export const SectionContent: React.FC<{
  component?: SectionComponentBlock
}> = ({ component }) => {
  if (!component) return null

  switch (component.blockType) {
    case 'grid':
      return <GridBlockComponent block={component} />
    case 'flow':
      return <FlowBlockComponent block={component} />
    case 'pricing':
      return <PricingBlockComponent block={component} />
    case 'faq':
      return <FaqBlockComponent block={component} />
    case 'testimonials':
      return <TestimonialsBlockComponent block={component} />
    case 'company':
      return <CompanyBlockComponent block={component} />
    case 'contact':
      return <ContactBlockComponent block={component} />
    default:
      return null
  }
}
