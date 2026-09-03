import { contactForm } from "@/content/contact-form"
import { planCustomizeForm } from "@/content/plan-customize-form"
import { LeadDeliveryError } from "@/lib/leads/lead-delivery-error"

type LeadFormKind = "contact" | "plan_customize" | "confirmar_presupuesto"

function deliveryFallbacks(kind: LeadFormKind) {
  if (kind === "confirmar_presupuesto") {
    const messages = planCustomizeForm.confirmarPresupuesto.messages
    return {
      // "duplicado" no aplica a esta acción; usamos el genérico como fallback.
      duplicateLead: messages.genericError,
      webhookForbidden: messages.webhookForbidden,
      generic: messages.genericError,
    }
  }

  const messages = kind === "contact" ? contactForm.messages : planCustomizeForm.messages
  return {
    duplicateLead: messages.duplicateLead,
    webhookForbidden: messages.webhookForbidden,
    generic: messages.genericError,
  }
}

export function toLeadDeliveryError(error: unknown, kind: LeadFormKind): LeadDeliveryError {
  if (error instanceof LeadDeliveryError) return error
  const fallbacks = deliveryFallbacks(kind)
  return new LeadDeliveryError(503, "delivery", fallbacks.generic)
}

export function leadDeliveryJsonResponse(error: LeadDeliveryError) {
  return {
    ok: false as const,
    error: error.code,
    message: error.message,
  }
}
