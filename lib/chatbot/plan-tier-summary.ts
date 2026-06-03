import { planCustomizeForm } from "@/content/plan-customize-form"
import { plansByAudience } from "@/content/site"

type PlanTier =
  | (typeof plansByAudience.autonomos.tiers)[number]
  | (typeof plansByAudience.empresas.tiers)[number]

export function formatPlanTierPriceLabel(tier: PlanTier): string {
  if (tier.kind === "fixed") {
    return `${tier.name} (${tier.price}€/${tier.period})`
  }
  return `${tier.name} (propuesta tras formulario en la página)`
}

export function formatPlanTierBody(tier: PlanTier): string {
  const pricePart =
    tier.kind === "fixed" ? `${tier.price}€/${tier.period}, ` : "sin precio en web, "
  return `${tier.name}: ${pricePart}${tier.summary}`
}

export function planTierHref(audience: "autonomos" | "empresas", tier: PlanTier): string {
  const base = audience === "autonomos" ? "/plan-autonomos" : "/plan-empresas"
  if (tier.kind === "custom") {
    return `${base}#${planCustomizeForm.sectionId}`
  }
  return base
}

export function planTierKeywords(tier: PlanTier): string[] {
  if (tier.kind === "fixed") {
    return ["precio", tier.price, "suscripcion", "tarifa"]
  }
  return ["personalizado", "formulario", "propuesta", "a medida"]
}
