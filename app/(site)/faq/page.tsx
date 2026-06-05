import type { Metadata } from "next"
import { FaqPage } from "@/components/pages/faq-page"
import { faqPage } from "@/content/faq"
import { site } from "@/src/shared/config/site"

export const metadata: Metadata = {
  title: "Preguntas frecuentes | tenaasesores",
  description: faqPage.subtitle,
  openGraph: {
    title: "Preguntas frecuentes | tenaasesores",
    description: faqPage.subtitle,
    url: `${site.url}/faq`,
  },
}

export default function FaqRoute() {
  return <FaqPage />
}
