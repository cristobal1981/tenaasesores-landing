import type { Metadata } from "next"
import {
  Hero,
  LogoMarquee,
  HomeStats,
  Services,
  Odoo,
  Philosophy,
  Testimonials,
} from "@/src/modules/landing/ui"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { faqPage } from "@/content/faq"
import { pageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Asesoría fiscal y contable en Tenerife | tenaasesores",
  description:
    "Asesoría en Tenerife para autónomos y pymes: fiscal, contable y laboral con Odoo, trato directo y primera consulta gratuita.",
  path: "/",
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HomeStats />
      <LogoMarquee />
      <Services />
      <Philosophy />
      <Odoo />
      <Testimonials />
      <CtaBrisaBand
        title={faqPage.homeTeaser.title}
        subtitle={faqPage.homeTeaser.subtitle}
        label={faqPage.homeTeaser.label}
        href={faqPage.homeTeaser.href}
      />
    </main>
  )
}
