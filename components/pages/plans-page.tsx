import { PlansPageClient } from "@/components/pages/plans-page-client"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { plansByAudience } from "@/src/shared/config/site"

type PlansAudience = keyof typeof plansByAudience

export function PlansPage({ audience }: { audience: PlansAudience }) {
  const plans = plansByAudience[audience]

  return (
    <main className="min-h-screen bg-background">
      <DarkPageHero
        badge={plans.badge}
        title={plans.title}
        titleLine2Tone="primary"
        lead={plans.subtitle}
        align="center"
        padding="spacious"
        gradient="strong"
      />

      <PlansPageClient audience={audience} />
    </main>
  )
}
