import type { Metadata } from "next"
import { Contact } from "@/src/modules/contact/ui"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Contacto | Consulta gratuita | tenaasesores",
  description:
    "Solicita tu consulta gratuita con tenaasesores. Respuesta en menos de 24 horas laborables, sin compromiso.",
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
