import type { Metadata } from "next"
import { AsesoriaContableTenerifePage } from "@/components/pages/asesoria-contable-tenerife-page"
import { JsonLd } from "@/components/seo/json-ld"
import { asesoriaContableTenerife } from "@/content/asesoria-contable-tenerife"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: asesoriaContableTenerife.meta.title,
  description: asesoriaContableTenerife.meta.description,
  path: "/asesoria-contable-tenerife",
})

export default function AsesoriaContableTenerifeRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Asesoría en Tenerife", path: "/asesoria-contable-tenerife" },
        ])}
      />
      <AsesoriaContableTenerifePage />
    </>
  )
}
