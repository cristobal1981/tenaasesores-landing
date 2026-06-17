import type { Metadata } from "next"
import { LegalPage } from "@/components/pages/legal-page"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad | tenaasesores",
  description:
    "Política de privacidad y protección de datos de tenaasesores. Información sobre el tratamiento de datos personales conforme al RGPD.",
  path: "/privacidad",
})

export default function PrivacidadRoute() {
  return <LegalPage slug="privacidad" />
}
