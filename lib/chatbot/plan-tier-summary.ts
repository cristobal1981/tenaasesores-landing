import { planCustomizeForm } from "@/content/plan-customize-form"
import { plansByAudience } from "@/content/site"

type PlanTier =
  | (typeof plansByAudience.autonomos.tiers)[number]
  | (typeof plansByAudience.empresas.tiers)[number]

export function formatPlanTierPriceLabel(tier: PlanTier): string {
  if (tier.kind === "fixed") {
    return `${tier.name} (${tier.price}€/${tier.period})`
  }
  if ("price" in tier && tier.price) {
    const prefix = "pricePrefix" in tier && tier.pricePrefix ? `${tier.pricePrefix} ` : ""
    const period = "period" in tier && tier.period ? tier.period : "mes"
    return `${tier.name} (${prefix}${tier.price}€/${period})`
  }
  return `${tier.name} (propuesta tras formulario en la página)`
}

export function formatPlanTierBody(tier: PlanTier): string {
  let pricePart = "sin precio en web, "
  if (tier.kind === "fixed") {
    pricePart = `${tier.price}€/${tier.period}, `
  } else if ("price" in tier && tier.price) {
    const prefix = "pricePrefix" in tier && tier.pricePrefix ? `${tier.pricePrefix} ` : ""
    const period = "period" in tier && tier.period ? tier.period : "mes"
    pricePart = `${prefix}${tier.price}€/${period}, `
  }
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
