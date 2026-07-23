"use client"

import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, type ReactNode } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"
import { setLenisInstance } from "@/lib/scroll/lenis-instance"

registerScrollTrigger()

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setLenisInstance(null)
      return
    }

    const lenis = new Lenis({ autoRaf: false })
    setLenisInstance(lenis)

    lenis.on("scroll", ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const refreshScrollTrigger = () => ScrollTrigger.refresh()
    refreshScrollTrigger()
    window.addEventListener("resize", refreshScrollTrigger)

    return () => {
      window.removeEventListener("resize", refreshScrollTrigger)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [reducedMotion])

  return children
}
