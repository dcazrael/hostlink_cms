/**
 * FAQStack renders an accordion-style list of questions and answers.
 * Uses the project's Accordion component for expand/collapse behaviour.
 *
 * @summary expandable FAQ accordion
 */
import * as React from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

export type FAQItem = {
  question: string
  answer: React.ReactNode
}

export type FAQStackProps = {
  items: FAQItem[]
  className?: string
}

export const FAQStack: React.FC<FAQStackProps> = ({ items, className }) => (
  <Accordion className={className}>
    {items.map((item) => (
      <AccordionItem key={item.question} value={item.question}>
        <AccordionTrigger>{item.question}</AccordionTrigger>
        <AccordionContent>{item.answer}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)
