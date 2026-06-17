import type { Metadata } from "next"
import { ServicesPage } from "@/components/pages/services-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Servicios de asesoría fiscal, contable y laboral | tenaasesores",
  description:
    "Servicios de asesoría en Tenerife: gestión fiscal, contable, laboral y constitución de empresas. Supervisión profesional con Odoo y trato cercano.",
  path: "/servicios",
})

export default function ServiciosRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ])}
      />
      <ServicesPage />
    </>
  )
}
