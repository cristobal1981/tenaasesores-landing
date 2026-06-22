"use client"

import { FloatingElement } from "@/components/animations"
import { Hero } from "@/components/landing/hero"
import { HeroAmbient } from "@/components/landing/hero-ambient"
import { HomeStats } from "@/components/landing/home-stats"
import { LogoMarquee } from "@/components/landing/logo-marquee"

export function HomeHeroBand() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-[1]">
        <div className="relative overflow-hidden bg-home-hero-surface">
          <HeroAmbient />
          <FloatingElement
            className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
            duration={10}
          />
          <FloatingElement
            className="absolute bottom-0 left-[-8%] h-72 w-72 rounded-full bg-agua/20 blur-[90px]"
            duration={14}
            delay={0.5}
          />
          <Hero />
          <HomeStats />
        </div>

        <LogoMarquee variant="embedded" />
      </div>
    </section>
  )
}
