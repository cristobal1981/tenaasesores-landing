export const serviceSlugs = ["fiscal", "contable", "laboral", "constitucion"] as const

export type ServiceSlug = (typeof serviceSlugs)[number]

/** Icon badge tints per service — cards/sections stay on brand green. */
export const serviceAccentBySlug: Record<
  ServiceSlug,
  { badge: string; icon: string; badgeHover: string }
> = {
  fiscal: {
    badge: "bg-service-fiscal/20",
    icon: "text-service-fiscal",
    badgeHover: "group-hover:bg-service-fiscal/30",
  },
  contable: {
    badge: "bg-service-contable/20",
    icon: "text-service-contable",
    badgeHover: "group-hover:bg-service-contable/30",
  },
  laboral: {
    badge: "bg-service-laboral/20",
    icon: "text-service-laboral",
    badgeHover: "group-hover:bg-service-laboral/30",
  },
  constitucion: {
    badge: "bg-service-constitucion/20",
    icon: "text-service-constitucion",
    badgeHover: "group-hover:bg-service-constitucion/30",
  },
}

const defaultAccent = serviceAccentBySlug.fiscal

export function getServiceAccent(slug: string) {
  if (slug in serviceAccentBySlug) {
    return serviceAccentBySlug[slug as ServiceSlug]
  }
  return defaultAccent
}
