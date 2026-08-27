"use client"

import Link from "next/link"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { MarketingButton } from "@/components/ui/marketing-button"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import { OdooSteps, PartnersDossier } from "@/components/landing/odoo-partners"
import { SectionIntro } from "@/components/layout/section-intro"
import { SectionShell } from "@/components/layout/section-shell"
import { odoo } from "@/content/site"

export function Odoo() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeSectionReveal({ sectionRef, stagger: 0.1 })

  return (
    <section
      ref={sectionRef}
      id="odoo"
      className="section-divider relative overflow-hidden bg-surface-dark py-24 md:py-32"
    >
      <SectionShell>
        <SectionIntro
          className="mx-auto mb-16"
          eyebrow={odoo.badge}
          title={odoo.title}
          subtitle={odoo.subtitle}
          align="center"
          tone="dark"
          reveal
        />

        <div data-home-reveal className="mb-20">
          <PartnersDossier />
        </div>

        <div data-home-reveal className="mb-16">
          <OdooSteps className="mx-auto max-w-4xl" />
        </div>

        <div
          data-home-reveal
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <MarketingButton asChild size="lg">
            <Link href="/contacto">
              {odoo.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </MarketingButton>
          <MarketingButton asChild size="lg" marketingVariant="secondary">
            <Link href="/implementacion-odoo">
              Ver cómo lo implementamos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </MarketingButton>
        </div>
      </SectionShell>
    </section>
  )
}
