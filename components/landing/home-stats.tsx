"use client"

import { useRef } from "react"
import { useHomeStatsGsap } from "@/components/gsap/use-home-stats-gsap"
import { SectionShell } from "@/components/layout/section-shell"
import { homeStats } from "@/content/site"
import { formatStatValue } from "@/lib/gsap/format-stat-value"

export function HomeStats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useHomeStatsGsap({ sectionRef })

  return (
    <div
      ref={sectionRef}
      role="region"
      className="relative px-2 pb-10 pt-10 md:pb-14 md:pt-12"
      aria-label="Cifras de tenaasesores"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full bg-gradient-to-b from-transparent from-[0%] via-background via-[55%] to-background"
        aria-hidden
      />

      <SectionShell className="relative z-10">
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
    </div>
  )
}
