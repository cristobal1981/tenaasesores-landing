"use client"

import { useRef } from "react"
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
  ScaleIn,
} from "@/components/animations"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { SectionParallaxBackground } from "@/components/landing/section-parallax-background"
import { SectionShell } from "@/components/layout/section-shell"
import { about, images, team } from "@/content/site"
import { useSectionParallax } from "@/lib/gsap/use-section-parallax"
import { cn } from "@/lib/utils"

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function TeamPage() {
  const storyRef = useRef<HTMLElement>(null)
  const parallaxRef = useSectionParallax(storyRef)

  return (
    <main className="min-h-screen">
      <section
        ref={storyRef}
        className="relative overflow-hidden bg-section-dark py-16 md:py-24"
      >
        <SectionParallaxBackground
          src={images.about}
          parallaxRef={parallaxRef}
          imageClassName="opacity-[0.12]"
        />
        <FloatingElement
          className="absolute top-1/3 right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          duration={9}
        />

        <SectionShell>
          <FadeIn className="mb-12 text-center md:mb-16">
            <div className="badge-on-dark">
              <span className="badge-label-on-dark">{about.badge}</span>
            </div>
          </FadeIn>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeIn direction="left">
              <h1 className="mb-6 text-3xl leading-[1.2] font-bold text-on-dark sm:text-4xl lg:text-5xl">
                {about.title[0]}
                <br />
                <span className="text-primary">{about.title[1]}</span>
              </h1>
              <p className="mb-6 text-lg leading-relaxed text-muted-on-dark">
                {about.paragraphs[0]}
              </p>
              <p className="mb-8 leading-relaxed text-muted-on-dark">{about.paragraphs[1]}</p>

              <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                {about.features.map((feature) => (
                  <StaggerItem key={feature}>
                    <div className="group flex items-center gap-3">
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary transition-transform group-hover:scale-150" />
                      <span className="text-on-dark/90">{feature}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-card to-agua/50 p-8 md:p-12">
                  <StaggerContainer className="grid grid-cols-2 gap-8" staggerDelay={0.1}>
                    {about.stats.map((stat, i) => (
                      <StaggerItem key={stat.label}>
                        <ScaleIn delay={i * 0.1}>
                          <div className="rounded-xl border border-agua/30 bg-surface-dark/30 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-primary/40">
                            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
                              {stat.value}
                            </div>
                            <div className="text-sm text-muted-on-dark">{stat.label}</div>
                          </div>
                        </ScaleIn>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                  <div className="absolute top-4 left-4 h-12 w-12 rounded-tl-lg border-t-2 border-l-2 border-primary/30" />
                  <div className="absolute right-4 bottom-4 h-12 w-12 rounded-br-lg border-r-2 border-b-2 border-primary/30" />
                </div>
              </div>
            </FadeIn>
          </div>
        </SectionShell>
      </section>

      <section className="border-t border-agua/30 bg-background py-16 md:py-24">
        <SectionShell>
          <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
            <div className="badge-on-dark mb-6">
              <span className="badge-label-on-dark">{team.badge}</span>
            </div>
            <h2 className="mb-6 text-3xl leading-[1.2] font-bold text-on-dark sm:text-4xl">
              {team.title[0]}
              <br />
              <span className="text-muted-on-dark">{team.title[1]}</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-on-dark">{team.subtitle}</p>
          </FadeIn>

          <StaggerContainer
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            staggerDelay={0.06}
          >
            {team.members.map((member, index) => (
              <StaggerItem key={member.name}>
                <article
                  className={cn(
                    "flex h-full flex-col rounded-2xl border border-agua/30 bg-gradient-to-br from-card to-agua/20 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                    index === 6 && "sm:col-span-2 lg:col-span-1 xl:col-span-1"
                  )}
                >
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 font-sans text-xl font-bold text-primary"
                    aria-hidden
                  >
                    {memberInitials(member.name)}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-on-dark">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-sm leading-relaxed text-muted-on-dark">{member.bio}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SectionShell>
      </section>

      <CtaBrisaBand
        title={team.cta.title}
        subtitle={team.cta.subtitle}
        label={team.cta.label}
      />
    </main>
  )
}
