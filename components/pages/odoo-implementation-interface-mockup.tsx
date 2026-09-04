"use client"

import Image from "next/image"
import {
  GraduationCap,
  Landmark,
  LifeBuoy,
  ListChecks,
  Receipt,
  Search,
  type LucideIcon,
} from "lucide-react"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import type { OdooModule, OdooPhase } from "@/content/odoo-implementation"
import { cn } from "@/lib/utils"

// Color real de marca de Odoo (no el nuestro) — acento puntual del mockup,
// mismo criterio que ODOO_BRAND en components/landing/odoo-partners.tsx.
const ODOO_BRAND = "#714b67"

const moduleIcons: Record<OdooModule, LucideIcon> = {
  auditoria: Search,
  estructura: ListChecks,
  bancos: Landmark,
  facturacion: Receipt,
  formacion: GraduationCap,
  acompanamiento: LifeBuoy,
}

const moduleOrder: readonly OdooModule[] = [
  "auditoria",
  "estructura",
  "bancos",
  "facturacion",
  "formacion",
  "acompanamiento",
]

const rowFillWidthClass = {
  sm: "w-2/5",
  md: "w-3/5",
  lg: "w-4/5",
  full: "w-full",
} as const

type InterfaceMockupProps = {
  phase: OdooPhase
  className?: string
}

export function OdooImplementationInterfaceMockup({ phase, className }: InterfaceMockupProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-2xl border border-agua/25", className)}
      style={{ backgroundColor: "color-mix(in oklch, var(--on-dark) 4%, var(--surface-dark))" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 90% 6%, color-mix(in srgb, ${ODOO_BRAND} 16%, transparent), transparent 55%)`,
        }}
      />

      <div className="relative flex items-center gap-3 border-b border-agua/20 px-5 py-3">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-on-dark/15" />
          <span className="size-2 rounded-full bg-on-dark/15" />
          <span className="size-2 rounded-full bg-on-dark/15" />
        </span>
        <Image
          src="/brand/partners/odoo.webp"
          alt=""
          width={860}
          height={278}
          className="h-4 w-auto opacity-70"
        />
      </div>

      <div className="relative flex">
        <div className="flex flex-col gap-2 border-r border-agua/20 px-3 py-4">
          {moduleOrder.map((module) => {
            const Icon = moduleIcons[module]
            const isActive = module === phase.module
            return (
              <span
                key={module}
                className="flex size-8 items-center justify-center rounded-lg transition-colors duration-300"
                style={
                  isActive
                    ? { backgroundColor: `color-mix(in srgb, ${ODOO_BRAND} 20%, transparent)` }
                    : undefined
                }
              >
                <Icon
                  className={cn("size-4", isActive ? "text-on-dark" : "text-muted-on-dark")}
                />
              </span>
            )
          })}
        </div>

        <div className="min-w-0 flex-1 p-5 sm:p-6">
          {reducedMotion ? (
            <MockupContent phase={phase} />
          ) : (
            <LazyMotion features={domAnimation} strict>
              <m.div
                key={phase.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <MockupContent phase={phase} />
              </m.div>
            </LazyMotion>
          )}
        </div>
      </div>
    </div>
  )
}

function MockupContent({ phase }: { phase: OdooPhase }) {
  return (
    <>
      <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-muted-on-dark uppercase">
        {phase.mockup.headerLabel}
      </p>

      <div className="mb-6 space-y-3.5">
        {phase.mockup.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="min-w-0 flex-1 text-xs text-muted-on-dark">{row.label}</span>
            <span className="h-2 w-16 shrink-0 overflow-hidden rounded-full bg-on-dark/8 sm:w-24">
              <span
                className={cn(
                  "block h-full rounded-full",
                  rowFillWidthClass[row.width],
                  row.tone === "highlight" ? "bg-primary" : "bg-on-dark/25",
                )}
              />
            </span>
          </div>
        ))}
      </div>

      {phase.mockup.kpis ? (
        <div className="grid grid-cols-2 gap-3">
          {phase.mockup.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-agua/20 px-3 py-2.5">
              <p className="text-[0.65rem] tracking-wide text-muted-on-dark uppercase">
                {kpi.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-on-dark">{kpi.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}
