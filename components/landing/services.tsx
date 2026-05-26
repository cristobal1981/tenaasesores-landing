"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem, FloatingElement } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { getServiceIcon } from "@/lib/service-icons"
import { services } from "@/content/site"

export function Services() {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <FloatingElement
          className="h-[min(85vw,560px)] w-[min(95vw,720px)] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-primary/25 blur-[100px]"
          duration={14}
        />
      </div>
      <FloatingElement
        className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        duration={10}
        delay={2}
      />

      <SectionShell>
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <div className="badge-on-dark mb-6">
            <span className="badge-label-on-dark">{services.badge}</span>
          </div>
          <h2 className="mb-6 text-3xl leading-[1.2] font-bold text-on-dark sm:text-4xl lg:text-5xl">
            {services.title[0]}
            <br />
            <span className="text-muted-on-dark">{services.title[1]}</span>
          </h2>
          <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-dark">
            {services.subtitle}
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
          {services.items.map((service, index) => {
            const Icon = getServiceIcon(index)
            return (
              <StaggerItem key={service.title}>
                <div className="group flex h-full flex-col rounded-2xl border border-agua/30 bg-gradient-to-br from-card to-agua/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 md:p-8">
                  <div className="flex gap-5 md:gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/30 md:h-20 md:w-20">
                      <Icon className="h-8 w-8 text-primary md:h-10 md:w-10" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-on-dark md:text-xl">
                        {service.title}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-on-dark md:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/servicios#${service.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-on-dark group-hover:gap-3 md:mt-6"
                  >
                    Más información
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </SectionShell>
    </section>
  )
}
