import { intentDefinitions } from "@/content/chatbot"
import { contact, contactHref, odoo, plansByAudience, services, site, team } from "@/content/site"
import { normalizeText } from "./normalize"
import type { ChatReply } from "./types"

const EXPLICIT_CONTACT_PATTERNS = [
  /quiero\s+(hablar|contactar|llamar)/,
  /(hablar|llamar)\s+con\s+(un\s+)?(asesor|persona|equipo)/,
  /(me\s+)?llamais/,
  /(quiero|necesito)\s+presupuesto/,
  /agendar\s+(una\s+)?(llamada|cita)/,
]

function matchesIntent(query: string, patterns: RegExp[], keywords: string[]): boolean {
  if (patterns.some((pattern) => pattern.test(query))) return true
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean)
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword)
    if (normalizedKeyword.length >= 4) {
      return tokens.some(
        (token) =>
          token === normalizedKeyword ||
          token.startsWith(normalizedKeyword) ||
          normalizedKeyword.startsWith(token),
      )
    }
    return tokens.some(
      (token) => token.includes(normalizedKeyword) || normalizedKeyword.includes(token),
    )
  })
}

export function isExplicitContactIntent(query: string): boolean {
  const normalized = normalizeText(query)
  if (!normalized) return false
  return EXPLICIT_CONTACT_PATTERNS.some((pattern) => pattern.test(normalized))
}

export function matchIntent(query: string): ChatReply | null {
  const normalized = normalizeText(query)
  if (!normalized) return null

  for (const intent of intentDefinitions) {
    if (!matchesIntent(normalized, intent.patterns, intent.keywords)) continue

    switch (intent.id) {
      case "hours":
        return {
          source: "intent",
          text: `Horario de atención: lunes a viernes ${site.hours.weekdays}. Fin de semana: ${site.hours.weekend}.`,
          href: contactHref,
          linkLabel: "Contactar",
        }
      case "phone":
        return {
          source: "intent",
          text: `Puedes llamarnos al ${site.phone.display}.`,
          href: site.phone.href,
          linkLabel: "Llamar ahora",
        }
      case "email":
        return {
          source: "intent",
          text: `Escríbenos a ${site.email}.`,
          href: `mailto:${site.email}`,
          linkLabel: "Enviar email",
        }
      case "location":
        return {
          source: "intent",
          text: `Estamos en ${site.location}. Asesoramiento para autónomos, pymes y empresas digitales.`,
          href: "/nosotros",
          linkLabel: "Conocer al equipo",
        }
      case "contact":
        return {
          source: "intent",
          text: "Puedes usar formulario para consulta inicial gratuita.",
          href: contactHref,
          linkLabel: "Ir a contacto",
        }
      case "odoo":
        return {
          source: "intent",
          text: `${odoo.badge}. ${odoo.subtitle}`,
          href: "/#odoo",
          linkLabel: "Ver sección Odoo",
        }
      case "team":
        return {
          source: "intent",
          text: `${team.subtitle}`,
          href: "/nosotros",
          linkLabel: "Ver equipo",
        }
      case "services":
        return {
          source: "intent",
          text: "Cubrimos fiscal, contable, laboral y constitución de empresas.",
          href: "/servicios",
          linkLabel: "Ver todos los servicios",
        }
      case "plans": {
        const autonomosSummary = plansByAudience.autonomos.tiers
          .map((tier) => `${tier.name} (${tier.price}€/${tier.period})`)
          .join(", ")
        const empresasSummary = plansByAudience.empresas.tiers
          .map((tier) => `${tier.name} (${tier.price}€/${tier.period})`)
          .join(", ")
        return {
          source: "intent",
          text: `Tenemos plan para autónomos (${autonomosSummary}) y plan para empresas (${empresasSummary}). Precios orientativos.`,
          href: "/plan-autonomos",
          linkLabel: "Ver planes",
        }
      }
      default:
        break
    }
  }

  return null
}
