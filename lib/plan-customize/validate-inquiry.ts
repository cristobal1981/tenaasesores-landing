import { contactForm } from "@/content/contact-form"
import { planCustomizeForm, type PlanCustomizeAudience, empresasEmployeeCountValidationMessage, empresasHasEmployeesValidationMessage } from "@/content/plan-customize-form"
import { isLikelyValidPhone } from "@/lib/contact/validate-inquiry"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type YesNoValue = "yes" | "no"
export type TaxRegionValue = "peninsula" | "canarias"

export type PlanCustomizeInquiryPayload = {
  audience: PlanCustomizeAudience
  isRegisteredAutonomo?: string
  willHireEmployees?: string
  isNewConstitution?: string
  hasEmployees?: string
  employeeCount?: string
  annualRevenue?: string
  services?: string[]
  activity?: string
  taxRegion?: string
  name?: string
  email?: string
  phone?: string
  notes?: string
  company?: string
  formStartedAt?: number
}

export type ValidatedPlanCustomizeInquiry = {
  audience: PlanCustomizeAudience
  isRegisteredAutonomo: YesNoValue
  willHireEmployees: YesNoValue
  isNewConstitution: YesNoValue
  hasEmployees: YesNoValue
  employeeCount?: number
  annualRevenue: string
  services: string[]
  activity: string
  taxRegion: TaxRegionValue
  name: string
  email: string
  phone?: string
  notes?: string
}

export type PlanCustomizeValidationErrorCode =
  | "honeypot"
  | "too_fast"
  | "audience"
  | "invalid_body"

export type PlanCustomizeValidationResult =
  | { ok: true; data: ValidatedPlanCustomizeInquiry }
  | { ok: false; code: PlanCustomizeValidationErrorCode }

export function isValidAnnualRevenueInput(raw: string): boolean {
  const digits = raw.replace(/\D/g, "")
  if (
    digits.length < planCustomizeForm.limits.revenueDigitsMin ||
    digits.length > planCustomizeForm.limits.revenueDigitsMax
  ) {
    return false
  }
  const value = Number.parseInt(digits, 10)
  return Number.isFinite(value) && value > 0
}

function parseYesNo(value: unknown): YesNoValue | null {
  return value === "yes" || value === "no" ? value : null
}

function parseTaxRegion(value: unknown): TaxRegionValue | null {
  return value === "peninsula" || value === "canarias" ? value : null
}

function allowedServiceValues(audience: PlanCustomizeAudience): Set<string> {
  return new Set(
    planCustomizeForm.step2.serviceOptions[audience].map((option) => option.value)
  )
}

export function getPlanCustomizeStepValidationError(
  currentStep: number,
  audience: PlanCustomizeAudience,
  values: {
    isRegisteredAutonomo: string
    willHireEmployees: string
    isNewConstitution: string
    hasEmployees: string
    employeeCount: string
    annualRevenue: string
    services: string[]
    activity: string
    taxRegion: string
    name: string
    email: string
    phone: string
  }
): string | null {
  if (currentStep === 1) {
    if (audience === "autonomos") {
      if (!parseYesNo(values.isRegisteredAutonomo)) {
        return planCustomizeForm.validation.registeredAutonomo
      }
      if (!parseYesNo(values.willHireEmployees)) {
        return planCustomizeForm.validation.hireEmployees
      }
    } else {
      if (!parseYesNo(values.isNewConstitution)) {
        return planCustomizeForm.validation.newConstitution
      }
      if (!parseYesNo(values.hasEmployees)) {
        return empresasHasEmployeesValidationMessage(values.isNewConstitution)
      }
      if (values.hasEmployees === "yes") {
        const count = Number.parseInt(values.employeeCount, 10)
        if (!Number.isFinite(count) || count < 1) {
          return empresasEmployeeCountValidationMessage(values.isNewConstitution)
        }
      }
    }
    if (!isValidAnnualRevenueInput(values.annualRevenue)) {
      return planCustomizeForm.validation.revenue
    }
    return null
  }

  if (currentStep === 2) {
    if (values.services.length === 0) {
      return planCustomizeForm.validation.services
    }
    return null
  }

  if (currentStep === 3) {
    const activityTrimmed = values.activity.trim()
    if (
      activityTrimmed.length < planCustomizeForm.limits.activityMin ||
      activityTrimmed.length > planCustomizeForm.limits.activityMax
    ) {
      return planCustomizeForm.validation.activity
    }
    if (!parseTaxRegion(values.taxRegion)) {
      return planCustomizeForm.validation.taxRegion
    }
    if (!values.name.trim()) {
      return planCustomizeForm.validation.name
    }
    if (!values.email.trim() || !EMAIL_RE.test(values.email.trim())) {
      return planCustomizeForm.validation.email
    }
    if (values.phone.trim().length > 0 && !isLikelyValidPhone(values.phone)) {
      return contactForm.messages.phoneInvalid
    }
  }

  return null
}

export function validatePlanCustomizeInquiry(
  input: PlanCustomizeInquiryPayload,
  now = Date.now()
): PlanCustomizeValidationResult {
  if (typeof input.company === "string" && input.company.trim().length > 0) {
    return { ok: false, code: "honeypot" }
  }

  const startedAt =
    typeof input.formStartedAt === "number" && Number.isFinite(input.formStartedAt)
      ? input.formStartedAt
      : 0

  if (startedAt > 0 && now - startedAt < contactForm.limits.minSubmitDelayMs) {
    return { ok: false, code: "too_fast" }
  }

  const audience = input.audience
  if (audience !== "autonomos" && audience !== "empresas") {
    return { ok: false, code: "audience" }
  }

  const stepValues = {
    isRegisteredAutonomo:
      typeof input.isRegisteredAutonomo === "string" ? input.isRegisteredAutonomo : "",
    willHireEmployees:
      typeof input.willHireEmployees === "string" ? input.willHireEmployees : "",
    isNewConstitution:
      typeof input.isNewConstitution === "string" ? input.isNewConstitution : "",
    hasEmployees: typeof input.hasEmployees === "string" ? input.hasEmployees : "",
    employeeCount: typeof input.employeeCount === "string" ? input.employeeCount : "",
    annualRevenue: typeof input.annualRevenue === "string" ? input.annualRevenue : "",
    services: Array.isArray(input.services)
      ? input.services.filter((item): item is string => typeof item === "string")
      : [],
    activity: typeof input.activity === "string" ? input.activity : "",
    taxRegion: typeof input.taxRegion === "string" ? input.taxRegion : "",
    name: typeof input.name === "string" ? input.name : "",
    email: typeof input.email === "string" ? input.email : "",
    phone: typeof input.phone === "string" ? input.phone : "",
  }

  for (let step = 1; step <= 3; step += 1) {
    if (getPlanCustomizeStepValidationError(step, audience, stepValues) !== null) {
      return { ok: false, code: "invalid_body" }
    }
  }

  const allowedServices = allowedServiceValues(audience)
  const services = stepValues.services.filter((value) => allowedServices.has(value))
  if (services.length === 0) {
    return { ok: false, code: "invalid_body" }
  }

  const notesRaw = typeof input.notes === "string" ? input.notes.trim() : ""
  if (notesRaw.length > planCustomizeForm.limits.notesMax) {
    return { ok: false, code: "invalid_body" }
  }

  const isRegisteredAutonomo =
    audience === "autonomos" ? parseYesNo(stepValues.isRegisteredAutonomo) : "no"
  const willHireEmployees =
    audience === "autonomos" ? parseYesNo(stepValues.willHireEmployees) : "no"
  const isNewConstitution =
    audience === "empresas" ? parseYesNo(stepValues.isNewConstitution) : "no"
  const hasEmployees = audience === "empresas" ? parseYesNo(stepValues.hasEmployees) : "no"

  if (
    !isRegisteredAutonomo ||
    !willHireEmployees ||
    !isNewConstitution ||
    !hasEmployees
  ) {
    return { ok: false, code: "invalid_body" }
  }

  const employeeCount =
    audience === "empresas" && hasEmployees === "yes"
      ? Number.parseInt(stepValues.employeeCount, 10)
      : undefined

  return {
    ok: true,
    data: {
      audience,
      isRegisteredAutonomo,
      willHireEmployees,
      isNewConstitution,
      hasEmployees,
      employeeCount,
      annualRevenue: stepValues.annualRevenue.replace(/\D/g, ""),
      services,
      activity: stepValues.activity.trim(),
      taxRegion: parseTaxRegion(stepValues.taxRegion)!,
      name: stepValues.name.trim(),
      email: stepValues.email.trim().toLowerCase(),
      phone: stepValues.phone.trim() || undefined,
      notes: notesRaw || undefined,
    },
  }
}
