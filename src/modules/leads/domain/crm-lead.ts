export type CrmLeadSource = "contact" | "plan_customize"

export type CrmLead = {
  source: CrmLeadSource
  name: string
  email: string
  phone?: string
  description: string
  subject: string
  createdAtIso: string
}

export function createCrmLead(input: Omit<CrmLead, "createdAtIso">): CrmLead {
  return {
    ...input,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || undefined,
    description: input.description.trim(),
    subject: input.subject.trim(),
    createdAtIso: new Date().toISOString(),
  }
}
