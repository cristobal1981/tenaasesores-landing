"use client"

import { useEffect } from "react"
import { updateGoogleConsent } from "@/lib/analytics/google-consent"
import {
  cookieConsentUpdatedEvent,
  readCookieConsent,
} from "@/lib/legal/cookie-consent"

function syncGoogleConsentFromStorage() {
  const consent = readCookieConsent()
  if (!consent) return
  updateGoogleConsent(consent.analytics)
}

export function GoogleConsentSync() {
  useEffect(() => {
    syncGoogleConsentFromStorage()

    const handleConsentUpdate = () => syncGoogleConsentFromStorage()
    window.addEventListener(cookieConsentUpdatedEvent, handleConsentUpdate)

    return () => {
      window.removeEventListener(cookieConsentUpdatedEvent, handleConsentUpdate)
    }
  }, [])

  return null
}
