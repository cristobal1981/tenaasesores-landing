import type { Metadata } from "next"
import { LegalPage } from "@/components/pages/legal-page"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Aviso legal | tenaasesores",
  description:
    "Aviso legal e información del titular del sitio web de tenaasesores. Condiciones de uso, propiedad intelectual y legislación aplicable.",
  path: "/aviso-legal",
})

export default function AvisoLegalRoute() {
  return <LegalPage slug="aviso-legal" />
}
