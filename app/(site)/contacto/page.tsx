import type { Metadata } from "next"
import { Contact } from "@/src/modules/contact/ui"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Contacto | Consulta gratuita | tenaasesores",
  description:
    "Solicita tu consulta gratuita con tenaasesores. Cuéntanos tu situación fiscal, contable o laboral: te contactamos en menos de 24h laborables, sin compromiso.",
  path: "/contacto",
})

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Contacto", path: "/contacto" },
        ])}
      />
      <Contact />
    </>
  )
}
