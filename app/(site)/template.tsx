import { PageTransition } from "@/components/layout/page-transition"

export default function SiteTemplate({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PageTransition>{children}</PageTransition>
}
