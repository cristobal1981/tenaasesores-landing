"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Eye, ShieldCheck, Zap } from "lucide-react"
import { IconFeatureCard } from "@/components/ui/icon-feature-card"
import { MarketingButton } from "@/components/ui/marketing-button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { odoo } from "@/content/site"

const benefitIcons = [Eye, ShieldCheck, Zap]

export function Odoo() {
  return (
    <section
      id="odoo"
      className="relative overflow-hidden border-y border-agua/20 bg-surface-dark py-20 md:py-28"
    >
      <SectionShell>
        <MarketingSectionHeading
          badge={odoo.badge}
          title={odoo.title}
          subtitle={odoo.subtitle}
          className="mb-14 max-w-3xl"
        />

        <FadeIn className="mb-14">
          <div className="rounded-2xl border border-on-dark/15 bg-surface-light/95 p-6 md:flex md:items-center md:gap-8 md:p-8">
            <p className="mb-6 text-base leading-relaxed text-muted-on-light md:mb-0 md:flex-1">
              {odoo.partners.text}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:shrink-0">
              <div className="flex items-center justify-center rounded-lg bg-white px-5 py-3 shadow-sm">
                <Image
                  src={odoo.partners.odoo.src}
                  alt={odoo.partners.odoo.alt}
                  width={odoo.partners.odoo.width}
                  height={odoo.partners.odoo.height}
                  className="h-10 w-auto object-contain md:h-12"
                />
              </div>
              <div className="flex items-center justify-center rounded-lg bg-white px-4 py-3 shadow-sm">
                <Image
                  src={odoo.partners.holded.src}
                  alt={odoo.partners.holded.alt}
                  width={odoo.partners.holded.width}
                  height={odoo.partners.holded.height}
                  className="h-7 w-auto object-contain md:h-8"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer
          className="mb-16 grid gap-6 md:grid-cols-3"
          staggerDelay={0.1}
        >
          {odoo.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index]
            return (
              <StaggerItem key={benefit.title}>
                <IconFeatureCard
                  icon={Icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <FadeIn>
          <p className="mb-8 text-center font-sans text-sm font-semibold tracking-wide text-primary uppercase">
            {odoo.stepsTitle}
          </p>
        </FadeIn>

        <StaggerContainer className="mb-12 grid gap-6 md:grid-cols-3" staggerDelay={0.08}>
          {odoo.steps.map((step, index) => (
            <StaggerItem key={step.title}>
              <div className="flex h-full gap-4 rounded-2xl border border-on-dark/15 bg-gradient-to-br from-surface-dark to-agua/80 p-6">
                <span className="font-sans text-3xl font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="mb-2 font-semibold text-on-dark">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-on-dark">
                    {step.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="text-center">
          <MarketingButton asChild size="lg">
            <Link href="/contacto">
              {odoo.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </MarketingButton>
        </FadeIn>
      </SectionShell>
    </section>
  )
}
