import type { Metadata } from "next"
import {
  HomeHeroBand,
  HomeStats,
  LogoMarquee,
  Services,
  Odoo,
  Philosophy,
  // Testimonials,
} from "@/src/modules/landing/ui"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { homeFinalCta } from "@/content/site"
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
      <section className="section-divider-bottom">
        <HomeHeroBand />
        <HomeStats />
      </section>
      <LogoMarquee variant="embedded" />
      <Philosophy />
      <Services />
      <Odoo />
      {/* <Testimonials /> — oculto hasta tener testimonios reales publicables */}
      <CtaBrisaBand
        title={homeFinalCta.title}
        subtitle={homeFinalCta.subtitle}
        label={homeFinalCta.label}
      />
    </main>
  )
}
