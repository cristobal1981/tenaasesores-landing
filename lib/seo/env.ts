import type { Metadata } from "next"

export function shouldAllowIndexing(): boolean {
  if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development") {
    return false
  }

  if (process.env.VERCEL_ENV === "production") {
    return true
  }

  return true
}

export function getIndexingRobots(): NonNullable<Metadata["robots"]> {
  if (!shouldAllowIndexing()) {
    return {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    }
  }

  return {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  }
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://www.tenaasesores.es"
  return raw.replace(/\/$/, "")
}
