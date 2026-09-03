import { planCustomizeForm } from "@/content/plan-customize-form"
import type { ValidatedPlanCustomizeInquiry } from "@/lib/plan-customize/validate-inquiry"
import { createCrmLead, type CrmLead } from "@/src/modules/leads/domain/crm-lead"
import { formatPlanCustomizeLeadDescription } from "@/src/modules/leads/domain/format-plan-customize-description"
import type { PresupuestoFlash } from "@/src/modules/leads/domain/presupuesto-flash"
import type { OdooLeadGateway } from "@/src/modules/leads/infrastructure/odoo-lead-gateway"

export async function submitContactCrmLead(
  gateway: OdooLeadGateway,
  input: { name: string; phone?: string; email: string; message: string }
): Promise<CrmLead> {
  const lead = createCrmLead({
    source: "contact",
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: "Consulta web · tenaasesores",
    description: input.message,
  })
  await gateway.sendLead(lead)
  return lead
}

export type PlanCustomizeCrmLeadSubmission = {
  lead: CrmLead
  leadId: number | null
  presupuesto: PresupuestoFlash | null
}

export async function submitPlanCustomizeCrmLead(
  gateway: OdooLeadGateway,
  inquiry: ValidatedPlanCustomizeInquiry
): Promise<PlanCustomizeCrmLeadSubmission> {
  const lead = createCrmLead({
    source: "plan_customize",
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    subject: `${planCustomizeForm.messagePrefix[inquiry.audience]} Solicitud de plan`,
    description: formatPlanCustomizeLeadDescription(inquiry),
  })
  const { leadId, presupuesto } = await gateway.sendLead(lead)
  return { lead, leadId, presupuesto }
}
