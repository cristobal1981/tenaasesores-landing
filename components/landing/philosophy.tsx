"use client"

import { useCallback, useMemo, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { FadeIn } from "@/components/animations"
import { ClaveValueCard } from "@/components/landing/clave-value-card"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { philosophy } from "@/content/site"
import { cn } from "@/lib/utils"

function splitTitleAtClaveLetter(title: string, letter: string) {
  const index = title.toLocaleUpperCase("es").indexOf(letter.toLocaleUpperCase("es"))
  if (index === -1) {
    return { before: "", highlight: title.charAt(0), after: title.slice(1) }
  }
  return {
    before: title.slice(0, index),
    highlight: title.charAt(index),
    after: title.slice(index + 1),
  }
}

export function Philosophy() {
  const reducedMotion = useReducedMotion()
  const [hoverLetter, setHoverLetter] = useState<string | null>(null)

  const titlePartsByLetter = useMemo(
    () =>
      Object.fromEntries(
        philosophy.values.map((value) => [
          value.letter,
          splitTitleAtClaveLetter(value.title, value.letter),
        ])
      ),
    []
  )

  const activeIndex = philosophy.values.findIndex((value) => value.letter === hoverLetter)
  const resolvedActiveIndex = activeIndex === -1 ? 0 : activeIndex
  const hasActive = hoverLetter !== null

  const activate = useCallback((letter: string) => {
    setHoverLetter(letter)
  }, [])

  const clearHover = useCallback(() => {
    setHoverLetter(null)
  }, [])

  const toggle = useCallback((letter: string) => {
    setHoverLetter((current) => (current === letter ? null : letter))
  }, [])

  return (
    <section className="relative overflow-hidden bg-surface-light py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2301635c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <SectionShell className="relative">
        <MarketingSectionHeading
          badge={philosophy.badge}
          title={philosophy.title}
          subtitle={philosophy.subtitle}
          tone="light"
          className="mb-12 max-w-3xl md:mb-16"
        />

        <div className="relative" onMouseLeave={clearHover}>
          <div className="mb-10 md:mb-12">
            <ol
              className="mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
              aria-label={`Letras de la filosofía ${philosophy.acronym}`}
            >
              {philosophy.values.map((value, index) => {
                const isActive = hoverLetter === value.letter
                const isDimmed = hasActive && !isActive

                return (
                  <li key={value.letter} className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      aria-label={value.title}
                      aria-pressed={isActive}
                      onMouseEnter={() => activate(value.letter)}
                      onFocus={() => activate(value.letter)}
                      onClick={() => toggle(value.letter)}
                      className={cn(
                        "relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border text-lg font-bold transition-[border-color,background-color,color,opacity,transform] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agua/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light sm:h-12 sm:w-12",
                        isActive
                          ? "border-agua bg-agua text-on-dark"
                          : "border-agua/25 bg-surface-light text-accent-on-light",
                        isDimmed && "opacity-45",
                        !reducedMotion && isActive && "motion-safe:scale-105",
                        reducedMotion && isActive && "ring-2 ring-agua ring-offset-2 ring-offset-surface-light"
                      )}
                    >
                      {value.letter}
                    </button>
                    {index < philosophy.values.length - 1 ? (
                      <span
                        className={cn(
                          "hidden h-0.5 w-5 rounded-full transition-[background-color,opacity] duration-500 ease-out sm:block md:w-7",
                          hasActive && resolvedActiveIndex > index ? "bg-agua/70" : "bg-agua/20",
                          hasActive && resolvedActiveIndex <= index && "opacity-50"
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-5">
            {philosophy.values.map((value, index) => {
              const isActive = hoverLetter === value.letter
              const isLast = index === philosophy.values.length - 1

              return (
                <div
                  key={value.letter}
                  className={cn(
                    isLast &&
                      "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md xl:col-span-1 xl:mx-0 xl:max-w-none",
                  )}
                  onMouseEnter={() => activate(value.letter)}
                >
                  <ClaveValueCard
                    value={value}
                    titleParts={titlePartsByLetter[value.letter]}
                    isActive={isActive}
                    hasActive={hasActive}
                    className={
                      !hasActive
                        ? "motion-safe:hover:border-agua/30 motion-safe:hover:bg-on-light/[0.07]"
                        : undefined
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>
      </SectionShell>
    </section>
  )
}
