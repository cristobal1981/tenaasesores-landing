import type { Metadata } from "next"
import { PlansPage } from "@/components/pages/plans-page"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Plan para empresas y pymes en Tenerife | tenaasesores",
  description:
    "Plan a medida para empresas y pymes en Tenerife: fiscal, contable y laboral adaptado a tu negocio. Planes desde 120 €/mes.",
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
