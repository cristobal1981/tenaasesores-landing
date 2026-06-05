import {
  about,
  contact,
  contactHref,
  hero,
  odoo,
  philosophy,
  plansByAudience,
  services,
  site,
  team,
  testimonials,
} from "@/content/site"
import { faqHref, faqSections } from "@/content/faq"
import {
  formatPlanTierBody,
  planTierHref,
  planTierKeywords,
} from "@/lib/chatbot/plan-tier-summary"
import type { KnowledgeChunk } from "./types"

const SERVICE_KEYWORDS: Record<string, string[]> = {
  fiscal: ["fiscal", "impuestos", "hacienda", "iva", "igic", "tributario", "deducciones", "auditoria"],
  contable: ["contable", "contabilidad", "balances", "cuentas", "financiero", "asientos"],
  laboral: ["laboral", "nomina", "nominas", "contratos", "seguridad social", "empleados", "sepe"],
  constitucion: ["constitucion", "alta", "autonomo", "sociedad limitada", "sl", "empresa nueva", "licencias"],
}

function chunk(
  partial: Omit<KnowledgeChunk, "keywords"> & { keywords?: string[] },
): KnowledgeChunk {
  return {
    ...partial,
    keywords: partial.keywords ?? [],
  }
}

export function flattenSiteContent(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []

  chunks.push(
    chunk({
      id: "site-general",
      topic: "general",
      title: `${site.name} — ${site.tagline}`,
      body: `${site.description} Ubicación: ${site.location}. Email: ${site.email}. Teléfono: ${site.phone.display}. Horario laborables: ${site.hours.weekdays}. Fin de semana: ${site.hours.weekend}.`,
      href: contactHref,
      keywords: ["tenaasesores", "asesoria", "gestoria", "tenerife", "consultoria", "empresas digitales"],
    }),
  )

  chunks.push(
    chunk({
      id: "hero",
      topic: "inicio",
      title: "Gestoría moderna y cercana",
      body: `${hero.subtitle} ${hero.trust.map((t) => `${t.title}: ${t.subtitle}`).join(". ")}.`,
      href: "/",
      keywords: ["inicio", "autonomos", "pymes", "consulta"],
    }),
  )

  chunks.push(
    chunk({
      id: "contact",
      topic: "contacto",
      title: contact.title.join(" "),
      body: `${contact.subtitle} ${contact.formTitle}.`,
      href: contactHref,
      keywords: ["contacto", "consulta", "formulario", "gratis", "cita"],
    }),
  )

  for (const section of faqSections) {
    for (const [index, item] of section.items.entries()) {
      chunks.push(
        chunk({
          id: `faq-${section.slug}-${index}`,
          topic: "faq",
          title: item.question,
          body: item.answer,
          href: `${faqHref}#${section.slug}`,
          keywords: ["faq", "preguntas", "dudas", section.slug, "consulta"],
        }),
      )
    }
  }

  chunks.push(
    chunk({
      id: "faq-page",
      topic: "faq",
      title: "Preguntas frecuentes",
      body: "Respuestas sobre servicios, planes, Odoo, equipo y contacto.",
      href: faqHref,
      keywords: ["faq", "preguntas", "dudas", "frecuentes", "ayuda"],
    }),
  )

  chunks.push(
    chunk({
      id: "plans-autonomos-overview",
      topic: "planes",
      title: plansByAudience.autonomos.title.join(" "),
      body: `${plansByAudience.autonomos.subtitle} ${plansByAudience.autonomos.tiers.map(formatPlanTierBody).join(" ")}`,
      href: "/plan-autonomos",
      keywords: ["planes", "plan", "autonomos", "suscripcion", "tarifa", "precio", "mensual", "base", "personalizado"],
    }),
  )

  chunks.push(
    chunk({
      id: "plans-empresas-overview",
      topic: "planes",
      title: plansByAudience.empresas.title.join(" "),
      body: `${plansByAudience.empresas.subtitle} ${plansByAudience.empresas.tiers.map(formatPlanTierBody).join(" ")}`,
      href: "/plan-empresas",
      keywords: ["planes", "plan", "empresas", "pymes", "suscripcion", "tarifa", "precio", "mensual", "constitucion", "personalizado"],
    }),
  )

  for (const tier of plansByAudience.autonomos.tiers) {
    chunks.push(
      chunk({
        id: `plan-autonomos-${tier.name.toLowerCase()}`,
        topic: "planes",
        title: `Plan ${tier.name}`,
        body: `${tier.summary} ${tier.audience}. ${tier.items.join(". ")}.`,
        href: planTierHref("autonomos", tier),
        keywords: ["plan", "autonomos", tier.name.toLowerCase(), ...planTierKeywords(tier)],
      }),
    )
  }

  for (const tier of plansByAudience.empresas.tiers) {
    chunks.push(
      chunk({
        id: `plan-empresas-${tier.name.toLowerCase().replace(/\s+/g, "-")}`,
        topic: "planes",
        title: `Plan ${tier.name}`,
        body: `${tier.summary} ${tier.audience}. ${tier.items.join(". ")}.`,
        href: planTierHref("empresas", tier),
        keywords: ["plan", "empresas", "pymes", tier.name.toLowerCase(), ...planTierKeywords(tier)],
      }),
    )
  }

  chunks.push(
    chunk({
      id: "services-overview",
      topic: "servicios",
      title: services.title.join(" "),
      body: `${services.subtitle} ${services.pageIntro.subtitle}`,
      href: "/servicios",
      keywords: ["servicios", "asesoramiento", "integral"],
    }),
  )

  for (const item of services.items) {
    chunks.push(
      chunk({
        id: `service-card-${item.slug}`,
        topic: "servicios",
        title: item.title,
        body: item.description,
        href: `/servicios#${item.slug}`,
        keywords: SERVICE_KEYWORDS[item.slug] ?? [],
      }),
    )
  }

  for (const item of services.valueDifferential.items) {
    chunks.push(
      chunk({
        id: `value-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
        topic: "servicios",
        title: item.title,
        body: item.description,
        href: "/servicios",
        keywords: ["valor", "diferencial", "portal", "formacion", "digital"],
      }),
    )
  }

  for (const service of services.mainServices) {
    const baseKeywords = SERVICE_KEYWORDS[service.slug] ?? []
    const href = `/servicios#${service.slug}`

    chunks.push(
      chunk({
        id: `service-${service.slug}-intro`,
        topic: "servicios",
        title: service.title,
        body: service.intro,
        href,
        keywords: baseKeywords,
      }),
    )

    for (const section of service.sections) {
      chunks.push(
        chunk({
          id: `service-${service.slug}-${section.title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
          topic: "servicios",
          title: `${service.title} — ${section.title}`,
          body: section.description,
          href,
          keywords: [...baseKeywords, section.title.toLowerCase()],
        }),
      )
    }

    chunks.push(
      chunk({
        id: `service-${service.slug}-benefits`,
        topic: "servicios",
        title: `${service.title} — Ventajas`,
        body: service.benefits.join(". "),
        href,
        keywords: baseKeywords,
      }),
    )
  }

  chunks.push(
    chunk({
      id: "odoo-overview",
      topic: "odoo",
      title: odoo.title.join(" "),
      body: `${odoo.subtitle} ${odoo.badge}.`,
      href: "/#odoo",
      keywords: ["odoo", "partner", "erp", "contabilidad", "migracion", "automatizacion"],
    }),
  )

  for (const benefit of odoo.benefits) {
    chunks.push(
      chunk({
        id: `odoo-benefit-${benefit.title.toLowerCase().replace(/\s+/g, "-")}`,
        topic: "odoo",
        title: benefit.title,
        body: benefit.description,
        href: "/#odoo",
        keywords: ["odoo", "partner", "supervision", "automatizacion"],
      }),
    )
  }

  for (const step of odoo.steps) {
    chunks.push(
      chunk({
        id: `odoo-step-${step.title.toLowerCase().replace(/\s+/g, "-")}`,
        topic: "odoo",
        title: step.title,
        body: step.description,
        href: "/#odoo",
        keywords: ["odoo", "migracion", "bancos", "facturas", "fiscal"],
      }),
    )
  }

  chunks.push(
    chunk({
      id: "team-overview",
      topic: "equipo",
      title: team.title.join(" "),
      body: team.subtitle,
      href: "/nosotros",
      keywords: ["equipo", "profesionales", "tenerife", "asesor"],
    }),
  )

  for (const member of team.members) {
    chunks.push(
      chunk({
        id: `team-${member.name.toLowerCase()}`,
        topic: "equipo",
        title: `${member.name} — ${member.role}`,
        body: member.bio,
        href: "/nosotros",
        keywords: ["equipo", member.name.toLowerCase(), member.role.toLowerCase()],
      }),
    )
  }

  for (const value of philosophy.values) {
    chunks.push(
      chunk({
        id: `philosophy-${value.letter}`,
        topic: "filosofia",
        title: `${philosophy.acronym} — ${value.title}`,
        body: value.description,
        href: "/",
        keywords: ["filosofia", "clave", value.title.toLowerCase(), philosophy.acronym.toLowerCase()],
      }),
    )
  }

  about.paragraphs.forEach((paragraph, index) => {
    chunks.push(
      chunk({
        id: `about-p${index}`,
        topic: "nosotros",
        title: about.title.join(" "),
        body: paragraph,
        href: "/nosotros",
        keywords: ["nosotros", "pymes", "autonomos", "odoo", "tenerife"],
      }),
    )
  })

  chunks.push(
    chunk({
      id: "about-features",
      topic: "nosotros",
      title: "Ventajas de trabajar con nosotros",
      body: about.features.join(". "),
      href: "/nosotros",
      keywords: ["permanencia", "tarifas", "respuesta", "asesor"],
    }),
  )

  for (const item of testimonials.items) {
    chunks.push(
      chunk({
        id: `testimonial-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        topic: "testimonios",
        title: `Testimonio de ${item.name}`,
        body: `${item.role}. ${item.content}`,
        href: "/#testimonios",
        keywords: ["testimonios", "opiniones", "clientes"],
      }),
    )
  }

  return chunks
}
