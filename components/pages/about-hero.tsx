"use client"

import { useRef } from "react"
import { BadgeCheck, Building2, Tag } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { FadeIn, FloatingElement } from "@/components/animations"
import { useHomeStatsGsap } from "@/components/gsap/use-home-stats-gsap"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { about } from "@/content/site"
import { formatStatValue } from "@/lib/gsap/format-stat-value"
import { cn } from "@/lib/utils"

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2301dea2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

const GRID_MASK =
  "radial-gradient(ellipse 70% 65% at 50% 35%, black 35%, transparent 90%)"

const pillarIcons: Record<(typeof about.pillars)[number]["icon"], LucideIcon> = {
  building: Building2,
  "badge-check": BadgeCheck,
  tag: Tag,
}

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeStatsGsap({ sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface-dark pt-20 pb-16 md:pt-28 md:pb-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <FloatingElement
          className="absolute -top-20 right-[-10%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-primary/10 blur-[100px]"
          duration={12}
        />
        <div className="absolute bottom-0 left-[-15%] h-80 w-80 rounded-full bg-agua/25 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: GRID_PATTERN,
            maskImage: GRID_MASK,
            WebkitMaskImage: GRID_MASK,
          }}
        />
      </div>

      <SectionShell className="relative">
        <MarketingSectionHeading
          badge={about.badge}
          title={about.title}
          subtitle={about.subtitle}
          tone="dark"
          as="h1"
          size="page"
        />

        <FadeIn delay={0.08}>
          <ul
            className="mx-auto mt-12 grid max-w-md grid-cols-1 items-center justify-items-center gap-8 text-center md:mt-14 md:max-w-2xl md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:max-w-4xl lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-0 lg:divide-x lg:divide-agua/15 lg:text-left"
            aria-label="Por qué elegir tenaasesores"
          >
            {about.pillars.map((pillar, index) => {
              const Icon = pillarIcons[pillar.icon]
              return (
                <li
                  key={pillar.title}
                  className={cn(
                    index === 1 && "md:order-1 md:col-span-2",
                    index === 0 && "md:order-2",
                    index === 2 && "md:order-3",
                    "lg:order-none lg:shrink-0 lg:px-8 lg:first:pl-0 lg:last:pr-0"
                  )}
                >
                  <Icon className="mb-3 size-[18px] text-primary" strokeWidth={1.75} aria-hidden />
                  <p className="text-sm font-semibold text-on-dark lg:text-nowrap">
                    {pillar.title}
                  </p>
                  <p className="mx-auto mt-1.5 max-w-[26ch] text-sm leading-relaxed text-muted-on-dark lg:mx-0">
                    {pillar.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </FadeIn>

        <FadeIn delay={0.16}>
          <ul
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-agua/25 pt-12 text-center sm:gap-x-10 md:mt-14 lg:grid-cols-4 lg:gap-8 lg:pt-14"
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
                    {formatStatValue(stat.end, stat.prefix, stat.suffix)}
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
