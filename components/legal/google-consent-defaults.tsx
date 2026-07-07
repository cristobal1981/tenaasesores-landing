import Script from "next/script"
import { getGaId } from "@/lib/analytics/ga-config"

export function GoogleConsentDefaults() {
  if (!getGaId()) return null

  return (
    // Válido: este componente solo se renderiza desde app/layout.tsx (root layout);
    // la regla no puede seguir el uso a través de ficheros.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="google-consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 500
        });
      `}
    </Script>
  )
}
