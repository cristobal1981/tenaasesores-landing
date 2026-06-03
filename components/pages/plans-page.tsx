import { FadeIn } from "@/components/animations"
import { PlansPageClient } from "@/components/pages/plans-page-client"
import { SectionShell } from "@/components/layout/section-shell"
import { plansByAudience } from "@/src/shared/config/site"

type PlansAudience = keyof typeof plansByAudience

export function PlansPage({ audience }: { audience: PlansAudience }) {
  const plans = plansByAudience[audience]

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

      <PlansPageClient audience={audience} />
    </main>
  )
}
