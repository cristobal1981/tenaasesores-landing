"use client"

import Link from "next/link"
import { useCallback, useId } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/animations"
import { PlanCustomizeWizard } from "@/components/pages/plan-customize-wizard"
import { BrisaFormCard, BrisaFormSection, DarkFormPanel } from "@/components/layout/brisa-form-section"
import { SectionShell } from "@/components/layout/section-shell"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
import { planCustomizeForm } from "@/content/plan-customize-form"
import { plansByAudience } from "@/src/shared/config/site"
import { cn } from "@/lib/utils"

function PlanCardGeometries({ index, highlight }: { index: number; highlight: boolean }) {
  if (highlight) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
        <div className="absolute -top-10 -right-8 h-40 w-40 rounded-full border border-primary/35 bg-primary/14" />
        <div className="absolute right-5 bottom-8 h-16 w-16 rounded-full border border-agua/45 bg-agua/18" />
        <div className="absolute -bottom-8 left-1/3 h-20 w-36 -translate-x-1/2 rounded-t-full border border-primary/25 bg-primary/8" />
        <div className="absolute top-12 left-6 h-10 w-10 rotate-45 border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  if (index % 2 === 0) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-agua/60 to-transparent" />
        <div className="absolute -right-7 top-5 h-24 w-24 rounded-full border border-agua/30 bg-agua/10" />
        <div className="absolute bottom-5 left-6 h-7 w-7 rounded-full bg-primary/12" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-agua/60 to-transparent" />
      <div className="absolute -left-8 top-1/3 h-20 w-20 rounded-full border border-primary/25 bg-primary/8" />
      <div className="absolute right-6 bottom-0 h-10 w-20 rounded-tl-3xl bg-agua/10" />
    </div>
  )
}

type PlansAudience = keyof typeof plansByAudience

export function PlansPageClient({ audience }: { audience: PlansAudience }) {
  const plans = plansByAudience[audience]
  const customizeHeadingId = useId()
  const scrollToCustomizeForm = useCallback(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const section = document.getElementById(planCustomizeForm.sectionId)
    section?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    })
    window.setTimeout(() => {
      const formRoot = section?.querySelector("[data-plan-customize-form]")
      const firstControl =
        formRoot?.querySelector<HTMLButtonElement>('button[role="radio"]') ??
        formRoot?.querySelector<HTMLInputElement>("input")
      firstControl?.focus()
    }, reducedMotion ? 0 : 400)
  }, [])

  return (
    <>
    <section className="py-16 md:py-20">
      <SectionShell>
        <StaggerContainer className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2" staggerDelay={0.1}>
          {plans.tiers.map((tier, index) => (
            <StaggerItem key={tier.name}>
              <div className="relative h-full">
                {tier.highlight ? (
                  <span className="absolute top-0 right-6 z-20 -translate-y-[35%] rounded-full border border-primary/55 bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-background uppercase shadow-md shadow-primary/30">
                    Recomendado
                  </span>
                ) : null}
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-[border-color,transform,box-shadow] duration-300 ease-out md:p-8",
                    tier.highlight
                      ? "border-primary/60 bg-gradient-to-br from-card/95 to-agua/24 shadow-[0_14px_34px_-14px_rgba(1,222,162,0.45)]"
                      : "border-agua/35 bg-card/80 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg hover:shadow-agua/10"
                  )}
                >
                  <PlanCardGeometries index={index} highlight={tier.highlight} />
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-2xl font-semibold text-on-dark">{tier.name}</h2>
                        <p className="mt-1 text-sm text-muted-on-dark">{tier.audience}</p>
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-muted-on-dark">{tier.summary}</p>

                    {tier.kind === "fixed" ? (
                      <>
                        <p className="mb-1 text-4xl font-bold text-on-dark">
                          {tier.price}
                          <span className="ml-1 text-xl text-muted-on-dark">€</span>
                          <span className="ml-2 text-base font-medium text-muted-on-dark">/{tier.period}</span>
                        </p>
                        <p className="mb-5 text-sm font-medium text-primary">{tier.responseSla}</p>
                      </>
                    ) : (
                      <p className="mb-5 text-sm font-medium text-primary">
                        Propuesta tras revisar tu caso
                      </p>
                    )}

                    <ul className="mb-7 grid gap-3 md:flex-1">
                      {tier.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2
                            aria-hidden="true"
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0 text-primary",
                              tier.highlight && "motion-safe:animate-pulse [animation-duration:2.8s]"
                            )}
                          />
                          <span className="text-sm leading-relaxed text-on-dark">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {tier.kind === "fixed" ? (
                      <Button
                        asChild
                        className={cn(
                          "mt-auto w-full min-h-11",
                          marketingCtaBaseClassName,
                          tier.highlight
                            ? marketingCtaVariantClassName.primary
                            : marketingCtaVariantClassName.secondary
                        )}
                      >
                        <Link href="/contacto">
                          {tier.ctaLabel}
                          <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={scrollToCustomizeForm}
                        className={cn(
                          "mt-auto w-full min-h-11",
                          marketingCtaBaseClassName,
                          tier.highlight
                            ? marketingCtaVariantClassName.primary
                            : marketingCtaVariantClassName.secondary
                        )}
                      >
                        {tier.ctaLabel}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </article>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <aside
          role="note"
          aria-label="Información sobre precios de los planes"
          className="mx-auto mt-6 max-w-4xl rounded-xl border border-agua/35 bg-on-dark/10 px-4 py-3.5 md:px-5 md:py-4"
        >
          <p className="text-center text-sm leading-relaxed text-muted-on-dark md:text-left">
            {plans.planNote}
          </p>
        </aside>
      </SectionShell>
    </section>

    <BrisaFormSection
      id={planCustomizeForm.sectionId}
      className="scroll-mt-28"
      aria-labelledby={customizeHeadingId}
    >
      <BrisaFormCard maxWidthClassName="max-w-4xl">
        <DarkFormPanel>
          <PlanCustomizeWizard audience={audience} sectionTitleId={customizeHeadingId} />
        </DarkFormPanel>
      </BrisaFormCard>
    </BrisaFormSection>
    </>
  )
}
