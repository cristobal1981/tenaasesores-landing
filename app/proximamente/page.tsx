import type { Metadata } from "next"
import { ErrorScreen } from "@/components/errors/error-screen"
import { errorPages } from "@/content/errors"

const page = errorPages.wip

export const metadata: Metadata = {
  title: "Próximamente | tenaasesores",
  description: page.description,
  robots: { index: false, follow: true },
}

export default function ProximamentePage() {
  return (
    <ErrorScreen
      code={page.code}
      title={page.title}
      description={page.description}
      primaryHref={page.primaryHref}
      primaryLabel={page.primaryLabel}
    />
  )
}
