type GtagConsentParams = {
  analytics_storage: "granted" | "denied"
  ad_storage: "granted" | "denied"
  ad_user_data: "granted" | "denied"
  ad_personalization: "granted" | "denied"
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function buildConsentParams(analytics: boolean): GtagConsentParams {
  const state = analytics ? "granted" : "denied"
  return {
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  }
}

export function updateGoogleConsent(analytics: boolean): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return

  window.gtag("consent", "update", buildConsentParams(analytics))
}
