"use client"

import Link from "next/link"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { m } from "framer-motion"
import { MarketingButton } from "@/components/ui/marketing-button"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import {
  HoldedPartnerStrip,
  OdooCredential,
} from "@/components/landing/odoo-partners"
import { SectionShell } from "@/components/layout/section-shell"
import { odoo } from "@/content/site"

export function Odoo() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeSectionReveal({ sectionRef, stagger: 0.12 })

  return (
    <section
      ref={sectionRef}
      id="odoo"
      className="section-divider relative overflow-hidden bg-surface-dark py-24 md:py-32"
    >
      <SectionShell className="mx-auto max-w-4xl">
        <p
          data-home-reveal
          className="mb-5 text-center text-[0.72rem] font-semibold tracking-[0.2em] text-primary uppercase"
        >
          {odoo.badge}
        </p>
        <h2
          data-home-reveal
          className="mb-6 text-center text-[clamp(2rem,5vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-on-dark"
        >
          {odoo.title[0]}
          <br />
          <span className="text-muted-on-dark">{odoo.title[1]}</span>
        </h2>
        <p
          data-home-reveal
          className="prose-width mx-auto mb-16 text-center text-base leading-relaxed text-muted-on-dark sm:text-lg"
        >
          {odoo.subtitle}
        </p>

        <div data-home-reveal className="mb-20 border-y border-agua/18 py-12">
          <OdooCredential />
        </div>

        <ol className="mb-20 space-y-10">
          {odoo.benefits.map((benefit, index) => (
            <m.li
              key={benefit.title}
              data-home-reveal
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="border-b border-agua/14 pb-10 last:border-b-0"
            >
              <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                0{index + 1}
              </p>
              <h3 className="mb-3 text-2xl font-semibold text-on-dark">{benefit.title}</h3>
              <p className="max-w-[58ch] text-base leading-relaxed text-muted-on-dark">
                {benefit.description}
              </p>
            </m.li>
          ))}
        </ol>

        <div data-home-reveal className="mb-16">
          <p className="mb-10 text-center text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            {odoo.stepsTitle}
          </p>
          <ol className="space-y-8">
            {odoo.steps.map((step, index) => (
              <li key={step.title} className="text-center">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <h3 className="mb-2 text-xl font-semibold text-on-dark">{step.title}</h3>
                <p className="mx-auto max-w-[48ch] text-sm leading-relaxed text-muted-on-dark sm:text-base">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div data-home-reveal className="text-center">
          <MarketingButton asChild size="lg">
            <Link href="/contacto">
              {odoo.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </MarketingButton>
        </div>

        <HoldedPartnerStrip />
      </SectionShell>
    </section>
  )
}
