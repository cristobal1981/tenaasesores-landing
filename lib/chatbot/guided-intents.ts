import { contactHref, plansByAudience } from "@/content/site"
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

  const autonomosSummary = plansByAudience.autonomos.tiers
    .map((tier) => `${tier.name} (${tier.price}€/${tier.period})`)
    .join(", ")
  const empresasSummary = plansByAudience.empresas.tiers
    .map((tier) => `${tier.name} (${tier.price}€/${tier.period})`)
    .join(", ")

  return {
    source: "intent",
    text: `Tenemos planes separados para autónomos (${autonomosSummary}) y para empresas (${empresasSummary}). Precios orientativos; propuesta final según volumen.`,
    href: "/plan-autonomos",
    linkLabel: "Ver plan de autónomos",
  }
}

export function matchGuidedIntent(query: string): ChatReply | null {
  return matchConsultationHowTo(query) ?? matchPlansIntent(query)
}
