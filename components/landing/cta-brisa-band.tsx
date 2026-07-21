"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { m, useReducedMotion } from "framer-motion"
import { SectionShell } from "@/components/layout/section-shell"
import { MarketingButton } from "@/components/ui/marketing-button"
import { contactHref } from "@/content/site"

interface CtaBrisaBandProps {
  title: string
  subtitle: string
  label: string
  href?: string
}

export function CtaBrisaBand({
  title,
  subtitle,
  label,
  href = contactHref,
}: CtaBrisaBandProps) {
  const headingId = "cta-brisa-heading"
  const reducedMotion = useReducedMotion()

  return (
    <section className="section-cta-brisa min-h-[70vh]" aria-labelledby={headingId}>
      <SectionShell className="flex min-h-[70vh] flex-col justify-center py-20 md:py-28">
        <m.div
          className="mx-auto max-w-4xl text-center"
          initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 text-[0.72rem] font-semibold tracking-[0.22em] text-accent-on-light uppercase">
            Primera consulta gratuita
          </p>
          <h2 id={headingId} className="section-cta-brisa-title mb-5">
            {title}
          </h2>
          <p className="section-cta-brisa-body mx-auto mb-10 max-w-[50ch]">{subtitle}</p>
          <MarketingButton asChild size="lg" marketingVariant="brisa" className="px-10 text-base">
            <Link href={href}>
              {label}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </MarketingButton>
        </m.div>
      </SectionShell>
    </section>
  )
}
