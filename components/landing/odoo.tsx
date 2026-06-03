"use client"

import Link from "next/link"
import { ArrowRight, Eye, ShieldCheck, Zap } from "lucide-react"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { odoo } from "@/content/site"
import { cn } from "@/lib/utils"

const benefitIcons = [Eye, ShieldCheck, Zap]

export function Odoo() {
  return (
    <section
      id="odoo"
      className="relative overflow-hidden border-y border-agua/20 bg-surface-dark py-20 md:py-28"
    >
      <SectionShell>
        <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
          <div className="badge-on-dark mb-6">
            <span className="badge-label-on-dark">{odoo.badge}</span>
          </div>
          <h2 className="mb-6 text-3xl leading-[1.2] font-bold text-on-dark sm:text-4xl lg:text-5xl">
            {odoo.title[0]}
            <br />
            <span className="text-muted-on-dark">{odoo.title[1]}</span>
          </h2>
          <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-dark">
            {odoo.subtitle}
          </p>
        </FadeIn>

        <StaggerContainer
          className="mb-16 grid gap-6 md:grid-cols-3"
          staggerDelay={0.1}
        >
          {odoo.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index]
            return (
              <StaggerItem key={benefit.title}>
                <div className="h-full rounded-2xl border border-on-dark/15 bg-on-dark/5 p-6 transition-colors hover:border-primary/35">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-on-dark">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-on-dark">
                    {benefit.description}
                  </p>
                </div>
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
          <Button
            asChild
            size="lg"
            className={cn(marketingCtaBaseClassName, marketingCtaVariantClassName.primary)}
          >
            <Link href="/contacto">
              {odoo.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </SectionShell>
    </section>
  )
}
