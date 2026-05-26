import type { Metadata } from "next"
import { ServicesPage } from "@/components/pages/services-page"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Servicios | tenaasesores",
  description:
    "Contabilidad, fiscalidad, laboral y constitución de empresas en Tenerife. Supervisión profesional con Odoo y trato cercano para autónomos y pymes.",
  openGraph: {
    title: "Servicios | tenaasesores",
    description: site.description,
    url: `${site.url}/servicios`,
  },
}

export default function ServiciosRoute() {
  return <ServicesPage />
}
