import type { Metadata } from "next"
import { TeamPage } from "@/components/pages/team-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Equipo de asesoría online | tenaasesores",
  description:
    "Conoce al equipo de tenaasesores: seis profesionales online con trato directo en fiscal, contable, laboral y Odoo.",
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
