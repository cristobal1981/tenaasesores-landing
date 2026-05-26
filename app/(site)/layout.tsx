import { SiteChatWidget } from "@/components/chat/site-chat-widget"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20">{children}</div>
      <Footer />
      <SiteChatWidget />
    </>
  )
}
