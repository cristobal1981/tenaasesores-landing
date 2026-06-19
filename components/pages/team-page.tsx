"use client"

import Image from "next/image"
import { StaggerContainer, StaggerItem } from "@/components/animations"
import { AboutHero } from "@/components/pages/about-hero"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { TeamCardGeometries } from "@/components/pages/team-card-geometries"
import { team } from "@/content/site"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { cn } from "@/lib/utils"

export function TeamPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />

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
