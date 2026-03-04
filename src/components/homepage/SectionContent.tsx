import React from 'react'

import { CompanySection } from '@/components/homepage/sections/CompanySection'
import { ContactSection } from '@/components/homepage/sections/ContactSection'
import { FaqSection } from '@/components/homepage/sections/FaqSection'
import { FlowSection } from '@/components/homepage/sections/FlowSection'
import { PricingSection } from '@/components/homepage/sections/PricingSection'
import { ProblemsSection } from '@/components/homepage/sections/ProblemsSection'
import { ServicesSection } from '@/components/homepage/sections/ServicesSection'
import { TestimonialsSection } from '@/components/homepage/sections/TestimonialsSection'
import type { SectionComponentBlock } from '@/components/homepage/types'
import type { TranslateFn } from '@/i18n/createTranslator'

export const SectionContent: React.FC<{
  component?: SectionComponentBlock
  t: TranslateFn
}> = ({ component, t }) => {
  if (!component) return null

  switch (component.blockType) {
    case 'problems':
      return <ProblemsSection block={component} />
    case 'services':
      return <ServicesSection block={component} />
    case 'flow':
      return <FlowSection block={component} />
    case 'pricing':
      return <PricingSection block={component} t={t} />
    case 'faq':
      return <FaqSection block={component} />
    case 'testimonials':
      return <TestimonialsSection block={component} />
    case 'company':
      return <CompanySection block={component} t={t} />
    case 'contact':
      return <ContactSection block={component} />
    default:
      return null
  }
}
