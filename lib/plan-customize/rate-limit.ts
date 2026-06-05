import { planCustomizeForm } from "@/content/plan-customize-form"

export const planCustomizeClientStorageKey =
  "tenaasesores-plan-customize-submissions" as const

type ClientSubmissionLog = {
  timestamps: number[]
}

export function canSubmitPlanCustomizeFromClient(): boolean {
  if (typeof window === "undefined") return true

  try {
    const raw = sessionStorage.getItem(planCustomizeClientStorageKey)
    if (!raw) return true

    const parsed = JSON.parse(raw) as ClientSubmissionLog
    const now = Date.now()
    const windowMs = planCustomizeForm.rateLimit.clientWindowMs
    const recent = (parsed.timestamps ?? []).filter((t) => now - t < windowMs)
    return recent.length < planCustomizeForm.rateLimit.clientMaxPerWindow
  } catch {
    return true
  }
}

export function recordPlanCustomizeClientSubmission(): void {
  if (typeof window === "undefined") return

  try {
    const raw = sessionStorage.getItem(planCustomizeClientStorageKey)
    const now = Date.now()
    const parsed: ClientSubmissionLog = raw
      ? (JSON.parse(raw) as ClientSubmissionLog)
      : { timestamps: [] }
    const windowMs = planCustomizeForm.rateLimit.clientWindowMs
    const recent = (parsed.timestamps ?? []).filter((t) => now - t < windowMs)
    recent.push(now)
    sessionStorage.setItem(planCustomizeClientStorageKey, JSON.stringify({ timestamps: recent }))
  } catch {
    /* private mode */
  }
}
