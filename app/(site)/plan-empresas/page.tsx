import type { Metadata } from "next"
import { PlansPage } from "@/components/pages/plans-page"
import { site } from "@/src/shared/config/site"

export const metadata: Metadata = {
  title: "Plan Empresas | tenaasesores",
  description:
    "Planes para empresas y pymes en crecimiento: cobertura fiscal, contable y laboral con acompañamiento continuo y respuesta prioritaria.",
  openGraph: {
    title: "Plan Empresas | tenaasesores",
    description: site.description,
    url: `${site.url}/plan-empresas`,
  },
  alternates: {
    canonical: `${site.url}/plan-empresas`,
  },
}

export default function PlanEmpresasRoute() {
  return <PlansPage audience="empresas" />
}
