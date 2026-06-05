import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { planCustomizeForm } from "@/content/plan-customize-form"
import { checkContactSubmissionRateLimit, isContactBodyWithinLimit } from "@/lib/contact/rate-limit"
import { getClientIp, isContactRequestOriginAllowed } from "@/lib/contact/request-security"
import {
  validatePlanCustomizeInquiry,
  type PlanCustomizeInquiryPayload,
} from "@/lib/plan-customize/validate-inquiry"
import {
  leadDeliveryJsonResponse,
  toLeadDeliveryError,
} from "@/lib/leads/handle-lead-delivery-failure"
import { submitPlanCustomizeCrmLead } from "@/src/modules/leads/application/submit-crm-lead"
import { createOdooLeadGateway } from "@/src/modules/leads/infrastructure/odoo-lead-gateway"

function json(data: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers })
}

function honeypotSuccess() {
  return json({ ok: true })
}

export async function POST(request: NextRequest) {
  if (!isContactRequestOriginAllowed(request)) {
    return json({ ok: false, error: "forbidden" }, 403)
  }

  if (!isContactBodyWithinLimit(request.headers.get("content-length"))) {
    return json({ ok: false, error: "payload_too_large" }, 413)
  }

  let body: PlanCustomizeInquiryPayload
  try {
    body = (await request.json()) as PlanCustomizeInquiryPayload
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400)
  }

  const validation = validatePlanCustomizeInquiry(body)
  if (!validation.ok) {
    if (validation.code === "honeypot" || validation.code === "too_fast") {
      return honeypotSuccess()
    }

    return json(
      {
        ok: false,
        error: "validation",
        message: planCustomizeForm.messages.validation,
      },
      400
    )
  }

  const ip = getClientIp(request)
  const rate = checkContactSubmissionRateLimit({
    ip,
    email: validation.data.email,
  })

  if (!rate.allowed) {
    return json(
      {
        ok: false,
        error: "rate_limit",
        message: planCustomizeForm.messages.rateLimit,
      },
      429,
      { "Retry-After": String(rate.retryAfterSec) }
    )
  }

  try {
    await submitPlanCustomizeCrmLead(createOdooLeadGateway(), validation.data)
  } catch (error) {
    const deliveryError = toLeadDeliveryError(error, "plan_customize")
    return json(leadDeliveryJsonResponse(deliveryError), deliveryError.status)
  }

  return json({ ok: true, message: planCustomizeForm.success.body })
}
