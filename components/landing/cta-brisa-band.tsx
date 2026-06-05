"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/animations"
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

  return (
    <section className="section-cta-brisa" aria-labelledby={headingId}>
      <SectionShell>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 id={headingId} className="section-cta-brisa-title mb-4">
            {title}
          </h2>
          <p className="section-cta-brisa-body mb-8">{subtitle}</p>
          <MarketingButton asChild size="lg" marketingVariant="brisa">
            <Link href={href}>
              {label}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </MarketingButton>
        </FadeIn>
      </SectionShell>
    </section>
  )
}
