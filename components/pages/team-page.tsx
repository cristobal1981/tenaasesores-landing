"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
import { AboutHero } from "@/components/pages/about-hero"
import { CtaBrisaBand } from "@/components/landing/cta-brisa-band"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { TeamCardGeometries } from "@/components/pages/team-card-geometries"
import { MarketingButton } from "@/components/ui/marketing-button"
import { team } from "@/content/site"
import { LinkedInIcon } from "@/components/icons/linkedin-icon"
import { cn } from "@/lib/utils"

export function TeamPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />

      <section id="equipo" className="border-t border-agua/30 bg-background py-16 md:py-24">
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
                        priority={index < 3}
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

      <section className="border-t border-agua/30 bg-background py-16 md:py-24">
        <SectionShell>
          <FadeIn className="flex flex-col items-start gap-6 rounded-3xl border border-agua/35 bg-gradient-to-br from-card/95 via-card to-agua/15 p-8 sm:flex-row sm:items-center sm:justify-between md:p-10">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Zona de cobertura
              </p>
              <h2 className="mt-2 text-xl font-semibold text-on-dark sm:text-2xl">
                Nuestra ubicación tiene su propia página
              </h2>
              <p className="mt-2 max-w-[48ch] text-base leading-relaxed text-muted-on-dark">
                Dirección, teléfono, horario y las zonas de Tenerife donde trabajamos: todo vive
                en la página de asesoría en Tenerife.
              </p>
            </div>
            <MarketingButton
              asChild
              size="lg"
              variant="outline"
              marketingVariant="secondary"
              className="shrink-0"
            >
              <Link href="/asesoria-contable-tenerife">
                Ver asesoría en Tenerife
                <ArrowRight className="h-4 w-4" />
              </Link>
            </MarketingButton>
          </FadeIn>
        </SectionShell>
      </section>

      <CtaBrisaBand
        eyebrow={team.cta.eyebrow}
        title={team.cta.title}
        label={team.cta.label}
      />
    </main>
  )
}
