import type { Metadata } from "next"
import { LegalPage } from "@/components/pages/legal-page"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Política de cookies | tenaasesores",
  description:
    "Política de cookies de tenaasesores: tipos de cookies, finalidades, terceros implicados y cómo gestionar o revocar tu consentimiento en cualquier momento.",
  path: "/cookies",
})

export default function CookiesRoute() {
  return <LegalPage slug="cookies" />
}
