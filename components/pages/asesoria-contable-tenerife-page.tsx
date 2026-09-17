"use client"

import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { FadeIn, FloatingElement } from "@/components/animations"
import { LocationDetails } from "@/components/pages/location-details"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { TextLinkWithIcon } from "@/components/ui/text-link"
import { asesoriaContableTenerife } from "@/content/asesoria-contable-tenerife"
import { faqSections } from "@/content/faq"
import { legalEntity } from "@/content/legal"

// Sección "equipo" definida en content/faq.ts — garantizada por contenido interno.
const zonaFaqSection = faqSections.find((section) => section.slug === "equipo")!

export function AsesoriaContableTenerifePage() {
  const { hero, coverage, services, whyLocal, cta } = asesoriaContableTenerife
  const mapEmbedSrc = `https://www.google.com/maps?cid=${legalEntity.mapsCid}&output=embed`

  return (
    <main className="min-h-screen bg-background">
      <DarkPageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        align="center"
        className="border-b-0"
      />

      <section
        id="cobertura"
        className="relative overflow-hidden border-t border-agua/30 bg-background py-16 md:py-24"
      >
        <FloatingElement
          className="absolute top-0 left-[-10%] h-72 w-72 rounded-full bg-agua/20 blur-[110px]"
          duration={13}
        />
        <FloatingElement
          className="absolute right-[-8%] bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-[100px]"
          duration={10}
          delay={1.5}
        />

        <SectionShell className="relative">
          <FadeIn className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <MarketingSectionHeading
                badge={coverage.badge}
                title={coverage.title}
                subtitle={coverage.description}
                align="left"
                size="compact"
                className="mb-8 max-w-xl"
              />

              <div className="mb-8 flex flex-wrap gap-2">
                {coverage.areas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-agua/30 bg-agua/10 px-3 py-1 text-sm text-on-dark"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <LocationDetails />
            </div>

            <div className="overflow-hidden rounded-2xl border border-agua/30">
              <iframe
                src={mapEmbedSrc}
                title={`Mapa de la oficina de tenaasesores en ${legalEntity.address}`}
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
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <MarketingSectionHeading
                badge={services.badge}
                title={services.title}
                subtitle={services.description}
                align="left"
                size="compact"
                className="mb-4 max-w-xl"
              />
              <TextLinkWithIcon href={services.cta.href}>{services.cta.label}</TextLinkWithIcon>
            </FadeIn>

            <FadeIn>
              <MarketingSectionHeading
                badge={whyLocal.badge}
                title={whyLocal.title}
                subtitle={whyLocal.description}
                align="left"
                size="compact"
                className="mb-4 max-w-xl"
              />
              <TextLinkWithIcon href={whyLocal.cta.href}>{whyLocal.cta.label}</TextLinkWithIcon>
            </FadeIn>
          </div>
        </SectionShell>
      </section>

      <section className="border-t border-on-light/10 bg-surface-light py-20 md:py-24">
        <SectionShell innerClassName="max-w-3xl">
          <MarketingSectionHeading
            badge={zonaFaqSection.title}
            title="Preguntas frecuentes"
            subtitle={zonaFaqSection.description}
            tone="light"
            className="mb-12"
          />

          <FaqAccordionList items={zonaFaqSection.items} sectionLabel={zonaFaqSection.title} />

          <div className="mt-10 text-center">
            <TextLinkWithIcon href="/faq#equipo">Ver todas las preguntas frecuentes</TextLinkWithIcon>
          </div>
        </SectionShell>
      </section>

      <CtaBrisaBand title={cta.title} label={cta.label} />
    </main>
  )
}
