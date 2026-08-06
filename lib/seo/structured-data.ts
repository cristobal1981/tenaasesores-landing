import { faqSections } from "@/content/faq"
import { legalEntity } from "@/content/legal"
import { contact, services, site } from "@/content/site"

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "AccountingService"],
    name: site.name,
    alternateName: legalEntity.businessName,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone.display,
    areaServed: {
      "@type": "Country",
      name: "España",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle El Toscal, nº 29, 1º pta 7",
      addressLocality: "Los Realejos",
      addressRegion: "Santa Cruz de Tenerife",
      addressCountry: "ES",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "15:00",
    },
    sameAs: contact.socials.map((social) => social.href),
  }
}

export function faqPageSchema() {
  const mainEntity = faqSections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  )

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}

export function servicesSchema() {
  return services.mainServices.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.intro,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
    },
    areaServed: {
      "@type": "Country",
      name: "España",
    },
    url: `${site.url}/servicios#${service.slug}`,
  }))
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}
