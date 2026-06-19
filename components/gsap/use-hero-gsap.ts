"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

interface UseHeroGsapOptions {
  contentRef: RefObject<HTMLDivElement | null>
}

export function useHeroGsap({ contentRef }: UseHeroGsapOptions) {
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const content = contentRef.current
      if (!content) return

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: reduce)", () => {})

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (reducedMotion) return

        const title = content.querySelector<HTMLElement>('[data-hero="title"]')
        const subtitle = content.querySelector<HTMLElement>('[data-hero="subtitle"]')
        const ctas = content.querySelector<HTMLElement>('[data-hero="ctas"]')
        const trustItems = gsap.utils.toArray<HTMLElement>(
          '[data-hero="trust-item"]',
          content
        )

        if (!title || !subtitle || !ctas) return

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
        tl.from(title, { opacity: 0, y: 32, duration: 0.55 })
          .from(subtitle, { opacity: 0, y: 24, duration: 0.5 }, "-=0.35")
          .from(ctas, { opacity: 0, y: 20, duration: 0.45 }, "-=0.35")
          .from(
            trustItems,
            { opacity: 0, y: 24, duration: 0.45, stagger: 0.12 },
            "-=0.25"
          )
      })

      return () => mm.revert()
    },
    { scope: contentRef, dependencies: [reducedMotion], revertOnUpdate: true }
  )
}
