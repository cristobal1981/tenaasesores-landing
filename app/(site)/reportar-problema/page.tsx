import type { Metadata } from "next"
import { WebIssueReportPage } from "@/components/pages/web-issue-report-page"
import { pageMetadata } from "@/lib/seo/metadata"

type PageProps = {
  searchParams: Promise<{ pagina?: string }>
}

export const metadata: Metadata = pageMetadata({
  title: "Reportar problema web | tenaasesores",
  description:
    "Canal para reportar incidencias técnicas del sitio web de tenaasesores. No utilices este formulario para consultas de asesoría.",
  path: "/reportar-problema",
  robots: { index: false, follow: true },
})

export default async function ReportarProblemaRoute({ searchParams }: PageProps) {
  const { pagina } = await searchParams
  return <WebIssueReportPage initialPageUrl={pagina} />
}
