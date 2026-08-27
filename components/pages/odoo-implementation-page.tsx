"use client"

import { Link2, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { PartnersDossier } from "@/components/landing/odoo-partners"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { OdooImplementationPhases } from "@/components/pages/odoo-implementation-phases"
import { TextLinkWithIcon } from "@/components/ui/text-link"
import { faqSections } from "@/content/faq"
import {
  odooImplementationBenefits,
  odooImplementationCta,
  odooImplementationHero,
  odooImplementationQuote,
} from "@/content/odoo-implementation"

const benefitIcons: readonly LucideIcon[] = [TrendingUp, Sparkles, Link2, ShieldCheck]

// Sección "odoo" definida en content/faq.ts — garantizada por contenido interno.
const odooFaqSection = faqSections.find((section) => section.slug === "odoo")!

export function OdooImplementationPage() {
  return (
    <main className="min-h-screen bg-background">
      <DarkPageHero
        eyebrow={odooImplementationHero.eyebrow}
        title={odooImplementationHero.title}
        lead={odooImplementationHero.lead}
        align="center"
        className="border-b-0"
      />

      <section className="bg-surface-dark pb-24">
        <SectionShell>
          <PartnersDossier showBenefits={false} />
        </SectionShell>
      </section>

      <section className="border-t border-agua/15 bg-surface-dark py-20 md:py-24">
        <SectionShell>
          <FadeIn className="mx-auto max-w-3xl">
            <blockquote className="text-center">
              <p className="text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.25] font-semibold text-on-dark">
                {odooImplementationQuote.text}
              </p>
              <footer className="mt-6 text-sm text-muted-on-dark">
                <span className="font-semibold text-on-dark">
                  {odooImplementationQuote.author}
                </span>
                {" · "}
                {odooImplementationQuote.role}
              </footer>
            </blockquote>
          </FadeIn>
        </SectionShell>
      </section>

      <OdooImplementationPhases />

      <section
        id="beneficios"
        className="scroll-mt-[var(--site-header-height)] bg-surface-light py-20 md:py-28"
      >
        <SectionShell>
          <MarketingSectionHeading
            badge="Por qué así"
            title="Lo que ganas con esta forma de trabajar"
            tone="light"
            className="mb-14 max-w-3xl"
          />

          <StaggerContainer
            className="grid grid-cols-1 gap-10 sm:grid-cols-2"
            staggerDelay={0.08}
          >
            {odooImplementationBenefits.map((benefit, index) => {
              const Icon = benefitIcons[index]
              return (
                <StaggerItem key={benefit.title}>
                  <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-on-light">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-on-light">
                    {benefit.description}
                  </p>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </SectionShell>
      </section>

      <section className="border-t border-on-light/10 bg-surface-light py-20 md:py-24">
        <SectionShell innerClassName="max-w-3xl">
          <MarketingSectionHeading
            badge={odooFaqSection.title}
            title="Preguntas frecuentes"
            subtitle={odooFaqSection.description}
            tone="light"
            className="mb-12"
          />

          <FaqAccordionList items={odooFaqSection.items} sectionLabel={odooFaqSection.title} />

          <div className="mt-10 text-center">
            <TextLinkWithIcon href="/faq#odoo">
              Ver todas las preguntas frecuentes
            </TextLinkWithIcon>
          </div>
        </SectionShell>
      </section>

      <CtaBrisaBand title={odooImplementationCta.title} label={odooImplementationCta.label} />
    </main>
  )
}
