import type { NextRequest } from "next/server"
import { site } from "@/content/site"

const additionalAllowedOrigins = ["https://landing-site-seven-psi.vercel.app"]

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function allowedOrigins(): Set<string> {
  const origins = new Set<string>([normalizeOrigin(site.url)].filter(Boolean) as string[])

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL
  if (envUrl) {
    const normalized = normalizeOrigin(envUrl.startsWith("http") ? envUrl : `https://${envUrl}`)
    if (normalized) origins.add(normalized)
  }

  for (const url of additionalAllowedOrigins) {
    const normalized = normalizeOrigin(url)
    if (normalized) origins.add(normalized)
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000")
    origins.add("http://127.0.0.1:3000")
  }

  return origins
}

function isPrivateOrLocalDevHostname(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1") return true
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true
  const secondOctet = Number.parseInt(hostname.split(".")[1] ?? "", 10)
  if (hostname.startsWith("100.") && secondOctet >= 64 && secondOctet <= 127) return true
  return false
}

function isLocalNetworkDevOrigin(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin)
    if (protocol !== "http:" && protocol !== "https:") return false
    return isPrivateOrLocalDevHostname(hostname)
  } catch {
    return false
  }
}

function isAllowedOriginValue(value: string | null, allowed: Set<string>): boolean {
  if (!value) return false
  const normalized = normalizeOrigin(value)
  if (!normalized) return false
  if (allowed.has(normalized)) return true
  if (process.env.NODE_ENV !== "production" && isLocalNetworkDevOrigin(normalized)) {
    return true
  }
  return false
}

export function isContactRequestOriginAllowed(request: NextRequest): boolean {
  const allowed = allowedOrigins()
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")

  if (origin) {
    return isAllowedOriginValue(origin, allowed)
  }

  if (referer) {
    return isAllowedOriginValue(referer, allowed)
  }

  return process.env.NODE_ENV !== "production"
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp

  return "unknown"
}
