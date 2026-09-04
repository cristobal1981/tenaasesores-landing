import type { PresupuestoDecisionAccion } from "@/src/modules/leads/domain/presupuesto-decision"

export type ConfirmarPresupuestoApiPayload = {
  ok?: boolean
  leadId?: number
  estado?: PresupuestoDecisionAccion
  presupuestoId?: number
  presupuestoIdCuota?: number
  message?: string
  error?: string
}

export async function postConfirmarPresupuesto(input: {
  leadId: number
  accion: PresupuestoDecisionAccion
  motivo?: string
}): Promise<{ response: Response; payload: ConfirmarPresupuestoApiPayload }> {
  const response = await fetch("/api/confirmar-presupuesto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const payload = (await response.json()) as ConfirmarPresupuestoApiPayload
  return { response, payload }
}
