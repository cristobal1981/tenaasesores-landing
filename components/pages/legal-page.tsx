import { LegalPageContent } from "@/components/legal/legal-page-content"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { legalPages, type LegalPageSlug } from "@/content/legal"
import { formatLegalText } from "@/lib/legal/format-legal-text"

type LegalPageProps = {
  slug: LegalPageSlug
}

export function LegalPage({ slug }: LegalPageProps) {
  const page = legalPages[slug]

  return (
    <main className="min-h-screen">
      <DarkPageHero
        eyebrow="Información legal"
        title={page.title}
        lead={formatLegalText(page.intro, { tone: "dark" })}
      />

      <LegalPageContent slug={slug} />
    </main>
  )
}
