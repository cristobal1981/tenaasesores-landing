"use client"

import { FadeIn } from "@/components/animations"
import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { altaAutonomoFormContent } from "@/content/alta-autonomo-form"

export function AltaAutonomoFaqSection() {
  return (
    <FadeIn delay={0.1} className="mx-auto mt-8 max-w-6xl">
      <div className="rounded-3xl border border-agua/20 bg-white/85 p-6 shadow-lg shadow-agua/8 md:p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-on-light-muted uppercase">
            Antes de enviar
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-on-light">
            {altaAutonomoFormContent.faqSection.title}
          </h2>
          <p className="mt-3 text-sm text-muted-on-light">{altaAutonomoFormContent.faqSection.description}</p>
        </div>
        <FaqAccordionList
          items={altaAutonomoFormContent.faqSection.items}
          sectionLabel={altaAutonomoFormContent.faqSection.title}
          defaultOpenIndex={-1}
        />
      </div>
    </FadeIn>
  )
}
