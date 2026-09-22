"use client"

import { useRef } from "react"
import { m } from "framer-motion"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import { IsotipoMark } from "@/components/icons/isotipo-mark"
import { SectionIntro } from "@/components/layout/section-intro"
import { SectionShell } from "@/components/layout/section-shell"
import { philosophy } from "@/content/site"
import { cn } from "@/lib/utils"

const cardBackgroundStyle = {
  background:
    "linear-gradient(180deg, color-mix(in oklch, var(--on-light) 7%, var(--surface-light)) 0%, var(--surface-light) 60%)",
} as const

function SubtitleWithClave() {
  const [before, after] = philosophy.subtitle.split("CLAVE")

  return (
    <>
      {before}
      <span className="font-semibold text-primary">CLAVE</span>
      {after}
    </>
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl"
      style={cardBackgroundStyle}
    >
      <div className="@container flex h-28 shrink-0 items-center justify-center overflow-hidden sm:h-32 lg:h-36">
        <span
          className="home-clave-card-letter font-semibold text-agua opacity-50 transition-colors duration-[450ms] ease-out group-hover:text-primary"
          style={{
            maskImage: "linear-gradient(180deg, black 45%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(180deg, black 45%, transparent 92%)",
          }}
        >
          {value.letter}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6">
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
    <div className="mx-auto mt-8 grid grid-cols-1 gap-8 sm:max-w-3xl sm:grid-cols-2 md:mt-10 xl:max-w-none xl:grid-cols-3 xl:gap-10">
      {philosophy.manifestoPoints.map((point, index) => {
        const isLast = index === philosophy.manifestoPoints.length - 1
        return (
          <m.div
            key={point.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              isLast && "sm:col-span-2 sm:mx-auto sm:max-w-sm xl:col-span-1 xl:mx-0 xl:max-w-none"
            )}
          >
            <p className="mb-1.5 flex items-center gap-2 text-lg font-semibold text-on-light">
              <IsotipoMark className="h-4 w-4 shrink-0 text-agua" />
              {point.title}
            </p>
            <p className="text-sm leading-relaxed text-muted-on-light">{point.detail}</p>
          </m.div>
        )
      })}
    </div>
  )
}

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  useHomeSectionReveal({ sectionRef })

  return (
    <section
      ref={sectionRef}
      id="como-trabajamos"
      className="section-divider relative overflow-hidden bg-surface-light py-20 md:py-28"
    >
      <SectionShell>
        <SectionIntro
          className="mx-auto mb-14 md:mb-16"
          eyebrow={philosophy.badge}
          title={philosophy.title}
          subtitle={<SubtitleWithClave />}
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
