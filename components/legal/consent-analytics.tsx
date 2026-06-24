"use client"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useState } from "react"
import {
  cookieConsentUpdatedEvent,
  readCookieConsent,
} from "@/lib/legal/cookie-consent"

function shouldLoadAnalytics() {
  if (process.env.NODE_ENV !== "production") return false
  return readCookieConsent()?.analytics === true
}

export function ConsentAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(shouldLoadAnalytics())
    sync()

    window.addEventListener(cookieConsentUpdatedEvent, sync)
    return () => window.removeEventListener(cookieConsentUpdatedEvent, sync)
  }, [])

  if (!enabled) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
