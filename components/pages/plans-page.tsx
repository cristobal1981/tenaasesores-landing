import { PlansPageClient } from "@/components/pages/plans-page-client"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { plansByAudience } from "@/src/shared/config/site"

type PlansAudience = keyof typeof plansByAudience

export function PlansPage({ audience }: { audience: PlansAudience }) {
  const plans = plansByAudience[audience]

  return (
    <main className="min-h-screen bg-background">
      <DarkPageHero
        eyebrow={plans.badge}
        title={plans.title}
        lead={plans.subtitle}
        align="center"
        padding="spacious"
        gradient="strong"
        className="border-b-0"
      />

      <PlansPageClient audience={audience} />
    </main>
  )
}
