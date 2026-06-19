import { SiteChatWidget } from "@/components/chat/site-chat-widget"
import { CookieBanner } from "@/components/legal/cookie-banner"
import { Header, Footer } from "@/src/modules/landing/ui"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 md:pt-20">{children}</div>
      <Footer />
      <CookieBanner />
      <SiteChatWidget />
    </>
  )
}
