export type PresupuestoDecisionAccion = "aceptar" | "rechazar" | "no_interesa"

export type PresupuestoDecision = {
  leadId: number
  accion: PresupuestoDecisionAccion
  motivo?: string
}

export type PresupuestoDecisionResult = {
  leadId: number
  estado: PresupuestoDecisionAccion
  presupuestoId?: number
  presupuestoIdCuota?: number
}
