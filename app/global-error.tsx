"use client"

import { useEffect } from "react"
import { Host_Grotesk, Archivo } from "next/font/google"
import { ErrorStage } from "@/components/errors/error-stage"
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

  return (
    <html
      lang="es"
      className={`${hostGrotesk.variable} ${archivo.variable} bg-background`}
    >
      <body className={`${archivo.className} antialiased`}>
        <ErrorStage variant="fatal" onRetry={reset} digest={error.digest} />
      </body>
    </html>
  )
}
