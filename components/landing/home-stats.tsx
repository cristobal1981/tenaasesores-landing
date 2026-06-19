"use client"

import { useRef } from "react"
import { useHomeStatsGsap } from "@/components/gsap/use-home-stats-gsap"
import { SectionShell } from "@/components/layout/section-shell"
import { homeStats } from "@/content/site"
import { formatStatValue } from "@/lib/gsap/format-stat-value"

export function HomeStats() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeStatsGsap({ sectionRef })

  return (
    <section
      ref={sectionRef}
      className="border-y border-agua/20 bg-surface-light py-12 md:py-16"
      aria-label="Cifras de tenaasesores"
    >
      <SectionShell>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-8">
          {homeStats.items.map((stat) => (
            <li key={stat.label} className="text-center">
              <p
                className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-[2.5rem]"
                data-stat-counter
                data-stat-end={stat.end}
                data-stat-prefix={stat.prefix}
                data-stat-suffix={stat.suffix}
              >
                {formatStatValue(0, stat.prefix, stat.suffix)}
              </p>
              <p className="text-sm font-medium text-on-light md:text-base">{stat.label}</p>
            </li>
          ))}
        </ul>
      </SectionShell>
    </section>
  )
}
