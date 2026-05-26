"use client"

import Link from "next/link"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Eye, Zap } from "lucide-react"
import { FloatingElement } from "@/components/animations"
import { useHeroGsap } from "@/components/gsap/use-hero-gsap"
import { SectionParallaxBackground } from "@/components/landing/section-parallax-background"
import { SectionShell } from "@/components/layout/section-shell"
import { hero, images } from "@/content/site"
import { useSectionParallax } from "@/lib/gsap/use-section-parallax"

const trustIcons = [Eye, Award, Zap]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useSectionParallax(sectionRef, { range: "hero" })

  useHeroGsap({ contentRef })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-hero-gradient pt-32 pb-20 md:pt-40 md:pb-32"
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

      <SectionShell innerClassName="relative z-10">
        <div ref={contentRef} className="mx-auto max-w-4xl text-center">
          <h1
            data-hero="title"
            className="mx-auto mb-6 max-w-4xl text-4xl leading-[1.15] font-bold text-balance text-on-dark md:text-5xl lg:text-6xl"
          >
            {hero.title.before}{" "}
            <span className="text-primary">{hero.title.highlight1}</span>
            {hero.title.middle}{" "}
            <span className="text-primary">{hero.title.highlight2}</span>
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
              className="px-8 text-base font-semibold transition-transform hover:scale-105"
            >
              <Link href="/#contacto">
                {hero.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-on-dark/30 px-8 text-base font-semibold text-on-dark transition-transform hover:scale-105 hover:bg-on-dark/10"
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
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
