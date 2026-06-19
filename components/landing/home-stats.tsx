"use client"

import { useRef } from "react"
import { FloatingElement } from "@/components/animations"
import { useHomeStatsGsap } from "@/components/gsap/use-home-stats-gsap"
import { SectionShell } from "@/components/layout/section-shell"
import { homeStats } from "@/content/site"
import { formatStatValue } from "@/lib/gsap/format-stat-value"

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2301dea2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

export function HomeStats() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeStatsGsap({ sectionRef })

  return (
    <section
      ref={sectionRef}
      className="section-divider relative overflow-hidden border-t border-agua/25 bg-surface-dark py-12 md:py-16"
      aria-label="Cifras de tenaasesores"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <FloatingElement
          className="absolute -top-16 right-[-8%] h-[min(60vw,360px)] w-[min(60vw,360px)] rounded-full bg-primary/10 blur-[90px]"
          duration={12}
        />
        <div className="absolute bottom-0 left-[-10%] h-64 w-64 rounded-full bg-agua/25 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: GRID_PATTERN }}
        />
      </div>

      <SectionShell className="relative">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-8">
          {homeStats.items.map((stat) => (
            <li key={stat.label} className="text-center">
              <p
                className="text-stat-on-dark mb-2 font-sans text-[clamp(2rem,4.5vw,2.75rem)] leading-none font-bold tracking-tight tabular-nums"
                data-stat-counter
                data-stat-end={stat.end}
                data-stat-prefix={stat.prefix}
                data-stat-suffix={stat.suffix}
              >
                {formatStatValue(0, stat.prefix, stat.suffix)}
              </p>
              <p className="text-sm font-medium text-muted-on-dark md:text-base">{stat.label}</p>
            </li>
          ))}
        </ul>
      </SectionShell>
    </section>
  )
}
