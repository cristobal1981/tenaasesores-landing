"use client"

import { useMemo } from "react"
import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { SectionShell } from "@/components/layout/section-shell"
import { faqPage, faqSections } from "@/content/faq"
import { useFaqSectionSpy } from "@/lib/faq/use-faq-section-spy"
import { cn } from "@/lib/utils"

const mobilePillClass =
  "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"

export function FaqPage() {
  const sectionIds = useMemo(() => faqSections.map((section) => section.slug), [])
  const { activeId, scrollToSection } = useFaqSectionSpy({ sectionIds })

  return (
    <main className="min-h-screen">
      <DarkPageHero
        badge={faqPage.badge}
        title={faqPage.title}
        lead={faqPage.subtitle}
        align="left"
        titleLine2Tone="primary"
      />

      <div className="sticky top-16 z-40 border-b border-agua/20 bg-surface-light/95 backdrop-blur-md lg:hidden md:top-20">
        <SectionShell innerClassName="py-3">
          <nav
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Secciones de preguntas frecuentes"
          >
            {faqSections.map((section) => {
              const isActive = activeId === section.slug
              return (
                <a
                  key={section.slug}
                  href={`#${section.slug}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(section.slug)
                  }}
                  className={cn(
                    mobilePillClass,
                    isActive
                      ? "border-primary/40 bg-white text-accent-on-light shadow-sm"
                      : "border-on-light/15 bg-white text-muted-on-light hover:border-primary/30 hover:text-on-light"
                  )}
                >
                  {section.title}
                </a>
              )
            })}
          </nav>
        </SectionShell>
      </div>

      <section className="border-t border-agua/20 bg-surface-light py-12 md:py-16">
        <SectionShell>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
            <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
              <nav aria-label="Secciones de preguntas frecuentes">
                <p className="mb-3 text-xs font-semibold tracking-wide text-accent-on-light uppercase">
                  En esta página
                </p>
                <ul className="space-y-1 border-l border-on-light/15">
                  {faqSections.map((section) => {
                    const isActive = activeId === section.slug
                    return (
                      <li key={section.slug} className="relative">
                        <span
                          aria-hidden
                          className={cn(
                            "absolute top-1 bottom-1 left-0 w-0.5 rounded-full bg-primary transition-opacity duration-200",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <a
                          href={`#${section.slug}`}
                          aria-current={isActive ? "location" : undefined}
                          onClick={(event) => {
                            event.preventDefault()
                            scrollToSection(section.slug)
                          }}
                          className={cn(
                            "block py-1.5 pl-4 text-sm leading-snug transition-colors focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                            isActive
                              ? "font-semibold text-accent-on-light"
                              : "text-muted-on-light hover:text-on-light"
                          )}
                        >
                          {section.title}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>

            <div className="min-w-0 space-y-14 md:space-y-16">
              {faqSections.map((section) => (
                <section
                  key={section.slug}
                  id={section.slug}
                  className="scroll-mt-36 md:scroll-mt-40 lg:scroll-mt-28"
                  aria-labelledby={`faq-section-${section.slug}`}
                >
                  <div className="mb-6 max-w-2xl">
                    <h2
                      id={`faq-section-${section.slug}`}
                      className="text-xl font-semibold text-pretty text-on-light sm:text-2xl"
                    >
                      {section.title}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-muted-on-light">
                      {section.description}
                    </p>
                  </div>
                  <FaqAccordionList
                    items={section.items}
                    sectionLabel={section.title}
                    defaultOpenIndex={section.slug === "empezar" ? 0 : -1}
                  />
                </section>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      <CtaBrisaBand
        title={faqPage.cta.title}
        subtitle={faqPage.cta.subtitle}
        label={faqPage.cta.label}
        href={faqPage.cta.href}
      />
    </main>
  )
}
