"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  Button,
  marketingCtaBaseClassName,
  marketingCtaVariantClassName,
} from "@/components/ui/button"
import { ArrowRight, Award, Eye, Zap } from "lucide-react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { FloatingElement } from "@/components/animations"
import { useHeroGsap } from "@/components/gsap/use-hero-gsap"
import { SectionParallaxBackground } from "@/components/landing/section-parallax-background"
import { SectionShell } from "@/components/layout/section-shell"
import { hero, images } from "@/content/site"
import { useSectionParallax } from "@/lib/gsap/use-section-parallax"
import { cn } from "@/lib/utils"

const trustIcons = [Eye, Award, Zap]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const parallaxRef = useSectionParallax(sectionRef, { range: "hero" })
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-hero-gradient pt-28 pb-12 md:min-h-[100dvh] md:pt-32 md:pb-16"
    >
      <SectionParallaxBackground
        src={images.hero}
        parallaxRef={parallaxRef}
        priority
        overlay={
          <div
            className="absolute inset-0 bg-gradient-to-br from-background/88 via-background/78 to-card/92"
            aria-hidden
          />
        }
      />

      <FloatingElement
        className="absolute top-20 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        duration={8}
      />
      <FloatingElement
        className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-agua/40 blur-3xl"
        duration={10}
        delay={2}
      />
      <FloatingElement
        className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-2xl"
        duration={12}
        delay={4}
      />

      <SectionShell innerClassName="relative z-10 flex min-h-[calc(100svh-10rem)] items-center md:min-h-[calc(100dvh-12rem)]">
        <div ref={contentRef} className="mx-auto max-w-4xl text-center">
          <h1
            data-hero="title"
            className="mx-auto mb-6 max-w-4xl text-4xl leading-[1.15] font-bold text-balance text-on-dark md:text-5xl lg:text-6xl"
          >
            <span className="block">
              <span>{hero.title.prefix} </span>
              <span className="relative inline-grid h-[1.18em] overflow-hidden align-baseline text-primary [grid-template-areas:'word']">
                <span className="invisible [grid-area:word]">{activeWord}</span>
                {reducedMotion ? (
                  <span className="[grid-area:word]">{hero.title.rotatingWords[0]}</span>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <m.span key={activeWord} className="inline-flex [grid-area:word]">
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
              </span>
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
            className="prose-width mx-auto mb-10 text-lg leading-relaxed text-pretty text-muted-on-dark md:text-xl"
          >
            {hero.subtitle}
          </p>

          <div
            data-hero="ctas"
            className="mb-16 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className={cn(
                "px-8 text-base",
                marketingCtaBaseClassName,
                marketingCtaVariantClassName.primary
              )}
            >
              <Link href="/contacto">
                {hero.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "px-8 text-base",
                marketingCtaBaseClassName,
                marketingCtaVariantClassName.secondary
              )}
            >
              <Link href="/servicios">{hero.ctaSecondary}</Link>
            </Button>
          </div>

          <div
            data-hero="trust"
            className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3"
          >
            {hero.trust.map((item, index) => {
              const Icon = trustIcons[index]
              return (
                <div
                  key={item.title}
                  data-hero="trust-card"
                  className="flex items-center justify-center gap-3 rounded-xl border border-agua/30 bg-surface-dark/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-on-dark">{item.title}</p>
                    <p className="text-sm text-muted-on-dark">{item.subtitle}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SectionShell>
    </section>
  )
}
