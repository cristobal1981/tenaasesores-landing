import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { planCustomizeForm } from "@/content/plan-customize-form"
import { checkConfirmarPresupuestoRateLimit } from "@/lib/confirmar-presupuesto/rate-limit"
import {
  validateConfirmarPresupuesto,
  type ConfirmarPresupuestoPayload,
} from "@/lib/confirmar-presupuesto/validate-confirmation"
import { isContactBodyWithinLimit } from "@/lib/contact/rate-limit"
import { getClientIp, isContactRequestOriginAllowed } from "@/lib/contact/request-security"
import {
  leadDeliveryJsonResponse,
  toLeadDeliveryError,
} from "@/lib/leads/handle-lead-delivery-failure"
import { confirmPresupuestoDecision } from "@/src/modules/leads/application/confirm-presupuesto-decision"
import { createPresupuestoDecisionGateway } from "@/src/modules/leads/infrastructure/presupuesto-decision-gateway"

function json(data: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers })
}

export async function POST(request: NextRequest) {
  if (!isContactRequestOriginAllowed(request)) {
    return json({ ok: false, error: "forbidden" }, 403)
  }

  if (!isContactBodyWithinLimit(request.headers.get("content-length"))) {
    return json({ ok: false, error: "payload_too_large" }, 413)
  }

  let body: ConfirmarPresupuestoPayload
  try {
    body = (await request.json()) as ConfirmarPresupuestoPayload
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400)
  }

  const validation = validateConfirmarPresupuesto(body)
  if (!validation.ok) {
    return json(
      {
        ok: false,
        error: "validation",
        message: planCustomizeForm.confirmarPresupuesto.messages.validation,
      },
      400
    )
  }

  const ip = getClientIp(request)
  const rate = checkConfirmarPresupuestoRateLimit({ ip, leadId: validation.data.leadId })
  if (!rate.allowed) {
    return json(
      {
        ok: false,
        error: "rate_limit",
        message: planCustomizeForm.confirmarPresupuesto.messages.rateLimit,
      },
      429,
      { "Retry-After": String(rate.retryAfterSec) }
    )
  }

  try {
    const result = await confirmPresupuestoDecision(
      createPresupuestoDecisionGateway(),
      validation.data
    )
    return json({
      ok: true,
      leadId: result.leadId,
      estado: result.estado,
      presupuestoId: result.presupuestoId,
      presupuestoIdCuota: result.presupuestoIdCuota,
    })
  } catch (error) {
    const deliveryError = toLeadDeliveryError(error, "confirmar_presupuesto")
    return json(leadDeliveryJsonResponse(deliveryError), deliveryError.status)
  }
}
