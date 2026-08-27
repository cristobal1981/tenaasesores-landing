"use client"

import { useRef, useState } from "react"
import { LazyMotion, domAnimation, m } from "framer-motion"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import { usePinnedScrollSteps } from "@/components/gsap/use-pinned-scroll-steps"
import { SectionShell } from "@/components/layout/section-shell"
import { OdooImplementationInterfaceMockup } from "@/components/pages/odoo-implementation-interface-mockup"
import {
  odooImplementationPhases,
  odooImplementationPhasesTitle,
  type OdooPhase,
} from "@/content/odoo-implementation"
import { cn } from "@/lib/utils"

const stepsCount = odooImplementationPhases.length
const totalLabel = String(stepsCount).padStart(2, "0")

export function OdooImplementationPhases() {
  const pinnedSectionRef = useRef<HTMLElement>(null)
  const stackedSectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  usePinnedScrollSteps({
    sectionRef: pinnedSectionRef,
    stepsCount,
    onStepChange: setActiveIndex,
  })

  useHomeSectionReveal({ sectionRef: stackedSectionRef, stagger: 0.08 })

  const activePhase = odooImplementationPhases[activeIndex]

  return (
    <div id="fases" className="scroll-mt-[var(--site-header-height)] bg-surface-dark">
      {/* Desktop, sin reduced-motion: pin + scrub — una fase por pantalla.
          padding-top compensa la cabecera sticky para que el contenido quede
          centrado en el viewport visible, no en toda la sección pineada. */}
      <section
        ref={pinnedSectionRef}
        className="hidden lg:motion-safe:block lg:h-screen"
        style={{ paddingTop: "var(--site-header-height)" }}
        aria-label={odooImplementationPhasesTitle}
      >
        <SectionShell className="h-full" innerClassName="flex h-full items-center py-16">
          <div className="grid w-full items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="section-eyebrow section-eyebrow-on-dark mb-3">
                {odooImplementationPhasesTitle}
              </p>

              <div aria-hidden className="mb-8 flex items-center gap-1.5">
                {odooImplementationPhases.map((phase, index) => (
                  <span
                    key={phase.id}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors duration-300",
                      index === activeIndex ? "bg-primary" : "bg-agua/25",
                    )}
                  />
                ))}
              </div>

              <p className="mb-4 font-sans text-sm font-semibold text-muted-on-dark">
                {activePhase.number} / {totalLabel}
              </p>

              <LazyMotion features={domAnimation} strict>
                <m.div
                  key={activePhase.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <PhaseCopy phase={activePhase} />
                </m.div>
              </LazyMotion>
            </div>

            <OdooImplementationInterfaceMockup phase={activePhase} />
          </div>
        </SectionShell>
      </section>

      {/* Mobile o reduced-motion: fases apiladas con reveal normal, sin pin. */}
      <section
        ref={stackedSectionRef}
        className="block lg:motion-safe:hidden"
        aria-label={odooImplementationPhasesTitle}
      >
        <SectionShell className="py-16 md:py-20">
          <p
            data-home-reveal
            className="section-eyebrow section-eyebrow-on-dark mb-10 text-center"
          >
            {odooImplementationPhasesTitle}
          </p>

          <div className="space-y-14">
            {odooImplementationPhases.map((phase) => (
              <div key={phase.id} data-home-reveal>
                <p className="mb-3 font-sans text-sm font-semibold text-muted-on-dark">
                  {phase.number} / {totalLabel}
                </p>
                <PhaseCopy phase={phase} className="mb-6" />
                <OdooImplementationInterfaceMockup phase={phase} />
              </div>
            ))}
          </div>
        </SectionShell>
      </section>
    </div>
  )
}

function PhaseCopy({ phase, className }: { phase: OdooPhase; className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-2xl font-bold text-on-dark sm:text-3xl">{phase.title}</h3>
      <p className="max-w-[46ch] text-base leading-relaxed text-muted-on-dark">
        {phase.description}
      </p>
    </div>
  )
}
