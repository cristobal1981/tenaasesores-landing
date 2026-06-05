import type { Metadata } from "next"
import { TeamPage } from "@/components/pages/team-page"
import { site } from "@/src/shared/config/site"

export const metadata: Metadata = {
  title: "Nosotros | tenaasesores",
  description:
    "Conoce al equipo de tenaasesores en Tenerife. Seis profesionales, trato directo y asesoría contable, fiscal y laboral con Odoo.",
  openGraph: {
    title: "Nosotros | tenaasesores",
    description: site.description,
    url: `${site.url}/nosotros`,
  },
}

export default function NosotrosRoute() {
  return <TeamPage />
}
