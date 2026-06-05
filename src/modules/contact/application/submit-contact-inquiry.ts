import { createContactInquiry } from "@/src/modules/contact/domain/contact-inquiry"
import type { OdooLeadGateway } from "@/src/modules/leads/infrastructure/odoo-lead-gateway"
import { submitContactCrmLead } from "@/src/modules/leads/application/submit-crm-lead"

export async function submitContactInquiry(
  gateway: OdooLeadGateway,
  input: {
    name: string
    phone?: string
    email: string
    message: string
  }
) {
  const inquiry = createContactInquiry(input)
  await submitContactCrmLead(gateway, input)
  return inquiry
}
