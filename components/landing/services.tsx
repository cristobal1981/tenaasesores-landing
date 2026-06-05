"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { StaggerContainer, StaggerItem, FloatingElement } from "@/components/animations"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { ServiceIconBadge } from "@/components/landing/service-icon-badge"
import { GradientCard } from "@/components/ui/gradient-card"
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
        <MarketingSectionHeading
          badge={services.badge}
          title={services.title}
          subtitle={services.subtitle}
        />

        <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
          {services.items.map((service) => {
            return (
              <StaggerItem key={service.title} className="h-full">
                <GradientCard>
                  <div className="flex gap-5 lg:gap-6">
                    <ServiceIconBadge slug={service.slug} size="lg" />
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-on-dark lg:text-xl">
                        {service.title}
                      </h3>
                      <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-muted-on-dark lg:line-clamp-2 lg:min-h-0 lg:text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/servicios#${service.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-on-dark group-hover:gap-3 lg:mt-6"
                  >
                    Más información
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </GradientCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </SectionShell>
    </section>
  )
}
