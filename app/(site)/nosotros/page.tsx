import type { Metadata } from "next"
import { TeamPage } from "@/components/pages/team-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Nuestro equipo | tenaasesores",
  description:
    "Conoce al equipo de tenaasesores: seis profesionales especializados en fiscal, contable, laboral y Odoo, con acceso directo, sin call center.",
  path: "/nosotros",
})

export default function NosotrosRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Nosotros", path: "/nosotros" },
        ])}
      />
      <TeamPage />
    </>
  )
}
