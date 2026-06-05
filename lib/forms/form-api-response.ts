export type FormApiPayload = {
  ok?: boolean
  message?: string
  error?: string
}

export type FormApiFallbackMessages = {
  rateLimit: string
  duplicateLead: string
  webhookForbidden: string
  generic: string
  validation?: string
}

export function resolveFormApiErrorMessage(
  response: Response,
  payload: FormApiPayload,
  fallbacks: FormApiFallbackMessages
): string | null {
  if (response.ok && payload.ok !== false) return null

  if (response.status === 429 || payload.error === "rate_limit") {
    return fallbacks.rateLimit
  }

  if (response.status === 409 || payload.error === "duplicate_lead") {
    return payload.message ?? fallbacks.duplicateLead
  }

  if (response.status === 403 || payload.error === "webhook_forbidden") {
    return payload.message ?? fallbacks.webhookForbidden
  }

  if (payload.error === "validation" && fallbacks.validation) {
    return payload.message ?? fallbacks.validation
  }

  if (payload.message) return payload.message

  return fallbacks.generic
}
