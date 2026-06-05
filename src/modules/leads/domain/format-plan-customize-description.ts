import {
  planCustomizeForm,
  planCustomizeTaxRegions,
  planCustomizeYesNo,
  type PlanCustomizeAudience,
} from "@/content/plan-customize-form"
import type { ValidatedPlanCustomizeInquiry } from "@/lib/plan-customize/validate-inquiry"

function yesNoLabel(value: "yes" | "no"): string {
  return planCustomizeYesNo.find((option) => option.value === value)?.label ?? value
}

function taxRegionLabel(value: "peninsula" | "canarias"): string {
  return planCustomizeTaxRegions.find((option) => option.value === value)?.label ?? value
}

function serviceLabel(audience: PlanCustomizeAudience, value: string): string {
  const options = planCustomizeForm.step2.serviceOptions[audience]
  return options.find((option) => option.value === value)?.label ?? value
}

function formatEuroAmount(digits: string): string {
  const normalized = digits.replace(/\D/g, "")
  const value = Number.parseInt(normalized, 10)
  if (!Number.isFinite(value)) return normalized
  return `${value.toLocaleString("es-ES")}€`
}

function audienceSectionTitle(audience: PlanCustomizeAudience): string {
  return audience === "autonomos" ? "AUTÓNOMOS" : "EMPRESAS"
}

export function formatPlanCustomizeLeadDescription(
  inquiry: ValidatedPlanCustomizeInquiry
): string {
  const lines: string[] = [
    "============================",
    `DATOS PARA PLAN · ${audienceSectionTitle(inquiry.audience)}`,
    "============================",
  ]

  if (inquiry.audience === "autonomos") {
    lines.push(
      `- ${planCustomizeForm.step1.autonomos.registeredLabel} ${yesNoLabel(inquiry.isRegisteredAutonomo)}`
    )
    lines.push(
      `- ${planCustomizeForm.step1.autonomos.hireEmployeesLabel} ${yesNoLabel(inquiry.willHireEmployees)}`
    )
  } else {
    lines.push(
      `- ${planCustomizeForm.step1.empresas.newConstitutionLabel} ${yesNoLabel(inquiry.isNewConstitution)}`
    )
    lines.push(
      `- ${planCustomizeForm.step1.empresas.hasEmployeesLabel} ${yesNoLabel(inquiry.hasEmployees)}`
    )
    if (inquiry.hasEmployees === "yes" && inquiry.employeeCount != null) {
      lines.push(
        `- ${planCustomizeForm.step1.empresas.employeeCountLabel} ${inquiry.employeeCount}`
      )
    }
  }

  lines.push(
    `- ${planCustomizeForm.step1.revenueLabel}: ${formatEuroAmount(inquiry.annualRevenue)}`
  )
  lines.push("")
  lines.push(planCustomizeForm.step2.servicesLabel + ":")
  for (const service of inquiry.services) {
    lines.push(`- ${serviceLabel(inquiry.audience, service)}`)
  }
  lines.push("")
  lines.push(`- ${planCustomizeForm.step3.activityLabel} ${inquiry.activity}`)
  lines.push(
    `- ${planCustomizeForm.step3.taxRegionLabel}: ${taxRegionLabel(inquiry.taxRegion)}`
  )

  if (inquiry.notes) {
    lines.push("")
    lines.push("----------------------------")
    lines.push("COMENTARIO ADICIONAL")
    lines.push("----------------------------")
    lines.push(inquiry.notes)
  }

  return lines.join("\n")
}
