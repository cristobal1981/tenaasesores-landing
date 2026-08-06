"use client"

import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"

registerScrollTrigger()

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hash) return
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const refreshScrollTrigger = () => ScrollTrigger.refresh()
    refreshScrollTrigger()
    window.addEventListener("resize", refreshScrollTrigger)

    return () => {
      window.removeEventListener("resize", refreshScrollTrigger)
    }
  }, [])

  return children
}
