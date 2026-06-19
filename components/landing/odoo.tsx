"use client"

import Link from "next/link"
import { ArrowRight, Eye, ShieldCheck, Zap } from "lucide-react"
import { MarketingButton } from "@/components/ui/marketing-button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import {
  HoldedPartnerStrip,
  OdooCredential,
  OdooSteps,
} from "@/components/landing/odoo-partners"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { odoo } from "@/content/site"

const benefitIcons = [Eye, ShieldCheck, Zap]

export function Odoo() {
  return (
    <section
      id="odoo"
      className="section-divider relative overflow-hidden bg-surface-dark py-20 md:py-28"
    >
      <SectionShell>
        <MarketingSectionHeading
          badge={odoo.badge}
          title={odoo.title}
          subtitle={odoo.subtitle}
          className="mb-14 max-w-2xl"
        />

        <OdooCredential />

        <StaggerContainer
          className="mb-16 grid gap-8 md:grid-cols-3 md:gap-10"
          staggerDelay={0.1}
        >
          {odoo.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index]
            return (
              <StaggerItem key={benefit.title}>
                <div className="flex items-start justify-center gap-3 text-left md:flex-col md:items-center md:text-center">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary md:mt-0 md:h-6 md:w-6" />
                  <div>
                    <h3 className="mb-2 font-bold text-on-dark">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark md:text-base">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <OdooSteps className="mb-12" />

        <FadeIn className="text-center">
          <MarketingButton asChild size="lg">
            <Link href="/contacto">
              {odoo.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </MarketingButton>
        </FadeIn>

        <HoldedPartnerStrip />
      </SectionShell>
    </section>
  )
}
