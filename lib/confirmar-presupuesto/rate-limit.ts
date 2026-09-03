import { planCustomizeForm } from "@/content/plan-customize-form"

type Bucket = {
  count: number
  resetAt: number
}

const ipBuckets = new Map<string, Bucket>()
const leadBuckets = new Map<string, Bucket>()

const HOUR_MS = 60 * 60 * 1000

function pruneBuckets(store: Map<string, Bucket>, now: number) {
  if (store.size < 500) return
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}

function consumeToken(
  store: Map<string, Bucket>,
  key: string,
  max: number,
  windowMs: number,
  now: number
): { allowed: boolean; retryAfterSec: number } {
  pruneBuckets(store, now)

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSec: 0 }
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return { allowed: true, retryAfterSec: 0 }
}

// leadId es un entero secuencial de Odoo expuesto al cliente, sin más
// autenticación — este rate-limit por leadId/ip dificulta (no impide del
// todo) que alguien enumere IDs para confirmar/cancelar leads ajenos.
export function checkConfirmarPresupuestoRateLimit(input: {
  ip: string
  leadId: number
  now?: number
}): { allowed: boolean; retryAfterSec: number; reason?: "ip" | "leadId" } {
  const now = input.now ?? Date.now()
  const { rateLimit } = planCustomizeForm.confirmarPresupuesto

  const ipResult = consumeToken(ipBuckets, `ip:${input.ip}`, rateLimit.maxPerIpPerHour, HOUR_MS, now)
  if (!ipResult.allowed) {
    return { allowed: false, retryAfterSec: ipResult.retryAfterSec, reason: "ip" }
  }

  const leadResult = consumeToken(
    leadBuckets,
    `leadId:${input.leadId}`,
    rateLimit.maxPerLeadPerHour,
    HOUR_MS,
    now
  )
  if (!leadResult.allowed) {
    return { allowed: false, retryAfterSec: leadResult.retryAfterSec, reason: "leadId" }
  }

  return { allowed: true, retryAfterSec: 0 }
}
