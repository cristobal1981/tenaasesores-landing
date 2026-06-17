import type { Metadata } from "next"
import { PlansPage } from "@/components/pages/plans-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Plan para autónomos — precio orientativo desde 69 €/mes | tenaasesores",
  description:
    "Plan mensual para autónomos en Tenerife: fiscal y contabilidad al día con precio orientativo, plan Base o personalizado según tu operativa.",
  path: "/plan-autonomos",
})

export default function PlanAutonomosRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Plan autónomos", path: "/plan-autonomos" },
        ])}
      />
      <PlansPage audience="autonomos" />
    </>
  )
}
