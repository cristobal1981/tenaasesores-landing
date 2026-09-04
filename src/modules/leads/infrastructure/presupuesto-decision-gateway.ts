import { planCustomizeForm } from "@/content/plan-customize-form"
import {
  leadDeliveryErrorFromWebhookStatus,
  parseWebhookErrorPayload,
} from "@/lib/leads/lead-delivery-error"
import type {
  PresupuestoDecision,
  PresupuestoDecisionAccion,
  PresupuestoDecisionResult,
} from "@/src/modules/leads/domain/presupuesto-decision"

export type PresupuestoDecisionGateway = {
  sendDecision: (decision: PresupuestoDecision) => Promise<PresupuestoDecisionResult>
}

function resolveConfirmarPresupuestoWebhookUrl(): string | undefined {
  return process.env.CONFIRMAR_PRESUPUESTO_WEBHOOK_URL?.trim()
}

function isPresupuestoDecisionAccion(value: unknown): value is PresupuestoDecisionAccion {
  return value === "aceptar" || value === "rechazar" || value === "no_interesa"
}

export function createNoopPresupuestoDecisionGateway(): PresupuestoDecisionGateway {
  return {
    async sendDecision(decision) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[leads] confirmación de presupuesto recibida (noop gateway)", decision)
      }
      return { leadId: decision.leadId, estado: decision.accion }
    },
  }
}

export function createWebhookPresupuestoDecisionGateway(
  webhookUrl: string
): PresupuestoDecisionGateway {
  const secret = process.env.ODOO_LEAD_WEBHOOK_SECRET?.trim()
  const messages = planCustomizeForm.confirmarPresupuesto.messages

  return {
    async sendDecision(decision) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (secret) {
        headers["X-Webhook-Secret"] = secret
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(decision),
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
          // "duplicado" no aplica a esta acción; usamos el genérico como fallback.
          duplicateLead: messages.genericError,
          webhookForbidden: messages.webhookForbidden,
          generic: messages.genericError,
        })
      }

      const json = (await response.json()) as Record<string, unknown>
      return {
        leadId: typeof json.leadId === "number" ? json.leadId : decision.leadId,
        estado: isPresupuestoDecisionAccion(json.estado) ? json.estado : decision.accion,
        presupuestoId: typeof json.presupuestoId === "number" ? json.presupuestoId : undefined,
        presupuestoIdCuota:
          typeof json.presupuestoIdCuota === "number" ? json.presupuestoIdCuota : undefined,
      }
    },
  }
}

export function createPresupuestoDecisionGateway(): PresupuestoDecisionGateway {
  const webhookUrl = resolveConfirmarPresupuestoWebhookUrl()
  if (webhookUrl) {
    return createWebhookPresupuestoDecisionGateway(webhookUrl)
  }

  return createNoopPresupuestoDecisionGateway()
}
