import { contactForm } from "@/content/contact-form"

export type ContactInquiryPayload = {
  name: string
  phone?: string
  email: string
  message: string
  privacyAccepted?: boolean
  company?: string
  formStartedAt?: number
}

export type ValidatedContactInquiry = {
  name: string
  phone?: string
  email: string
  message: string
}

export type ContactValidationErrorCode =
  | "honeypot"
  | "too_fast"
  | "name"
  | "phone"
  | "email"
  | "message"
  | "privacy"
  | "invalid_body"

export type ContactValidationResult =
  | { ok: true; data: ValidatedContactInquiry }
  | { ok: false; code: ContactValidationErrorCode }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_ALLOWED_RE = /^\+?[\d\s().-]+$/
const PHONE_DIGITS_MIN = 9
const PHONE_DIGITS_MAX = 15

export function isValidEmail(rawEmail: string): boolean {
  const email = rawEmail.trim()
  return Boolean(email) && email.length <= contactForm.limits.emailMax && EMAIL_RE.test(email)
}

export function isLikelyValidPhone(phoneRaw: string): boolean {
  const value = phoneRaw.trim()
  if (!value) return true
  if (!PHONE_ALLOWED_RE.test(value)) return false

  const plusCount = (value.match(/\+/g) ?? []).length
  if (plusCount > 1) return false
  if (plusCount === 1 && !value.startsWith("+")) return false

  const digitsOnly = value.replace(/\D/g, "")
  return digitsOnly.length >= PHONE_DIGITS_MIN && digitsOnly.length <= PHONE_DIGITS_MAX
}

export function validateContactInquiry(
  input: ContactInquiryPayload,
  now = Date.now()
): ContactValidationResult {
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

  const name = typeof input.name === "string" ? input.name.trim() : ""
  const phoneRaw = typeof input.phone === "string" ? input.phone.trim() : ""
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : ""
  const message = typeof input.message === "string" ? input.message.trim() : ""

  if (!name || name.length > contactForm.limits.nameMax) {
    return { ok: false, code: "name" }
  }

  if (phoneRaw.length > contactForm.limits.phoneMax) {
    return { ok: false, code: "phone" }
  }

  if (!isLikelyValidPhone(phoneRaw)) {
    return { ok: false, code: "phone" }
  }

  if (!isValidEmail(email)) {
    return { ok: false, code: "email" }
  }

  if (
    message.length < contactForm.limits.messageMin ||
    message.length > contactForm.limits.messageMax
  ) {
    return { ok: false, code: "message" }
  }

  if (input.privacyAccepted !== true) {
    return { ok: false, code: "privacy" }
  }

  return {
    ok: true,
    data: {
      name,
      phone: phoneRaw || undefined,
      email,
      message,
    },
  }
}
