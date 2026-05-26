import { intentDefinitions } from "@/content/chatbot"
import { contact, contactHref, odoo, services, site, team } from "@/content/site"
import { normalizeText } from "./normalize"
import type { ChatReply } from "./types"

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
          text: `${contact.subtitle}`,
          href: contactHref,
          linkLabel: contact.formTitle,
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
          text: `${team.subtitle} El equipo incluye: ${team.members.map((m) => `${m.name} (${m.role})`).join("; ")}.`,
          href: "/nosotros",
          linkLabel: "Ver equipo",
        }
      case "services":
        return {
          source: "intent",
          text: `Ofrecemos: ${services.items.map((s) => s.title).join(", ")}. ${services.subtitle}`,
          href: "/servicios",
          linkLabel: "Ver todos los servicios",
        }
      default:
        break
    }
  }

  return null
}
