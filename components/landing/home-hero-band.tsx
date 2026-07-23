"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { useHeroGsap } from "@/components/gsap/use-hero-gsap"
import { HomeThreeField } from "@/components/landing/home-three-field"
import { SectionShell } from "@/components/layout/section-shell"
import { MarketingButton } from "@/components/ui/marketing-button"
import { contactHref, hero } from "@/content/site"

const ROTATING_WORD_WIDTH_BUFFER = 4

function measureRotatingWordWidth(node: HTMLElement | null) {
  if (!node) return 0
  return Math.ceil(node.getBoundingClientRect().width) + ROTATING_WORD_WIDTH_BUFFER
}

export function HomeHeroBand() {
  const contentRef = useRef<HTMLDivElement>(null)
  const wordMeasureRefs = useRef<Array<HTMLSpanElement | null>>([])
  const reducedMotion = useReducedMotion()
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [wordWidths, setWordWidths] = useState<number[]>([])
  const activeWord = hero.title.rotatingWords[activeWordIndex]

  useHeroGsap({ contentRef })

  useEffect(() => {
    if (reducedMotion || hero.title.rotatingWords.length < 2) return
    const interval = window.setInterval(() => {
      setActiveWordIndex((current) => (current + 1) % hero.title.rotatingWords.length)
    }, 2600)
    return () => window.clearInterval(interval)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const measureWidths = () => {
      const nextWidths = hero.title.rotatingWords.map((_, index) =>
        measureRotatingWordWidth(wordMeasureRefs.current[index]),
      )
      setWordWidths(nextWidths)
    }

    measureWidths()
    void document.fonts?.ready.then(measureWidths)

    const resizeObserver = new ResizeObserver(measureWidths)
    for (const node of wordMeasureRefs.current) {
      if (node) resizeObserver.observe(node)
    }

    window.addEventListener("resize", measureWidths)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", measureWidths)
    }
  }, [reducedMotion])

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden bg-home-hero-surface">
      <HomeThreeField />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(1,222,162,0.12)_0%,rgba(4,29,35,0)_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(4,29,35,0.28)_0%,rgba(4,29,35,0.02)_32%,rgba(4,29,35,0.02)_68%,rgba(4,29,35,0.24)_100%)]"
        aria-hidden
      />

      <div className="relative z-[3] flex flex-1 flex-col justify-center">
        <SectionShell className="flex flex-1 flex-col justify-center py-10 sm:py-12 md:py-14">
          <div
            ref={contentRef}
            className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6"
          >
            <p className="mb-8 text-[0.72rem] font-semibold tracking-[0.22em] text-primary uppercase">
              {hero.audienceLabel} · {hero.proofLabel}
            </p>

            <h1
              data-hero="title"
              className="home-hero-title mx-auto mb-8 max-w-5xl font-semibold tracking-[-0.06em] text-on-dark"
            >
              <span className="relative inline-flex items-baseline whitespace-nowrap">
                <span className="relative inline text-on-dark">{hero.title.prefix}&nbsp;</span>
                <m.span
                  className="relative inline-grid h-[1.05em] overflow-hidden align-baseline whitespace-nowrap text-primary [grid-template-areas:'word']"
                  initial={false}
                  animate={
                    reducedMotion || !wordWidths[activeWordIndex]
                      ? undefined
                      : { width: wordWidths[activeWordIndex] }
                  }
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  {reducedMotion ? (
                    <span className="[grid-area:word]">{hero.title.rotatingWords[0]}</span>
                  ) : (
                    <AnimatePresence mode="wait" initial={false}>
                      <m.span
                        key={activeWord}
                        className="inline-flex whitespace-nowrap [grid-area:word]"
                      >
                        {Array.from(activeWord).map((character, index) => (
                          <m.span
                            key={`${character}-${index}`}
                            className="inline-block"
                            initial={{ y: "-105%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "-105%", opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 290,
                              damping: 24,
                              delay: index * 0.018,
                            }}
                          >
                            {character}
                          </m.span>
                        ))}
                      </m.span>
                    </AnimatePresence>
                  )}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -z-10 opacity-0"
                  >
                    {hero.title.rotatingWords.map((word, index) => (
                      <span
                        key={`measure-${word}`}
                        ref={(node) => {
                          wordMeasureRefs.current[index] = node
                        }}
                        className="absolute top-0 left-0 inline-flex whitespace-nowrap"
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </m.span>
              </span>
              <span className="mt-5 block text-[clamp(1.2rem,2.6vw,2.05rem)] leading-[1.12] font-medium tracking-[-0.03em] text-muted-on-dark">
                {hero.title.bridgeWord}
              </span>
              <span className="mt-2 block text-[clamp(1.2rem,2.6vw,2.05rem)] leading-[1.12] font-medium tracking-[-0.03em] text-on-dark">
                {hero.title.secondLine}
              </span>
            </h1>

            <p
              data-hero="subtitle"
              className="prose-width mx-auto mb-10 text-base leading-relaxed text-muted-on-dark sm:text-lg"
            >
              {hero.subtitle}
            </p>

            <div
              data-hero="ctas"
              className="mb-2 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <MarketingButton asChild size="lg" className="px-8 text-base">
                <Link href={contactHref}>
                  {hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MarketingButton>
              <MarketingButton
                asChild
                size="lg"
                variant="outline"
                marketingVariant="secondary"
                className="px-8 text-base"
              >
                <Link href="/servicios">{hero.ctaSecondary}</Link>
              </MarketingButton>
            </div>
          </div>
        </SectionShell>
      </div>
    </section>
  )
}
