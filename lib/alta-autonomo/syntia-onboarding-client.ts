import type { ValidatedAltaAutonomoSubmission } from "@/lib/alta-autonomo/validate-submission"
import type { OnboardingAddressCatalog } from "@/lib/alta-autonomo/onboarding-catalog"

const SECRET_HEADER = "X-Landing-Onboarding-Secret"
const VERCEL_BYPASS_HEADER = "x-vercel-protection-bypass"

type ValidateTokenApiResponse = {
  ok?: boolean
  valid?: boolean
  recipientEmail?: string
  expiresAt?: string
  catalog?: OnboardingAddressCatalog
  message?: string
  error?: string
}

type SubmitApiResponse = {
  ok?: boolean
  message?: string
  error?: string
  fieldErrors?: Record<string, string>
}

export type SyntiaTokenValidationResult = {
  ok: boolean
  status: number
  valid: boolean
  recipientEmail?: string
  expiresAt?: string
  catalog?: OnboardingAddressCatalog
  message?: string
  error?: string
}

export type SyntiaSubmitResult = {
  ok: boolean
  status: number
  message?: string
  error?: string
  fieldErrors?: Record<string, string>
}

function getClientConfig() {
  const baseUrl = process.env.SYNTIA_APP_URL?.trim()
  const secret = process.env.LANDING_ONBOARDING_API_SECRET?.trim()

  if (!baseUrl) {
    throw new Error("Missing SYNTIA_APP_URL")
  }
  if (!secret) {
    throw new Error("Missing LANDING_ONBOARDING_API_SECRET")
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), secret }
}

function getVercelProtectionBypass(): string | undefined {
  const value =
    process.env.SYNTIA_VERCEL_PROTECTION_BYPASS?.trim() ||
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim()
  return value || undefined
}

function buildSyntiaRequestHeaders(secret: string, withJsonContentType = false): HeadersInit {
  const headers: Record<string, string> = {
    [SECRET_HEADER]: secret,
  }

  if (withJsonContentType) {
    headers["Content-Type"] = "application/json"
  }

  const bypassSecret = getVercelProtectionBypass()
  if (bypassSecret) {
    headers[VERCEL_BYPASS_HEADER] = bypassSecret
  }

  return headers
}

async function readJsonBody<T>(response: Response): Promise<T | null> {
  const rawBody = (await response.text()).trim()
  if (!rawBody) return null

  try {
    return JSON.parse(rawBody) as T
  } catch {
    return null
  }
}

function mapUpstreamError(status: number, payloadError?: string): string {
  if (payloadError) return payloadError
  if (status === 401) return "unauthorized"
  if (status === 403) return "forbidden"
  if (status === 503 || status === 502) return "odoo_unavailable"
  return "upstream_unavailable"
}

/** Respuestas normales del flujo (el enlace no sirve o el formulario es inválido): no son un fallo del servicio. */
const EXPECTED_ERRORS = new Set(["expired", "used", "revoked", "not_found", "validation"])

/**
 * Deja en el log por qué falló la llamada a Syntia (estado y código, con el host al que se
 * llamó). Nunca se registra la URL completa (lleva el token), ni cabeceras, ni el secreto.
 */
function logUpstreamFailure(
  operation: "validate" | "submit",
  baseUrl: string,
  details: Record<string, unknown>
) {
  let host = baseUrl
  try {
    host = new URL(baseUrl).host
  } catch {
    // baseUrl mal formada: se registra tal cual para que se vea.
  }
  console.error(`[alta-autonomo] ${operation} upstream failure`, { host, ...details })
}

export async function validateAltaAutonomoOnboardingToken(
  token: string
): Promise<SyntiaTokenValidationResult> {
  const { baseUrl, secret } = getClientConfig()
  const url = new URL("/api/onboarding/alta-autonomo/validate", baseUrl)
  url.searchParams.set("token", token)

  let response: Response
  try {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: buildSyntiaRequestHeaders(secret),
    })
  } catch (error) {
    console.error("[alta-autonomo] validate fetch failed", {
      baseUrl,
      error,
    })
    return {
      ok: false,
      status: 0,
      valid: false,
      error: "upstream_unreachable",
    }
  }

  const payload = await readJsonBody<ValidateTokenApiResponse>(response)
  const hasCatalog = Boolean(payload?.catalog?.countries?.length)

  if (!response.ok || response.status === 204 || !payload?.ok || !hasCatalog) {
    const error = mapUpstreamError(response.status, payload?.error)
    if (!EXPECTED_ERRORS.has(error)) {
      logUpstreamFailure("validate", baseUrl, {
        status: response.status,
        error,
        hasPayload: payload !== null,
        hasCatalog,
      })
    }
    return {
      ok: false,
      status: response.status,
      valid: false,
      error,
    }
  }

  return {
    ok: true,
    status: response.status,
    valid: true,
    recipientEmail: payload.recipientEmail,
    expiresAt: payload.expiresAt,
    catalog: payload.catalog,
    message: payload.message,
  }
}

export async function submitAltaAutonomoOnboarding(
  data: ValidatedAltaAutonomoSubmission
): Promise<SyntiaSubmitResult> {
  const { baseUrl, secret } = getClientConfig()
  const url = new URL("/api/onboarding/alta-autonomo/submit", baseUrl)

  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: buildSyntiaRequestHeaders(secret, true),
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("[alta-autonomo] submit fetch failed", {
      baseUrl,
      error,
    })
    return {
      ok: false,
      status: 0,
      error: "upstream_unreachable",
    }
  }

  const payload = await readJsonBody<SubmitApiResponse>(response)

  if (!response.ok || response.status === 204 || !payload) {
    const error = mapUpstreamError(response.status, payload?.error)
    if (!EXPECTED_ERRORS.has(error)) {
      logUpstreamFailure("submit", baseUrl, {
        status: response.status,
        error,
        hasPayload: payload !== null,
      })
    }
    return {
      ok: false,
      status: response.status,
      error,
      fieldErrors: payload?.fieldErrors,
    }
  }

  return {
    ok: payload.ok !== false,
    status: response.status,
    message: payload.message,
    error: payload.error,
    fieldErrors: payload.fieldErrors,
  }
}
