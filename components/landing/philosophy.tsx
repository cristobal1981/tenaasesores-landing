"use client"

import { useRef } from "react"
import { m } from "framer-motion"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import { SectionIntro } from "@/components/layout/section-intro"
import { SectionShell } from "@/components/layout/section-shell"
import { philosophy } from "@/content/site"

const cardBackgroundStyle = {
  background: "color-mix(in oklch, var(--on-light) 4%, var(--surface-light))",
} as const

const cardScrimStyle = {
  background:
    "linear-gradient(0deg, rgba(240,246,246,.98) 0%, rgba(240,246,246,.88) 34%, rgba(240,246,246,.35) 62%, transparent 84%)",
} as const

function IsotipoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 485.65 485.67" fill="currentColor" aria-hidden className={className}>
      <path d="M241.81,1L1,241.83c-.64.64-1,1.51-1,2.42v116.58c0,1.89,1.53,3.42,3.42,3.42h116.56c.9,0,1.74-.34,2.39-.97,9.94-9.8,92.54-91.29,115.07-114.67,2.09-2.17.54-5.79-2.48-5.79h-107.72c-3.05,0-4.58-3.69-2.42-5.85l114.57-114.57c.64-.64,1.51-1,2.42-1h121c.91,0,1.78-.36,2.42-1L479.8,5.85c2.16-2.16.63-5.85-2.42-5.85h-233.15c-.91,0-1.78.36-2.42,1Z" />
      <path d="M243.84,484.67l240.8-240.83c.64-.64,1-1.51,1-2.42v-116.58c0-1.89-1.53-3.42-3.42-3.42h-116.56c-.9,0-1.74.34-2.39.97-9.94,9.8-92.54,91.29-115.07,114.67-2.09,2.17-.54,5.79,2.48,5.79h107.72c3.05,0,4.58,3.69,2.42,5.85l-114.57,114.57c-.64.64-1.51,1-2.42,1h-121c-.91,0-1.78.36-2.42,1L5.85,479.83c-2.16,2.16-.63,5.85,2.42,5.85h233.15c.91,0,1.78-.36,2.42-1Z" />
    </svg>
  )
}

function ClaveCard({
  value,
  index,
}: {
  value: (typeof philosophy.values)[number]
  index: number
}) {
  const [firstLetter, ...restLetters] = value.title

  return (
    <m.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group @container relative isolate aspect-[2/1] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[6/7]"
      style={cardBackgroundStyle}
    >
      <div aria-hidden className="absolute inset-0 z-0 flex items-start justify-center overflow-hidden pt-[6cqw]">
        <span className="home-clave-card-letter font-semibold text-agua opacity-50 transition-colors duration-[450ms] ease-out group-hover:text-primary">
          {value.letter}
        </span>
      </div>
      <div aria-hidden className="absolute inset-0 z-[1]" style={cardScrimStyle} />
      <div className="relative z-[2] flex h-full flex-col justify-end p-5 pb-6">
        <h3 className="mb-1.5 text-sm font-bold tracking-wide text-on-light uppercase">
          <span className="text-agua transition-colors duration-[450ms] ease-out group-hover:text-primary">
            {firstLetter}
          </span>
          {restLetters.join("")}
        </h3>
        <p className="text-[0.8rem] leading-relaxed text-muted-on-light">{value.description}</p>
      </div>
    </m.article>
  )
}

function DiaADiaRow() {
  return (
    <div
      className="mt-14 grid grid-cols-1 gap-6 border-t pt-6 sm:grid-cols-3 sm:gap-10 md:mt-16"
      style={{ borderColor: "color-mix(in oklch, var(--agua) 22%, transparent)" }}
    >
      {philosophy.manifestoPoints.map((point, index) => (
        <m.div
          key={point.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-1.5 flex items-center gap-2 text-lg font-semibold text-on-light">
            <IsotipoMark className="h-4 w-4 shrink-0 text-agua" />
            {point.title}
          </p>
          <p className="text-sm leading-relaxed text-muted-on-light">{point.detail}</p>
        </m.div>
      ))}
    </div>
  )
}

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeSectionReveal({ sectionRef })

  return (
    <section
      ref={sectionRef}
      className="section-divider relative overflow-hidden bg-surface-light py-20 md:py-28"
    >
      <SectionShell>
        <SectionIntro
          className="mx-auto mb-14 md:mb-16"
          eyebrow={philosophy.badge}
          title={philosophy.title}
          subtitle={philosophy.subtitle}
          align="center"
          tone="light"
          reveal
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {philosophy.values.map((value, index) => (
            <ClaveCard key={value.letter} value={value} index={index} />
          ))}
        </div>

        <p className="section-eyebrow section-eyebrow-on-light mt-14 text-center md:mt-16">
          {philosophy.manifestoTitle}
        </p>
        <DiaADiaRow />
      </SectionShell>
    </section>
  )
}
