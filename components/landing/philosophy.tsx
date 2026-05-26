"use client"

import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { philosophy } from "@/content/site"

export function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-surface-light py-20 md:py-28">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23041d23' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <SectionShell>
        <FadeIn className="mx-auto mb-16 max-w-3xl text-center">
          <div className="badge-on-light mb-6">
            <span className="badge-label-on-light">{philosophy.badge}</span>
          </div>
          <h2 className="mb-6 text-3xl leading-[1.2] font-bold text-on-light sm:text-4xl lg:text-5xl">
            {philosophy.title[0]}
            <br />
            <span className="text-on-light-muted">{philosophy.title[1]}</span>
          </h2>
          <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-light">
            {philosophy.subtitle}{" "}
            <span className="font-bold text-accent-on-light">{philosophy.acronym}</span>
            :
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          staggerDelay={0.08}
        >
          {philosophy.values.map((value, index) => (
            <StaggerItem key={value.letter}>
              <div className="group h-full rounded-2xl border border-agua/30 bg-gradient-to-br from-surface-dark to-agua/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-surface-dark/20">
                <ScaleIn delay={index * 0.05}>
                  <div className="mb-4 text-5xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">
                    {value.letter}
                  </div>
                </ScaleIn>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-on-dark uppercase">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-on-dark">
                  {value.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SectionShell>
    </section>
  )
}
