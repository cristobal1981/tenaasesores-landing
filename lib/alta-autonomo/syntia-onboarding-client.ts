import type { ValidatedAltaAutonomoSubmission } from "@/lib/alta-autonomo/validate-submission"
import type { OnboardingAddressCatalog } from "@/lib/alta-autonomo/onboarding-catalog"

const SECRET_HEADER = "X-Landing-Onboarding-Secret"

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

function buildHeaders(secret: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    [SECRET_HEADER]: secret,
  }
}

export async function validateAltaAutonomoOnboardingToken(
  token: string
): Promise<SyntiaTokenValidationResult> {
  const { baseUrl, secret } = getClientConfig()
  const url = new URL("/api/onboarding/alta-autonomo/validate", baseUrl)
  url.searchParams.set("token", token)

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      [SECRET_HEADER]: secret,
    },
  })

  let payload: ValidateTokenApiResponse | null = null
  try {
    payload = (await response.json()) as ValidateTokenApiResponse
  } catch {
    payload = null
  }

  const isValid = Boolean(payload?.valid ?? (response.ok && payload?.ok !== false))
  return {
    ok: response.ok,
    status: response.status,
    valid: isValid,
    recipientEmail: payload?.recipientEmail,
    expiresAt: payload?.expiresAt,
    catalog: payload?.catalog,
    message: payload?.message,
    error: payload?.error,
  }
}

export async function submitAltaAutonomoOnboarding(
  data: ValidatedAltaAutonomoSubmission
): Promise<SyntiaSubmitResult> {
  const { baseUrl, secret } = getClientConfig()
  const url = new URL("/api/onboarding/alta-autonomo/submit", baseUrl)

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: buildHeaders(secret),
    body: JSON.stringify(data),
  })

  let payload: SubmitApiResponse | null = null
  try {
    payload = (await response.json()) as SubmitApiResponse
  } catch {
    payload = null
  }

  return {
    ok: response.ok && payload?.ok !== false,
    status: response.status,
    message: payload?.message,
    error: payload?.error,
    fieldErrors: payload?.fieldErrors,
  }
}
