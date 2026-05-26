"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect } from "react"
import type { RefObject } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

registerScrollTrigger()

export type ParallaxScrollRange = "hero" | "inView"

const scrollRanges: Record<ParallaxScrollRange, { start: string; end: string }> = {
  hero: { start: "top top", end: "bottom top" },
  inView: { start: "top bottom", end: "bottom top" },
}

interface UseBackgroundParallaxOptions {
  sectionRef: RefObject<HTMLElement | null>
  parallaxRef: RefObject<HTMLElement | null>
  range?: ParallaxScrollRange
}

function refreshScrollTrigger() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

export function useBackgroundParallax({
  sectionRef,
  parallaxRef,
  range = "inView",
}: UseBackgroundParallaxOptions) {
  const reducedMotion = usePrefersReducedMotion()
  const { start, end } = scrollRanges[range]

  useLayoutEffect(() => {
    if (reducedMotion) return

    const section = sectionRef.current
    const parallax = parallaxRef.current
    if (!section || !parallax) return

    const tween = gsap.fromTo(
      parallax,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start,
          end,
            scrub: true,
          invalidateOnRefresh: true,
        },
      }
    )

    const img = parallax.querySelector("img")
    const onImageLoad = () => refreshScrollTrigger()
    if (img && !img.complete) {
      img.addEventListener("load", onImageLoad, { once: true })
    }

    refreshScrollTrigger()
    window.addEventListener("load", refreshScrollTrigger)

    return () => {
      img?.removeEventListener("load", onImageLoad)
      window.removeEventListener("load", refreshScrollTrigger)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reducedMotion, range, start, end, sectionRef, parallaxRef])
}
