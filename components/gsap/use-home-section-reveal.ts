"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { RefObject } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

registerScrollTrigger()

interface UseHomeSectionRevealOptions {
  sectionRef: RefObject<HTMLElement | null>
  selector?: string
  stagger?: number
}

export function useHomeSectionReveal({
  sectionRef,
  selector = "[data-home-reveal]",
  stagger = 0.1,
}: UseHomeSectionRevealOptions) {
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const items = gsap.utils.toArray<HTMLElement>(selector, section)
      if (items.length === 0) return

      if (reducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      gsap.set(items, { opacity: 0, y: 48 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      })

      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger,
        ease: "power3.out",
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion, selector, stagger], revertOnUpdate: true },
  )
}
