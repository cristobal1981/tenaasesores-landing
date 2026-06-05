"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
  ScaleIn,
} from "@/components/animations"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { SectionParallaxBackground } from "@/components/landing/section-parallax-background"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { TeamCardGeometries } from "@/components/pages/team-card-geometries"
import { about, images, team } from "@/content/site"
import { useSectionParallax } from "@/lib/gsap/use-section-parallax"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { cn } from "@/lib/utils"

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
                      <StaggerItem key={stat.label} className="h-full">
                        <ScaleIn delay={i * 0.1}>
                          <div className="flex h-full flex-col rounded-xl border border-agua/30 bg-surface-dark/30 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-primary/40">
                            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
                              {stat.value}
                            </div>
                            <div className="flex min-h-[2.75rem] flex-1 items-center justify-center px-1 text-center text-xs leading-snug text-muted-on-dark sm:text-sm">
                              {stat.label}
                            </div>
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
          <MarketingSectionHeading
            badge={team.badge}
            title={team.title}
            subtitle={team.subtitle}
            className="mb-14 max-w-2xl"
            subtitleProse={false}
          />

          <StaggerContainer
            className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
            staggerDelay={0.06}
          >
            {team.members.map((member, index) => (
              <StaggerItem
                key={member.name}
                className={cn(
                  team.members.length % 2 === 1 &&
                    index === team.members.length - 1 &&
                    "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[42rem] xl:col-span-1 xl:mx-0 xl:max-w-none",
                  team.members.length % 3 === 1 &&
                    index === team.members.length - 1 &&
                    "xl:col-start-2"
                )}
              >
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-agua/35 bg-gradient-to-br from-card/95 via-card to-agua/15 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-xl hover:shadow-primary/10"
                  )}
                >
                  <TeamCardGeometries index={index} />

                  <div className="relative z-10 mb-5 grid grid-cols-[auto_1fr] items-center gap-4">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-primary/35 bg-agua/20 shadow-[0_0_0_10px_rgba(47,164,184,0.08)]">
                      <Image
                        src={member.photo}
                        alt={`Foto de ${member.name}`}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="128px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl leading-tight font-semibold text-on-dark">{member.name}</h3>
                      <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                      <button
                        type="button"
                        className="mt-3 inline-flex text-primary transition-colors hover:text-primary/80 focus-visible:outline-none"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <LinkedInIcon className="h-[22px] w-[22px]" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 mb-4 h-px w-full bg-gradient-to-r from-primary/30 via-agua/25 to-transparent" />
                  <p className="relative z-10 text-[15px] leading-relaxed text-muted-on-dark">{member.bio}</p>
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
