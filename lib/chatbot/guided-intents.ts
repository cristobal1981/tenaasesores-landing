import { contactHref, plansByAudience } from "@/content/site"
import { formatPlanTierPriceLabel } from "@/lib/chatbot/plan-tier-summary"
import { planCustomizeForm } from "@/content/plan-customize-form"
import { normalizeText } from "./normalize"
import type { ChatReply } from "./types"

const CONSULTATION_HOWTO_PATTERNS = [
  /como\s+(solicito|pido|puedo|hago|reservo)/,
  /(solicitar|pedir|reservar)\s+(una\s+)?consulta/,
  /donde\s+(dejo|envio|relleno)\s+(la\s+)?consulta/,
  /formulario\s+de\s+consulta/,
]

const PLANS_PATTERNS = [
  /\bplanes\b/,
  /\bplan\b/,
  /\bsuscrip/,
  /\btarifas?\b/,
  /\bprecios?\b/,
  /cuanto\s+cuesta/,
  /cuanto\s+vale/,
  /\bmes\b.*\beur/,
]

function matchesAny(normalized: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(normalized))
}

export function matchConsultationHowTo(query: string): ChatReply | null {
  const normalized = normalizeText(query)
  if (!normalized || !matchesAny(normalized, CONSULTATION_HOWTO_PATTERNS)) return null

  return {
    source: "intent",
    text: "Deja tu caso en el formulario de contacto. Primera consulta gratuita y sin compromiso; respondemos en menos de 24h laborables.",
    href: contactHref,
    linkLabel: "Ir al formulario",
  }
}

export function matchPlansIntent(query: string): ChatReply | null {
  const normalized = normalizeText(query)
  if (!normalized || !matchesAny(normalized, PLANS_PATTERNS)) return null

  const autonomosSummary = plansByAudience.autonomos.tiers.map(formatPlanTierPriceLabel).join(", ")
  const empresasSummary = plansByAudience.empresas.tiers.map(formatPlanTierPriceLabel).join(", ")

  return {
    source: "intent",
    text: `Autónomos: ${autonomosSummary}. Empresas: ${empresasSummary}. Plan personalizado: formulario en la página (#${planCustomizeForm.sectionId}).`,
    href: "/plan-autonomos",
    linkLabel: "Ver plan de autónomos",
  }
}

export function matchGuidedIntent(query: string): ChatReply | null {
  return matchConsultationHowTo(query) ?? matchPlansIntent(query)
}
