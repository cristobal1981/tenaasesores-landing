"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { StaggerContainer, StaggerItem, FloatingElement } from "@/components/animations"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { ServiceIconBadge } from "@/components/landing/service-icon-badge"
import { services } from "@/content/site"

export function Services() {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-background pb-20 md:pb-28"
    >
      <div className="section-fade-line mb-10 md:mb-14" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <FloatingElement
          className="h-[min(85vw,560px)] w-[min(95vw,720px)] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-primary/20 blur-[100px]"
          duration={14}
        />
      </div>

      <SectionShell>
        <MarketingSectionHeading
          badge={services.badge}
          title={services.title}
          subtitle={services.subtitle}
        />

        <StaggerContainer
          className="grid divide-y divide-agua/25 md:grid-cols-2 md:gap-x-12 md:gap-y-12 md:divide-y-0"
          staggerDelay={0.1}
        >
          {services.items.map((service) => {
            return (
              <StaggerItem key={service.title} className="group py-8 md:py-0">
                <div className="flex gap-5 lg:gap-6">
                  <ServiceIconBadge slug={service.slug} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-on-dark lg:text-xl">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark lg:text-base">
                      {service.description}
                    </p>
                    <Link
                      href={`/servicios#${service.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-on-dark group-hover:gap-3 lg:mt-6"
                    >
                      Ver {service.title.toLowerCase()}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </SectionShell>
    </section>
  )
}
