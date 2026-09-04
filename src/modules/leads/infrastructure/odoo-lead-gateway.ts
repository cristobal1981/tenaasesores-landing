import { contactForm } from "@/content/contact-form"
import {
  leadDeliveryErrorFromWebhookStatus,
  parseWebhookErrorPayload,
} from "@/lib/leads/lead-delivery-error"
import type { CrmLead } from "@/src/modules/leads/domain/crm-lead"
import {
  parsePresupuestoFlash,
  type PresupuestoFlash,
} from "@/src/modules/leads/domain/presupuesto-flash"

export type CrmLeadDeliveryResult = {
  leadId: number | null
  presupuesto: PresupuestoFlash | null
}

export type OdooLeadGateway = {
  sendLead: (lead: CrmLead) => Promise<CrmLeadDeliveryResult>
}

function resolveWebhookUrl(): string | undefined {
  const primary = process.env.ODOO_LEAD_WEBHOOK_URL?.trim()
  if (primary) return primary
  return process.env.CONTACT_INQUIRY_WEBHOOK_URL?.trim()
}

export function createNoopOdooLeadGateway(): OdooLeadGateway {
  return {
    async sendLead(lead) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[leads] CRM lead received (noop gateway)", lead)
      }
      return { leadId: null, presupuesto: null }
    },
  }
}

export function createWebhookOdooLeadGateway(webhookUrl: string): OdooLeadGateway {
  const secret = process.env.ODOO_LEAD_WEBHOOK_SECRET?.trim()

  return {
    async sendLead(lead) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (secret) {
        headers["X-Webhook-Secret"] = secret
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(10_000),
      })

      if (!response.ok) {
        let payload = {}
        try {
          payload = parseWebhookErrorPayload(await response.json())
        } catch {
          /* body vacío o no JSON */
        }
        throw leadDeliveryErrorFromWebhookStatus(response.status, payload, {
          duplicateLead: contactForm.messages.duplicateLead,
          webhookForbidden: contactForm.messages.webhookForbidden,
          generic: contactForm.messages.genericError,
        })
      }

      try {
        const json = (await response.json()) as Record<string, unknown>
        return {
          leadId: typeof json.leadId === "number" ? json.leadId : null,
          presupuesto: parsePresupuestoFlash(json.presupuesto),
        }
      } catch {
        // El lead ya se creó (response.ok); un body inesperado no debe romper el flujo.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[leads] respuesta de landing-crm-lead no es JSON válido")
        }
        return { leadId: null, presupuesto: null }
      }
    },
  }
}

export function createOdooLeadGateway(): OdooLeadGateway {
  const webhookUrl = resolveWebhookUrl()
  if (webhookUrl) {
    return createWebhookOdooLeadGateway(webhookUrl)
  }

  return createNoopOdooLeadGateway()
}
