"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLayoutEffect } from "react"
import type { RefObject } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

registerScrollTrigger()

const FADE_IN_PORTION = 0.12
const FADE_OUT_PORTION = 0.1

/** Puntos de una S al bajar: arriba-izq → arriba-der → medio-izq → medio-der → abajo-der */
const S_PATH = [
  { left: "10%", top: "18%", scale: 0.8 },
  { left: "74%", top: "30%", scale: 1.06 },
  { left: "11%", top: "48%", scale: 0.9 },
  { left: "65%", top: "58%", scale: 1.1 },
  { left: "76%", top: "72%", scale: 1.2 },
] as const

/** Duración relativa por tramo (más alto = más scroll en ese tramo = más lento) */
const SEGMENT_DURATION = [0.2, 0.34, 0.18, 0.28] as const
const SEGMENT_EASE = ["power2.in", "power1.inOut", "power2.in", "power1.out"] as const

function refreshScrollTrigger() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

function opacityForProgress(progress: number) {
  if (progress < FADE_IN_PORTION) return progress / FADE_IN_PORTION
  if (progress > 1 - FADE_OUT_PORTION) return (1 - progress) / FADE_OUT_PORTION
  return 1
}

interface UseServicesScrollBlobOptions {
  zoneRef: RefObject<HTMLElement | null>
  blobRef: RefObject<HTMLElement | null>
}

export function useServicesScrollBlob({ zoneRef, blobRef }: UseServicesScrollBlobOptions) {
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const zone = zoneRef.current
    const blob = blobRef.current
    if (!zone || !blob) return

    gsap.set(blob, {
      position: "fixed",
      xPercent: -50,
      yPercent: -50,
      left: S_PATH[0].left,
      top: S_PATH[0].top,
      scale: S_PATH[0].scale,
      opacity: 0,
      visibility: "hidden",
      force3D: true,
    })

    const applyOpacity = (progress: number, isActive: boolean) => {
      if (!isActive) {
        gsap.set(blob, { opacity: 0, visibility: "hidden" })
        return
      }
      const opacity = opacityForProgress(progress)
      gsap.set(blob, {
        opacity,
        visibility: opacity > 0.02 ? "visible" : "hidden",
      })
    }

    const scrollConfig = {
      trigger: zone,
      start: "top 85%",
      end: "bottom top",
      scrub: 1.5,
      invalidateOnRefresh: true,
      onUpdate: (self: ScrollTrigger) => applyOpacity(self.progress, self.isActive),
      onToggle: (self: ScrollTrigger) => {
        if (!self.isActive) {
          gsap.set(blob, { opacity: 0, visibility: "hidden" })
        }
      },
    }

    if (reducedMotion) {
      const st = ScrollTrigger.create({
        ...scrollConfig,
        onEnter: () => gsap.set(blob, { visibility: "visible", opacity: 0.35 }),
        onLeave: () => gsap.set(blob, { visibility: "hidden", opacity: 0 }),
        onEnterBack: () => gsap.set(blob, { visibility: "visible", opacity: 0.35 }),
        onLeaveBack: () => gsap.set(blob, { visibility: "hidden", opacity: 0 }),
      })
      gsap.set(blob, { left: "50%", top: "45%", scale: 1 })

      return () => {
        st.kill()
      }
    }

    const tl = gsap.timeline({
      defaults: { force3D: true },
      scrollTrigger: scrollConfig,
    })

    for (let i = 0; i < SEGMENT_DURATION.length; i++) {
      const target = S_PATH[i + 1]
      tl.to(blob, {
        left: target.left,
        top: target.top,
        scale: target.scale,
        ease: SEGMENT_EASE[i],
        duration: SEGMENT_DURATION[i],
      })
    }

    const onResize = () => refreshScrollTrigger()
    refreshScrollTrigger()
    const refreshAfterMount = window.setTimeout(refreshScrollTrigger, 400)
    window.addEventListener("load", refreshScrollTrigger)
    window.addEventListener("resize", onResize)

    return () => {
      window.clearTimeout(refreshAfterMount)
      window.removeEventListener("load", refreshScrollTrigger)
      window.removeEventListener("resize", onResize)
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reducedMotion, zoneRef, blobRef])
}
