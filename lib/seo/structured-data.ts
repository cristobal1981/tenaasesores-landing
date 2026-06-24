import { faqSections } from "@/content/faq"
import { site } from "@/content/site"

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
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
      addressLocality: "Tenerife",
      addressRegion: "Canarias",
      addressCountry: "ES",
    },
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
