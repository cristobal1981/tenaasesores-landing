import type { Metadata } from "next"
import { FaqPage } from "@/components/pages/faq-page"
import { JsonLd } from "@/components/seo/json-ld"
import { faqPage } from "@/content/faq"
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes sobre asesoría y planes | tenaasesores",
  description: faqPage.subtitle,
  path: "/faq",
})

export default function FaqRoute() {
  return (
    <>
      <JsonLd data={[faqPageSchema(), breadcrumbSchema([
        { name: "Inicio", path: "/" },
        { name: "Preguntas frecuentes", path: "/faq" },
      ])]} />
      <FaqPage />
    </>
  )
}
