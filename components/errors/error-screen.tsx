"use client"

import Link from "next/link"
import { ArrowRight, RotateCcw } from "lucide-react"
import { IsotipoMark } from "@/components/icons/isotipo-mark"
import { BrandLogo } from "@/components/layout/brand-logo"
import { MarketingButton } from "@/components/ui/marketing-button"
import { errorQuickLinks } from "@/content/errors"

interface ErrorScreenProps {
  code: string
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  onRetry?: () => void
  supportRef?: string
}

export function ErrorScreen({
  code,
  title,
  description,
  primaryHref,
  primaryLabel,
  onRetry,
  supportRef,
}: ErrorScreenProps) {
  const isNumericCode = /^\d+$/.test(code)

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-home-hero-surface">
      <IsotipoMark className="pointer-events-none absolute -top-32 -right-24 h-[32rem] w-[32rem] rotate-12 text-primary/5 sm:-top-24 sm:-right-16" />
      <IsotipoMark className="pointer-events-none absolute -bottom-40 -left-28 h-[26rem] w-[26rem] -rotate-12 text-agua/10" />

      <div className="relative z-10 flex shrink-0 justify-center px-4 pt-8 sm:justify-start sm:px-8 sm:pt-10">
        <BrandLogo />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          {isNumericCode ? (
            <div className="@container mb-6 flex h-32 w-full items-center justify-center sm:mb-8 sm:h-40">
              <p
                className="home-clave-card-letter font-semibold text-primary"
                style={{
                  maskImage: "linear-gradient(180deg, black 45%, transparent 92%)",
                  WebkitMaskImage: "linear-gradient(180deg, black 45%, transparent 92%)",
                }}
              >
                {code}
              </p>
            </div>
          ) : (
            <p className="mb-6 -rotate-2 rounded-md border-2 border-primary/50 px-4 py-1.5 text-xs font-bold tracking-[0.28em] text-primary uppercase sm:mb-8">
              {code}
            </p>
          )}

          <h1 className="text-2xl font-bold text-balance text-on-dark sm:text-3xl">{title}</h1>
          <p className="prose-width mt-3 text-lg leading-relaxed text-muted-on-dark">
            {description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MarketingButton asChild size="lg" className="px-8">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </MarketingButton>
            {onRetry ? (
              <MarketingButton
                type="button"
                size="lg"
                variant="outline"
                marketingVariant="secondary"
                className="px-8"
                onClick={onRetry}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Intentar de nuevo
              </MarketingButton>
            ) : null}
          </div>

          {supportRef ? (
            <p className="mt-6 text-xs text-muted-on-dark">
              Referencia de incidencia:{" "}
              <span className="font-mono text-on-dark tabular-nums">{supportRef}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 shrink-0 pb-8 sm:pb-10">
        <div className="section-fade-line mb-6" />
        <nav
          aria-label="Enlaces útiles"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm"
        >
          {errorQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-muted-on-dark underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
