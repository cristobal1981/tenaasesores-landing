import type { Metadata } from "next"
import { PlansPage } from "@/components/pages/plans-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Plan para empresas y pymes en Tenerife | tenaasesores",
  description:
    "Planes para empresas en Tenerife: constitución con precio orientativo o plan personalizado con fiscal, contable y laboral a medida.",
  path: "/plan-empresas",
})

export default function PlanEmpresasRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Plan empresas", path: "/plan-empresas" },
        ])}
      />
      <PlansPage audience="empresas" />
    </>
  )
}
