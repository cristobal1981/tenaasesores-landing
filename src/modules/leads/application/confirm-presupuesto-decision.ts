import type {
  PresupuestoDecisionResult,
  PresupuestoDecision,
} from "@/src/modules/leads/domain/presupuesto-decision"
import type { PresupuestoDecisionGateway } from "@/src/modules/leads/infrastructure/presupuesto-decision-gateway"

export async function confirmPresupuestoDecision(
  gateway: PresupuestoDecisionGateway,
  decision: PresupuestoDecision
): Promise<PresupuestoDecisionResult> {
  return gateway.sendDecision(decision)
}
