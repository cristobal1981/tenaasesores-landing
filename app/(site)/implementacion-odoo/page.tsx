import type { Metadata } from "next"
import { OdooImplementationPage } from "@/components/pages/odoo-implementation-page"
import { JsonLd } from "@/components/seo/json-ld"
import { odooImplementationMeta } from "@/content/odoo-implementation"
import { breadcrumbSchema } from "@/lib/seo/structured-data"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: odooImplementationMeta.title,
  description: odooImplementationMeta.description,
  path: "/implementacion-odoo",
})

export default function ImplementacionOdooRoute() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: "Implementación de Odoo", path: "/implementacion-odoo" },
        ])}
      />
      <OdooImplementationPage />
    </>
  )
}
