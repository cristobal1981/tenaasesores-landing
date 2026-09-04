import { planCustomizeForm } from "@/content/plan-customize-form"
import type { PresupuestoDecisionAccion } from "@/src/modules/leads/domain/presupuesto-decision"

export type ConfirmarPresupuestoPayload = {
  leadId?: unknown
  accion?: unknown
  motivo?: unknown
}

export type ValidatedConfirmarPresupuesto = {
  leadId: number
  accion: PresupuestoDecisionAccion
  motivo?: string
}

export type ConfirmarPresupuestoValidationResult =
  | { ok: true; data: ValidatedConfirmarPresupuesto }
  | { ok: false }

function isPresupuestoDecisionAccion(value: unknown): value is PresupuestoDecisionAccion {
  return value === "aceptar" || value === "rechazar" || value === "no_interesa"
}

export function validateConfirmarPresupuesto(
  payload: ConfirmarPresupuestoPayload
): ConfirmarPresupuestoValidationResult {
  const leadId =
    typeof payload.leadId === "number" && Number.isInteger(payload.leadId) && payload.leadId > 0
      ? payload.leadId
      : null
  const accion = isPresupuestoDecisionAccion(payload.accion) ? payload.accion : null

  if (leadId === null || accion === null) return { ok: false }

  let motivo: string | undefined
  if (accion !== "aceptar" && typeof payload.motivo === "string") {
    const trimmed = payload.motivo.trim().slice(0, planCustomizeForm.confirmarPresupuesto.limits.motivoMax)
    motivo = trimmed.length > 0 ? trimmed : undefined
  }

  return { ok: true, data: { leadId, accion, motivo } }
}
