import type { Metadata } from "next"
import { FiscalidadCanariaPage } from "@/components/pages/fiscalidad-canaria-page"
import { JsonLd } from "@/components/seo/json-ld"
import { fiscalidadCanaria } from "@/content/fiscalidad-canaria"
import { breadcrumbSchema, fiscalidadCanariaServiceSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: fiscalidadCanaria.meta.title,
  description: fiscalidadCanaria.meta.description,
  path: "/fiscalidad-canaria",
})

export default function FiscalidadCanariaRoute() {
  return (
    <>
      <JsonLd
        data={[
          fiscalidadCanariaServiceSchema(),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Servicios", path: "/servicios" },
            { name: "Fiscalidad canaria", path: "/fiscalidad-canaria" },
          ]),
        ]}
      />
      <FiscalidadCanariaPage />
    </>
  )
}
