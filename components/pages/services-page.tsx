"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { ServiceIconBadge } from "@/components/landing/service-icon-badge"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { ChecklistItem } from "@/components/ui/checklist-item"
import { ChipScrollRow } from "@/components/ui/chip-scroll-row"
import { services } from "@/content/site"
import { cn } from "@/lib/utils"

const tabBorderBySlug: Record<string, string> = {
  fiscal: "border-service-fiscal",
  contable: "border-service-contable",
  laboral: "border-service-laboral",
  constitucion: "border-service-constitucion",
}

export function ServicesPage() {
  const gestionesRef = useRef<HTMLDivElement>(null)
  const [activeSlug, setActiveSlug] = useState<string>(services.mainServices[0]?.slug ?? "")

  const { valueDifferential, mainServices, cta } = services

  const navLinks = mainServices.map((s) => ({ label: s.title, href: `#${s.slug}`, slug: s.slug }))

  const scrollToService = useCallback((hashHref: string) => {
    const id = hashHref.replace("#", "")
    const target = document.getElementById(id)
    if (!target) return

    window.history.replaceState(null, "", hashHref)
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const navEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined
    if (navEntry?.type === "reload") return

    const raf = window.requestAnimationFrame(() => {
      scrollToService(hash)
    })

    return () => window.cancelAnimationFrame(raf)
  }, [scrollToService])

  useEffect(() => {
    const sections = mainServices
      .map((service) => document.getElementById(service.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSlug(visible[0].target.id)
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    )

    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [mainServices])

  return (
    <main className="min-h-screen bg-background">
      {/* Valor diferencial */}
      <section className="bg-surface-light py-20 md:py-28">
        <SectionShell>
          <MarketingSectionHeading
            badge={valueDifferential.badge}
            title={valueDifferential.title}
            tone="light"
            as="h1"
            size="page"
            className="mb-14 max-w-3xl"
          />

          <StaggerContainer
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8"
            staggerDelay={0.1}
          >
            {valueDifferential.items.map((item) => (
              <StaggerItem key={item.title}>
                <h2 className="mb-2 text-base font-semibold text-on-light">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted-on-light">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SectionShell>
      </section>

      {/* Gestiones — documento continuo, un capítulo por servicio */}
      <div ref={gestionesRef} className="bg-surface-dark">
        <div className="sticky top-[var(--site-header-height)] z-30 flex h-14 items-center border-b border-agua/20 bg-surface-dark">
          <nav
            aria-label="Secciones de servicios"
            className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <ChipScrollRow className="gap-2" edgeFrom="from-surface-dark">
              {navLinks.map((link) => {
                const isActive = activeSlug === link.slug
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToService(link.href) }}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-3.5 sm:text-sm",
                      isActive
                        ? "border-primary bg-transparent text-primary"
                        : cn(tabBorderBySlug[link.slug], "text-muted-on-dark hover:text-on-dark"),
                    )}
                  >
                    {link.label}
                  </a>
                )
              })}
            </ChipScrollRow>
          </nav>
        </div>

        {mainServices.map((service, index) => (
          <section
            key={service.slug}
            id={service.slug}
            className={cn(
              "scroll-mt-[calc(var(--site-header-height)+3.5rem)] border-agua/15 py-16 md:py-20",
              index > 0 && "border-t",
            )}
          >
            <SectionShell>
              <div className="mb-10 max-w-3xl">
                <div className="mb-4 flex items-center gap-4">
                  <ServiceIconBadge slug={service.slug} size="md" />
                  <h2 className="text-3xl font-bold text-on-dark sm:text-4xl">{service.title}</h2>
                </div>
                <p className="text-lg leading-relaxed text-muted-on-dark">{service.intro}</p>
              </div>

              <StaggerContainer
                className="grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10"
                staggerDelay={0.06}
              >
                {service.sections.map((block) => (
                  <StaggerItem key={block.title}>
                    <h3 className="mb-2 text-base font-semibold text-on-dark">{block.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark">
                      {block.description}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {service.benefits.length > 0 ? (
                <FadeIn delay={0.1} className="mt-10 border-t border-agua/15 pt-8">
                  <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Ventajas
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {service.benefits.map((benefit) => (
                      <ChecklistItem key={benefit} iconBg textClassName="text-on-dark/90">
                        {benefit}
                      </ChecklistItem>
                    ))}
                  </ul>
                </FadeIn>
              ) : null}
            </SectionShell>
          </section>
        ))}
      </div>

      <CtaBrisaBand title={cta.title} label={cta.label} />
    </main>
  )
}
