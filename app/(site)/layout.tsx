import { SiteChatWidget } from "@/components/chat/site-chat-widget"
import { CookieBanner } from "@/components/legal/cookie-banner"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"
import { Header, Footer } from "@/src/modules/landing/ui"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <SmoothScrollProvider>
        <div className="min-h-screen pt-[var(--site-header-height)]">{children}</div>
      </SmoothScrollProvider>
      <Footer />
      <CookieBanner />
      <SiteChatWidget />
    </>
  )
}
