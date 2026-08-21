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
      className="relative px-2 py-6 md:py-8"
      aria-label="Cifras de tenaasesores"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full bg-gradient-to-b from-transparent from-[0%] via-background via-[55%] to-background"
        aria-hidden
      />

      <SectionShell className="relative z-10">
        <ul className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-x-5">
          {homeStats.items.map((stat) => (
            <li key={stat.label} className="text-center">
              <p
                className={`mb-1 font-sans text-[clamp(1.75rem,3.6vw,2.5rem)] leading-none font-bold tracking-tight tabular-nums ${stat.colorClass}`}
                data-stat-counter
                data-stat-end={stat.end}
                data-stat-prefix={stat.prefix}
                data-stat-suffix={stat.suffix}
                {...("colorFrom" in stat && stat.colorFrom
                  ? {
                      "data-stat-color-from": stat.colorFrom,
                      "data-stat-color-to": stat.colorTo,
                    }
                  : {})}
              >
                {formatStatValue(0, stat.prefix, stat.suffix)}
              </p>
              <p className="text-xs font-medium text-muted-on-dark md:text-sm">{stat.label}</p>
            </li>
          ))}
        </ul>
      </SectionShell>
    </div>
  )
}
