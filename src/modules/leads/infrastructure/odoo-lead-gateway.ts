import { contactForm } from "@/content/contact-form"
import {
  leadDeliveryErrorFromWebhookStatus,
  parseWebhookErrorPayload,
} from "@/lib/leads/lead-delivery-error"
import type { CrmLead } from "@/src/modules/leads/domain/crm-lead"

export type OdooLeadGateway = {
  sendLead: (lead: CrmLead) => Promise<void>
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
