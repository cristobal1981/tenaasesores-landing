"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"

registerScrollTrigger()

interface UsePinnedScrollStepsOptions {
  sectionRef: RefObject<HTMLElement | null>
  stepsCount: number
  onStepChange: (index: number) => void
  distancePerStep?: number
}

// Pin + scrub solo en desktop y sin prefers-reduced-motion: en mobile o con
// reduced-motion no se crea ScrollTrigger alguno, el componente cae de vuelta
// a la versión apilada con reveal normal (useHomeSectionReveal).
export function usePinnedScrollSteps({
  sectionRef,
  stepsCount,
  onStepChange,
  distancePerStep = 900,
}: UsePinnedScrollStepsOptions) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current
        if (!section || stepsCount <= 1) return

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${(stepsCount - 1) * distancePerStep}`,
          pin: true,
          scrub: 0.4,
          onUpdate: (self) => {
            const index = Math.min(stepsCount - 1, Math.floor(self.progress * stepsCount))
            onStepChange(index)
          },
        })

        return () => trigger.kill()
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [stepsCount, distancePerStep], revertOnUpdate: true },
  )
}
