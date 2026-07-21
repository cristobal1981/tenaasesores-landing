"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

registerScrollTrigger()

interface UseHomeHorizontalScrollOptions {
  sectionRef: RefObject<HTMLElement | null>
  trackRef: RefObject<HTMLElement | null>
}

export function useHomeHorizontalScroll({
  sectionRef,
  trackRef,
}: UseHomeHorizontalScrollOptions) {
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const getScrollDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 96)

      if (reducedMotion) {
        gsap.set(track, { x: 0 })
        return
      }

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      mm.add("(max-width: 767px)", () => {
        gsap.set(track, { x: 0, display: "flex", overflowX: "auto" })
        return () => {
          gsap.set(track, { clearProps: "x,display,overflowX" })
        }
      })

      const onResize = () => ScrollTrigger.refresh()
      window.addEventListener("resize", onResize)

      return () => {
        window.removeEventListener("resize", onResize)
        mm.revert()
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )
}
