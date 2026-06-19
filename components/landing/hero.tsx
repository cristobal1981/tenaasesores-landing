"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { MarketingButton } from "@/components/ui/marketing-button"
import { ArrowRight, Award, Eye, Zap } from "lucide-react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { useHeroGsap } from "@/components/gsap/use-hero-gsap"
import { SectionShell } from "@/components/layout/section-shell"
import { hero } from "@/content/site"

const trustIcons = [Eye, Award, Zap]
const ROTATING_WORD_WIDTH_BUFFER = 4

function measureRotatingWordWidth(node: HTMLElement | null) {
  if (!node) return 0
  return Math.ceil(node.getBoundingClientRect().width) + ROTATING_WORD_WIDTH_BUFFER
}

function RotatingWordMeasure({ word }: { word: string }) {
  return (
    <span className="inline-flex whitespace-nowrap">
      {Array.from(word).map((character, index) => (
        <span key={`${character}-${index}`} className="inline-block">
          {character}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const wordMeasureRefs = useRef<Array<HTMLSpanElement | null>>([])
  const reducedMotion = useReducedMotion()
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [wordWidths, setWordWidths] = useState<number[]>([])
  const activeWord = hero.title.rotatingWords[activeWordIndex]

  useHeroGsap({ contentRef })

  useEffect(() => {
    if (reducedMotion || hero.title.rotatingWords.length < 2) {
      return
    }
    const interval = window.setInterval(() => {
      setActiveWordIndex((current) => (current + 1) % hero.title.rotatingWords.length)
    }, 2400)
    return () => window.clearInterval(interval)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) {
      return
    }

    const measureWidths = () => {
      const nextWidths = hero.title.rotatingWords.map((_, index) =>
        measureRotatingWordWidth(wordMeasureRefs.current[index])
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
    <div className="py-20 md:py-24 lg:py-32">
      <SectionShell className="relative">
        <div ref={contentRef} className="mx-auto max-w-4xl text-center">
          <h1
            data-hero="title"
            className="hero-display-title mx-auto mb-4 max-w-4xl leading-[1.15] font-bold text-balance text-on-dark"
          >
            <span className="block">
              <span>{hero.title.prefix} </span>
              <m.span
                className="relative inline-grid h-[1.18em] overflow-hidden align-baseline whitespace-nowrap text-primary [grid-template-areas:'word']"
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
                    <m.span key={activeWord} className="inline-flex whitespace-nowrap [grid-area:word]">
                      {Array.from(activeWord).map((character, index) => (
                        <m.span
                          key={`${character}-${index}`}
                          className="inline-block"
                          initial={{ y: "-105%", opacity: 0, scale: 0.97 }}
                          animate={{ y: "0%", opacity: 1, scale: 1 }}
                          exit={{ y: "-105%", opacity: 0, scale: 0.97 }}
                          transition={{
                            type: "spring",
                            stiffness: 290,
                            damping: 24,
                            mass: 0.62,
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
                      <RotatingWordMeasure word={word} />
                    </span>
                  ))}
                </span>
              </m.span>
              {hero.title.bridgeWord ? (
                <>
                  {" "}
                  <span>{hero.title.bridgeWord}</span>
                </>
              ) : null}
            </span>
            {hero.title.secondLine ? <span className="block">{hero.title.secondLine}</span> : null}
          </h1>

          <p
            data-hero="subtitle"
            className="prose-width mx-auto mb-8 text-base leading-relaxed text-pretty text-muted-on-dark sm:text-lg md:text-xl"
          >
            {hero.subtitle}
          </p>

          <div
            data-hero="ctas"
            className="mb-0 flex flex-col justify-center gap-4 md:mb-10 sm:flex-row"
          >
            <MarketingButton asChild size="lg" className="px-8 text-base">
              <Link href="/contacto">
                {hero.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
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

          <div
            data-hero="trust"
            className="mx-auto hidden max-w-3xl grid-cols-3 gap-6 md:grid"
          >
            {hero.trust.map((item, index) => {
              const Icon = trustIcons[index]
              return (
                <div
                  key={item.title}
                  data-hero="trust-item"
                  className="flex items-start justify-center gap-3 text-left"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-bold text-on-dark">{item.title}</p>
                    <p className="text-sm text-muted-on-dark">{item.subtitle}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
