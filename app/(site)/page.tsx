import type { Metadata } from "next"
import {
  HomeHeroBand,
  LogoMarquee,
  Services,
  Odoo,
  Philosophy,
  // Testimonials,
} from "@/src/modules/landing/ui"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { faqPage } from "@/content/faq"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Asesoría fiscal y contable online | tenaasesores",
  description:
    "Asesoría online para autónomos y pymes: fiscal, contable y laboral con Odoo, trato directo y primera consulta gratuita.",
  path: "/",
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeHeroBand />
      <Services />
      <Philosophy />
      <Odoo />
      {/* <Testimonials /> — oculto hasta tener testimonios reales publicables */}
      <CtaBrisaBand
        title={faqPage.homeTeaser.title}
        subtitle={faqPage.homeTeaser.subtitle}
        label={faqPage.homeTeaser.label}
        href={faqPage.homeTeaser.href}
      />
    </main>
  )
}
