import Link from "next/link"
import { ArrowRight, Check, CheckCircle2 } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { SectionShell } from "@/components/layout/section-shell"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
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

export function PlansPage({ audience }: { audience: PlansAudience }) {
  const plans = plansByAudience[audience]
  const comparisonRows = plans.comparisonTable.rows as ReadonlyArray<Record<string, string>>

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-agua/30 py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(1,222,162,0.17),transparent_36%),radial-gradient(circle_at_85%_14%,rgba(1,99,92,0.18),transparent_40%),linear-gradient(to_bottom,rgba(6,42,51,0.72),rgba(4,29,35,0.94))]"
        />
        <SectionShell>
          <FadeIn className="relative mx-auto max-w-3xl text-center">
            <div className="badge-on-dark mb-6">
              <span className="badge-label-on-dark">{plans.badge}</span>
            </div>
            <h1 className="mb-6 text-3xl leading-[1.15] font-bold text-on-dark sm:text-4xl lg:text-5xl">
              {plans.title[0]}
              <br />
              <span className="text-primary">{plans.title[1]}</span>
            </h1>
            <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-dark">{plans.subtitle}</p>
          </FadeIn>
        </SectionShell>
      </section>

      <section className="py-16 md:py-20">
        <SectionShell>
          <StaggerContainer className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3" staggerDelay={0.1}>
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

                      <p className="mb-1 text-4xl font-bold text-on-dark">
                        {tier.price}
                        <span className="ml-1 text-xl text-muted-on-dark">€</span>
                        <span className="ml-2 text-base font-medium text-muted-on-dark">/{tier.period}</span>
                      </p>
                      <p className="mb-5 text-sm font-medium text-primary">{tier.responseSla}</p>

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

                      <Button
                        asChild
                        className={cn(
                          "mt-auto w-full",
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
                    </div>
                  </article>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.12} className="mx-auto mt-12 max-w-6xl">
            <div className="rounded-2xl border border-agua/35 bg-card/70 p-4 md:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-on-dark md:text-2xl">
                    {plans.comparisonTable.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-on-dark">{plans.comparisonTable.subtitle}</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-agua/25">
                <table className="w-full min-w-[46rem] border-collapse text-left">
                  <caption className="sr-only">{plans.comparisonTable.title}</caption>
                  <thead>
                    <tr className="bg-on-light/5">
                      <th scope="col" className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-on-dark uppercase">
                        Prestaciones
                      </th>
                      {plans.tiers.map((tier) => (
                        <th
                          key={`head-${tier.name}`}
                          scope="col"
                          className={cn(
                            "px-4 py-3 text-center text-xs font-semibold tracking-wide uppercase",
                            tier.highlight ? "bg-primary/12 text-on-dark" : "text-muted-on-dark"
                          )}
                        >
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, rowIndex) => (
                      <tr key={row.feature} className="border-t border-agua/20">
                        <th
                          scope="row"
                          className={cn(
                            "px-4 py-3 text-sm font-medium text-on-dark",
                            rowIndex % 2 === 0 ? "bg-on-light/4" : "bg-transparent"
                          )}
                        >
                          {row.feature}
                        </th>
                        {plans.tiers.map((tier) => {
                          const value = row[tier.name] ?? "—"
                          const isIncluded = value.toLowerCase().includes("inclu")

                          return (
                            <td
                              key={`${row.feature}-${tier.name}`}
                              className={cn(
                                "px-4 py-3 text-center text-sm text-on-dark",
                                tier.highlight && "bg-primary/8"
                              )}
                            >
                              <span className="inline-flex items-center justify-center gap-1.5">
                                {isIncluded ? (
                                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                                ) : null}
                                <span>{value}</span>
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.16} className="mx-auto mt-8 max-w-5xl text-center">
            <p className="text-xs leading-relaxed text-muted-on-dark">{plans.legalNote}</p>
          </FadeIn>
        </SectionShell>
      </section>

      <CtaBrisaBand title={plans.ctaTitle} subtitle={plans.ctaSubtitle} label={plans.ctaLabel} />
    </main>
  )
}
