export type LeadDeliveryErrorCode = "webhook_forbidden" | "duplicate_lead" | "delivery"

export class LeadDeliveryError extends Error {
  readonly status: number
  readonly code: LeadDeliveryErrorCode

  constructor(status: number, code: LeadDeliveryErrorCode, message: string) {
    super(message)
    this.name = "LeadDeliveryError"
    this.status = status
    this.code = code
  }
}

export type WebhookErrorPayload = {
  ok?: boolean
  error?: string
  message?: string
}

export function parseWebhookErrorPayload(raw: unknown): WebhookErrorPayload {
  if (!raw || typeof raw !== "object") return {}
  const body = raw as Record<string, unknown>
  return {
    ok: typeof body.ok === "boolean" ? body.ok : undefined,
    error: typeof body.error === "string" ? body.error : undefined,
    message: typeof body.message === "string" ? body.message.trim() : undefined,
  }
}

export function leadDeliveryErrorFromWebhookStatus(
  status: number,
  payload: WebhookErrorPayload,
  fallbacks: { duplicateLead: string; webhookForbidden: string; generic: string }
): LeadDeliveryError {
  const message = payload.message

  if (status === 403 || payload.error === "webhook_forbidden") {
    return new LeadDeliveryError(
      403,
      "webhook_forbidden",
      message || fallbacks.webhookForbidden
    )
  }

  if (status === 409 || payload.error === "duplicate_lead") {
    return new LeadDeliveryError(
      409,
      "duplicate_lead",
      message || fallbacks.duplicateLead
    )
  }

  return new LeadDeliveryError(503, "delivery", message || fallbacks.generic)
}
