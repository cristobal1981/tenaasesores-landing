"use client"

import { useEffect } from "react"
import { Host_Grotesk, Archivo } from "next/font/google"
import { ErrorScreen } from "@/components/errors/error-screen"
import { errorPages } from "@/content/errors"
import "./globals.css"

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["300", "400", "600"],
  display: "swap",
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const page = errorPages[500]

  return (
    <html
      lang="es"
      className={`${hostGrotesk.variable} ${archivo.variable} bg-background`}
    >
      <body className={`${archivo.className} antialiased`}>
        <ErrorScreen
          code={page.code}
          title={page.title}
          description={page.description}
          image={page.image}
          imageAlt={page.imageAlt}
          primaryHref={page.primaryHref}
          primaryLabel={page.primaryLabel}
          onRetry={reset}
        />
      </body>
    </html>
  )
}
