import type { FormApiPayload } from "@/lib/forms/form-api-response"
import type { PresupuestoFlash } from "@/src/modules/leads/domain/presupuesto-flash"

export type PlanCustomizeApiPayload = FormApiPayload & {
  leadId?: number | null
  presupuesto?: PresupuestoFlash | null
}
