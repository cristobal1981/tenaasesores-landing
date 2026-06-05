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
