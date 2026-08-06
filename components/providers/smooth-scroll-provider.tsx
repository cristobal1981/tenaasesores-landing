"use client"

import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"
import { getLenisInstance, setLenisInstance } from "@/lib/scroll/lenis-instance"

registerScrollTrigger()

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hash) return
    getLenisInstance()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

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
