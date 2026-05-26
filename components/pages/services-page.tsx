"use client"

import { useRef } from "react"
import { Check } from "lucide-react"
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
} from "@/components/animations"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { SectionParallaxBackground } from "@/components/landing/section-parallax-background"
import { SectionShell } from "@/components/layout/section-shell"
import { images, services } from "@/content/site"
import {
  getServiceIconBySlug,
  valueDifferentialIcons,
} from "@/lib/service-icons"
import { useSectionParallax } from "@/lib/gsap/use-section-parallax"
import { useServicesScrollBlob } from "@/lib/gsap/use-services-scroll-blob"

export function ServicesPage() {
  const heroRef = useRef<HTMLElement>(null)
  const gestionesZoneRef = useRef<HTMLDivElement>(null)
  const scrollBlobRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useSectionParallax(heroRef)
  useServicesScrollBlob({ zoneRef: gestionesZoneRef, blobRef: scrollBlobRef })

  const { pageIntro, valueDifferential, mainServices, cta } = services

  const navLinks = mainServices.map((s) => ({ label: s.title, href: `#${s.slug}` }))

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-agua/30 py-20 md:py-28"
      >
        <SectionParallaxBackground
          src={images.services}
          parallaxRef={parallaxRef}
          imageClassName="opacity-[0.15]"
          priority
        />
        <FloatingElement
          className="absolute -top-10 right-1/4 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
          duration={11}
        />
        <SectionShell>
          <FadeIn className="mx-auto max-w-3xl text-center">
            <div className="badge-on-dark mb-6">
              <span className="badge-label-on-dark">{pageIntro.badge}</span>
            </div>
            <h1 className="mb-6 text-3xl leading-[1.15] font-bold text-on-dark sm:text-4xl lg:text-5xl">
              {pageIntro.title[0]}
              <br />
              <span className="text-primary">{pageIntro.title[1]}</span>
            </h1>
            <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-dark">
              {pageIntro.subtitle}
            </p>
          </FadeIn>
        </SectionShell>
      </section>

      {/* Sticky nav */}
      <div className="sticky top-20 z-40 border-b border-agua/30 bg-background/90 backdrop-blur-md">
        <SectionShell innerClassName="py-3">
          <nav
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Secciones de servicios"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full border border-agua/40 bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-on-dark transition-colors hover:border-primary/50 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </SectionShell>
      </div>

      {/* Valor diferencial */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionShell>
          <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
            <div className="badge-on-dark mb-6">
              <span className="badge-label-on-dark">{valueDifferential.badge}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-dark sm:text-3xl lg:text-4xl">
              {valueDifferential.title[0]}
              <br />
              <span className="text-muted-on-dark">{valueDifferential.title[1]}</span>
            </h2>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {valueDifferential.items.map((item, index) => {
              const Icon = valueDifferentialIcons[index]
              return (
                <StaggerItem key={item.title}>
                  <div className="group flex h-full flex-col rounded-2xl border border-agua/30 bg-gradient-to-br from-card to-agua/25 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-on-dark">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </SectionShell>
      </section>

      {/* Gestiones + CTA — fondo en el wrapper; blob entre fondo y contenido */}
      <div ref={gestionesZoneRef} className="relative isolate bg-background">
        <div
          ref={scrollBlobRef}
          className="pointer-events-none fixed z-[1] h-[min(75vw,420px)] w-[min(85vw,560px)] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-primary/20 blur-[100px] will-change-[transform,opacity] md:blur-[120px]"
          aria-hidden
        />

        <div className="relative z-[2]">
          {mainServices.map((service) => {
            const Icon = getServiceIconBySlug(service.slug)

            return (
              <section
                key={service.slug}
                id={service.slug}
                className="scroll-mt-36 py-20 md:py-28"
              >
                <SectionShell>
                  <div className="mb-12 max-w-3xl">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-on-dark sm:text-4xl">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-lg leading-relaxed text-muted-on-dark">{service.intro}</p>
                  </div>

                  <StaggerContainer
                    className="mb-12 grid gap-5 sm:grid-cols-2"
                    staggerDelay={0.08}
                  >
                    {service.sections.map((block) => (
                      <StaggerItem key={block.title}>
                        <article className="h-full rounded-2xl border border-agua/30 bg-gradient-to-br from-card/80 to-agua/15 p-6 md:p-8">
                          <h3 className="mb-3 text-lg font-semibold text-on-dark">
                            {block.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-on-dark md:text-base">
                            {block.description}
                          </p>
                        </article>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {service.benefits.length > 0 ? (
                    <FadeIn delay={0.1}>
                      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
                        <h3 className="mb-5 text-sm font-semibold tracking-wide text-primary uppercase">
                          Ventajas de nuestro servicio
                        </h3>
                        <ul className="grid gap-4 sm:grid-cols-2">
                          {service.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3">
                              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                              <span className="text-sm leading-relaxed text-on-dark/90 md:text-base">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeIn>
                  ) : null}
                </SectionShell>
              </section>
            )
          })}
        </div>
      </div>

      <CtaBrisaBand title={cta.title} subtitle={cta.subtitle} label={cta.label} />
    </main>
  )
}
