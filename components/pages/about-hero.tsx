"use client"

import { useRef } from "react"
import { FadeIn, FloatingElement } from "@/components/animations"
import { useHomeStatsGsap } from "@/components/gsap/use-home-stats-gsap"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { about } from "@/content/site"
import { formatStatValue } from "@/lib/gsap/format-stat-value"

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2301dea2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeStatsGsap({ sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface-dark pt-20 pb-16 md:pt-28 md:pb-20 lg:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <FloatingElement
          className="absolute -top-20 right-[-10%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-primary/10 blur-[100px]"
          duration={12}
        />
        <div className="absolute bottom-0 left-[-15%] h-80 w-80 rounded-full bg-agua/25 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: GRID_PATTERN }}
        />
      </div>

      <SectionShell className="relative">
        <MarketingSectionHeading
          badge={about.badge}
          title={about.title}
          subtitle={about.subtitle}
          tone="dark"
          titleLine2Tone="primary"
          as="h1"
          size="page"
        />

        <FadeIn delay={0.1}>
          <ul
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-agua/25 pt-12 text-center sm:gap-x-10 md:mt-16 lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:pt-14"
            aria-label="Cifras de tenaasesores"
          >
            {about.stats.map((stat) => (
              <li key={stat.label} className="flex flex-col items-center">
                <dl className="flex flex-col items-center">
                  <dd
                    className="text-stat-on-dark font-sans text-[clamp(2rem,4.5vw,2.75rem)] leading-none font-bold tracking-tight tabular-nums"
                    data-stat-counter
                    data-stat-end={stat.end}
                    data-stat-prefix={stat.prefix}
                    data-stat-suffix={stat.suffix}
                  >
                    {formatStatValue(0, stat.prefix, stat.suffix)}
                  </dd>
                  <dt className="mt-2 max-w-[16ch] text-sm leading-snug text-muted-on-dark">
                    {stat.label}
                  </dt>
                </dl>
              </li>
            ))}
          </ul>
        </FadeIn>
      </SectionShell>
    </section>
  )
}
