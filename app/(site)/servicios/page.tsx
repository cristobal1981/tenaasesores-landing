import type { Metadata } from "next"
import { ServicesPage } from "@/components/pages/services-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema, servicesSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Servicios: fiscal, contable y laboral | tenaasesores",
  description:
    "Servicios de asesoría online: gestión fiscal, contable, laboral y constitución de empresas. Supervisión profesional con Odoo y trato cercano.",
  path: "/servicios",
})

export default function ServiciosRoute() {
  return (
    <>
      <JsonLd
        data={[
          ...servicesSchema(),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Servicios", path: "/servicios" },
          ]),
        ]}
      />
      <ServicesPage />
    </>
  )
}
