import { altaAutonomoFormContent } from "@/content/alta-autonomo-form"

export type AltaAutonomoAccessErrorContent = {
  title: string
  body: string
  hint?: string
  variant: "link" | "service"
}

const TOKEN_ACCESS_ERRORS = new Set(["expired", "used", "revoked", "not_found"])

export function resolveAltaAutonomoAccessError(
  error?: string
): AltaAutonomoAccessErrorContent {
  const errors = altaAutonomoFormContent.accessErrors

  switch (error) {
    case "expired":
      return errors.expired
    case "used":
      return errors.used
    case "revoked":
      return errors.revoked
    case "not_found":
      return errors.invalid
    default:
      return errors.unavailable
  }
}

export function resolveAltaAutonomoServiceError(): AltaAutonomoAccessErrorContent {
  return altaAutonomoFormContent.accessErrors.unavailable
}

export type AltaAutonomoSubmitUserError = {
  message: string
  fieldErrors?: Record<string, string>
}

export function resolveAltaAutonomoSubmitUserError(input: {
  status: number
  error?: string
  fieldErrors?: Record<string, string>
}): AltaAutonomoSubmitUserError {
  const { submitErrors, messages } = altaAutonomoFormContent
  const { status, error, fieldErrors } = input

  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    const friendlyFieldErrors = mapSubmitFieldErrors(fieldErrors)
    const firstFieldMessage = Object.values(friendlyFieldErrors)[0]
    return {
      message: firstFieldMessage ?? messages.validation,
      fieldErrors: friendlyFieldErrors,
    }
  }

  if (error === "expired") return { message: submitErrors.expired }
  if (error === "used") return { message: submitErrors.used }
  if (error === "revoked") return { message: submitErrors.revoked }
  if (error === "not_found") return { message: submitErrors.invalid }

  if (status === 429 || error === "odoo_rate_limited") {
    return { message: submitErrors.rateLimited }
  }

  if (error === "validation") {
    return { message: messages.validation }
  }

  if (error === "forbidden") {
    return { message: messages.forbidden }
  }

  if (TOKEN_ACCESS_ERRORS.has(error ?? "")) {
    return { message: submitErrors.invalid }
  }

  return { message: submitErrors.unavailable }
}

function mapSubmitFieldErrors(
  fieldErrors: Record<string, string>
): Record<string, string> {
  const validation = altaAutonomoFormContent.validation
  const mapped: Record<string, string> = {}

  for (const [field, message] of Object.entries(fieldErrors)) {
    if (field === "_form" || field === "token") {
      mapped[field] = altaAutonomoFormContent.submitErrors.invalid
      continue
    }

    const knownKey = field as keyof typeof validation
    if (knownKey in validation) {
      mapped[field] = validation[knownKey]
      continue
    }

    if (looksUserFacing(message)) {
      mapped[field] = message
      continue
    }

    mapped[field] = altaAutonomoFormContent.messages.validation
  }

  return mapped
}

function looksUserFacing(message: string): boolean {
  const normalized = message.trim()
  if (!normalized) return false
  if (/^[a-z0-9_]+$/i.test(normalized)) return false
  if (/^(error|failed|invalid|unknown|unauthorized)/i.test(normalized)) return false
  return true
}
