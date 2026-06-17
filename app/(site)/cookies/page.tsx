import type { Metadata } from "next"
import { LegalPage } from "@/components/pages/legal-page"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Política de cookies | tenaasesores",
  description:
    "Política de cookies de tenaasesores. Tipos de cookies, finalidades, terceros y cómo gestionar tu consentimiento.",
  path: "/cookies",
})

export default function CookiesRoute() {
  return <LegalPage slug="cookies" />
}
