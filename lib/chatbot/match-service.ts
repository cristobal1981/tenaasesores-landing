import { services } from "@/content/site"
import { normalizeText, tokenize } from "./normalize"
import type { ChatReply } from "./types"

const SERVICE_PATTERNS: Record<string, RegExp[]> = {
  fiscal: [/fiscal/, /impuesto/, /hacienda/, /iva/, /igic/, /tribut/, /deduccion/, /auditoria/],
  contable: [/contable/, /contabilidad/, /balance/, /cuenta/, /asiento/, /financier/],
  laboral: [/laboral/, /nomina/, /nominas/, /contrato/, /seguridad social/, /sepe/, /empleado/],
  constitucion: [/constitucion/, /constituir/, /autonomo/, /sociedad limitada/, /\bsl\b/, /alta empresa/, /licencia/],
}

export function matchServiceIntent(query: string): ChatReply | null {
  const normalized = normalizeText(query)
  if (!normalized) return null

  for (const service of services.mainServices) {
    const patterns = SERVICE_PATTERNS[service.slug]
    if (!patterns?.some((pattern) => pattern.test(normalized))) continue

    return {
      source: "intent",
      text: `${service.title}: ${service.intro}`,
      href: `/servicios#${service.slug}`,
      linkLabel: "Ver servicio",
    }
  }

  const tokens = tokenize(query)
  for (const service of services.mainServices) {
    if (tokens.some((t) => service.slug.includes(t) || t.includes(service.slug))) {
      return {
        source: "intent",
        text: `${service.title}: ${service.intro}`,
        href: `/servicios#${service.slug}`,
        linkLabel: "Ver servicio",
      }
    }
  }

  return null
}
