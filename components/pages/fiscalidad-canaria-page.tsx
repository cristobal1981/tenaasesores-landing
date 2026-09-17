"use client"

import { BadgeCheck, FileText, Package, PiggyBank, type LucideIcon } from "lucide-react"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { TextLinkWithIcon } from "@/components/ui/text-link"
import { fiscalidadCanaria } from "@/content/fiscalidad-canaria"
import { faqSections } from "@/content/faq"

const topicIcons: readonly LucideIcon[] = [FileText, PiggyBank, Package, BadgeCheck]

// Sección "servicios" definida en content/faq.ts — garantizada por contenido interno.
const fiscalFaqSection = faqSections.find((section) => section.slug === "servicios")!

export function FiscalidadCanariaPage() {
  const { hero, intro, topics, cta } = fiscalidadCanaria

  return (
    <main className="min-h-screen bg-background">
      <DarkPageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        align="center"
        className="border-b-0"
      />

      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle_at_15%_90%,rgba(1,99,92,0.14),transparent_42%)",
          }}
        />
        <SectionShell className="relative">
          <FadeIn className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <MarketingSectionHeading
              badge={intro.badge}
              title={intro.title}
              subtitle={intro.description}
              align="left"
              size="compact"
              className="max-w-xl"
            />

            <div className="overflow-hidden rounded-2xl border border-agua/30">
              <iframe
                src="https://www.google.com/maps?q=Islas+Canarias&t=h&output=embed"
                title="Mapa de las Islas Canarias"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full lg:h-96"
              />
            </div>
          </FadeIn>
        </SectionShell>
      </section>

      <section className="border-t border-agua/30 bg-background py-16 md:py-24">
        <SectionShell>
          <MarketingSectionHeading
            badge={topics.badge}
            title={topics.title}
            size="compact"
            className="mb-14 max-w-3xl"
          />

          <StaggerContainer
            className="grid grid-cols-1 gap-10 sm:grid-cols-2"
            staggerDelay={0.08}
          >
            {topics.items.map((topic, index) => {
              const Icon = topicIcons[index]
              return (
                <StaggerItem key={topic.title}>
                  <h3 className="mb-2 flex items-start gap-2 text-base font-semibold text-on-dark">
                    <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {topic.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-on-dark">
                    {topic.description}
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
            badge={fiscalFaqSection.title}
            title="Preguntas frecuentes"
            subtitle={fiscalFaqSection.description}
            tone="light"
            className="mb-12"
          />

          <FaqAccordionList items={fiscalFaqSection.items} sectionLabel={fiscalFaqSection.title} />

          <div className="mt-10 text-center">
            <TextLinkWithIcon href="/faq#servicios">
              Ver todas las preguntas frecuentes
            </TextLinkWithIcon>
          </div>
        </SectionShell>
      </section>

      <CtaBrisaBand title={cta.title} label={cta.label} />
    </main>
  )
}
