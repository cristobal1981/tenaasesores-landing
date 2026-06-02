import type { Metadata } from "next"
import { PlansPage } from "@/components/pages/plans-page"
import { site } from "@/src/shared/config/site"

export const metadata: Metadata = {
  title: "Plan Autónomos | tenaasesores",
  description:
    "Plan mensual para autónomos y microempresas: cobertura fiscal y contable con precios orientativos, soporte claro y posibilidad de escalar.",
  openGraph: {
    title: "Plan Autónomos | tenaasesores",
    description: site.description,
    url: `${site.url}/plan-autonomos`,
  },
  alternates: {
    canonical: `${site.url}/plan-autonomos`,
  },
}

export default function PlanAutonomosRoute() {
  return <PlansPage audience="autonomos" />
}
