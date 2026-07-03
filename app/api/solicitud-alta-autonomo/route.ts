import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { altaAutonomoFormContent } from "@/content/alta-autonomo-form"
import { isContactBodyWithinLimit } from "@/lib/contact/rate-limit"
import { isContactRequestOriginAllowed } from "@/lib/contact/request-security"
import { submitAltaAutonomoOnboarding } from "@/lib/alta-autonomo/syntia-onboarding-client"
import { resolveAltaAutonomoSubmitUserError } from "@/lib/alta-autonomo/resolve-access-error"
import {
  validateAltaAutonomoSubmission,
  type AltaAutonomoSubmissionPayload,
} from "@/lib/alta-autonomo/validate-submission"

function json(data: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers })
}

function honeypotSuccess() {
  return json({ ok: true })
}

export async function POST(request: NextRequest) {
  if (!isContactRequestOriginAllowed(request)) {
    return json(
      { ok: false, message: altaAutonomoFormContent.messages.forbidden },
      403
    )
  }

  if (!isContactBodyWithinLimit(request.headers.get("content-length"))) {
    return json({ ok: false, message: altaAutonomoFormContent.messages.validation }, 413)
  }

  let body: AltaAutonomoSubmissionPayload
  try {
    body = (await request.json()) as AltaAutonomoSubmissionPayload
  } catch {
    return json({ ok: false, message: altaAutonomoFormContent.messages.validation }, 400)
  }

  const validation = validateAltaAutonomoSubmission(body)
  if (!validation.ok) {
    if (validation.code === "honeypot" || validation.code === "too_fast") {
      return honeypotSuccess()
    }

    return json(
      {
        ok: false,
        message: validation.issues?.[0]?.message ?? altaAutonomoFormContent.messages.validation,
      },
      400
    )
  }

  try {
    const result = await submitAltaAutonomoOnboarding(validation.data)
    if (!result.ok) {
      const userError = resolveAltaAutonomoSubmitUserError({
        status: result.status,
        error: result.error,
        fieldErrors: result.fieldErrors,
      })
      return json(
        {
          ok: false,
          message: userError.message,
          ...(userError.fieldErrors ? { fieldErrors: userError.fieldErrors } : {}),
        },
        result.status >= 400 ? result.status : 502
      )
    }

    return json({
      ok: true,
      message: altaAutonomoFormContent.success.body,
    })
  } catch (error) {
    console.error("[alta-autonomo] submit proxy failed", error)
    return json(
      {
        ok: false,
        message: altaAutonomoFormContent.submitErrors.unavailable,
      },
      502
    )
  }
}
