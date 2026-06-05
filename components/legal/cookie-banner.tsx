"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { MarketingButton } from "@/components/ui/marketing-button"
import { cookieBannerCopy, legalRoutes } from "@/content/legal"
import {
  hasCookieConsentDecision,
  writeCookieConsent,
} from "@/lib/legal/cookie-consent"
import { cn } from "@/lib/utils"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    setVisible(!hasCookieConsentDecision())
  }, [])

  const persistChoice = useCallback((analytics: boolean) => {
    writeCookieConsent(analytics)
    setStatusMessage(cookieBannerCopy.savedMessage)
    window.setTimeout(() => {
      setVisible(false)
      setStatusMessage(null)
    }, 280)
  }, [])

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Consentimiento de cookies"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-agua/35 bg-card/95 backdrop-blur-md",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300",
        "motion-reduce:animate-none"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <h2 className="mb-2 text-base font-semibold text-on-dark">{cookieBannerCopy.title}</h2>
        <p className="max-w-none text-sm leading-relaxed text-muted-on-dark">
          {cookieBannerCopy.description}{" "}
          <Link
            href={legalRoutes.cookies}
            className="text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {cookieBannerCopy.cookiesLinkLabel}
          </Link>{" "}
          ·{" "}
          <Link
            href={legalRoutes.privacidad}
            className="text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {cookieBannerCopy.privacyLinkLabel}
          </Link>
        </p>
        <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-xs text-primary">
          {statusMessage}
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <MarketingButton
            type="button"
            marketingVariant="secondary"
            className="w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-auto"
            onClick={() => persistChoice(false)}
          >
            {cookieBannerCopy.rejectLabel}
          </MarketingButton>
          <MarketingButton
            type="button"
            className="w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-auto"
            onClick={() => persistChoice(true)}
          >
            {cookieBannerCopy.acceptLabel}
          </MarketingButton>
        </div>
      </div>
    </div>
  )
}
