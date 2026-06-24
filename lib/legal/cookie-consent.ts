import { cookieConsentStorageKey } from "@/content/legal"
import { updateGoogleConsent } from "@/lib/analytics/google-consent"

export const cookieConsentUpdatedEvent = "cookie-consent-updated" as const

export type CookieConsent = {
  necessary: true
  analytics: boolean
  decidedAt: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(cookieConsentStorageKey)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return null
    if (parsed.necessary !== true) return null
    if (typeof parsed.analytics !== "boolean") return null
    if (typeof parsed.decidedAt !== "string") return null

    return {
      necessary: true,
      analytics: parsed.analytics,
      decidedAt: parsed.decidedAt,
    }
  } catch {
    return null
  }
}

export function writeCookieConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    decidedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(cookieConsentStorageKey, JSON.stringify(consent))
    if (typeof window !== "undefined") {
      updateGoogleConsent(analytics)
      window.dispatchEvent(
        new CustomEvent(cookieConsentUpdatedEvent, { detail: consent })
      )
    }
  } catch {
    /* private mode / blocked storage */
  }

  return consent
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.analytics === true
}

export function hasCookieConsentDecision(): boolean {
  return readCookieConsent() !== null
}
