"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"
import { formatStatValue } from "@/lib/gsap/format-stat-value"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

registerScrollTrigger()

interface UseHomeStatsGsapOptions {
  sectionRef: RefObject<HTMLElement | null>
}

function setFinalValues(section: HTMLElement) {
  const valueEls = gsap.utils.toArray<HTMLElement>("[data-stat-counter]", section)
  for (const el of valueEls) {
    const end = Number(el.dataset.statEnd ?? 0)
    const prefix = el.dataset.statPrefix ?? ""
    const suffix = el.dataset.statSuffix ?? ""
    el.textContent = formatStatValue(end, prefix, suffix)
    if (el.dataset.statColorTo) {
      el.style.color = el.dataset.statColorTo
    }
  }
}

function isStatsSectionVisible(section: HTMLElement) {
  const rect = section.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.95 && rect.bottom > 0
}

function playStatsIfVisible(section: HTMLElement, tl: gsap.core.Timeline) {
  ScrollTrigger.refresh()
  if (tl.progress() > 0 || tl.isActive()) return
  if (isStatsSectionVisible(section)) {
    tl.play()
  }
}

export function useHomeStatsGsap({ sectionRef }: UseHomeStatsGsapOptions) {
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      if (reducedMotion) {
        setFinalValues(section)
        return
      }

      const valueEls = gsap.utils.toArray<HTMLElement>("[data-stat-counter]", section)
      if (valueEls.length === 0) return

      const tl = gsap.timeline({ paused: true })

      valueEls.forEach((el, index) => {
        const end = Number(el.dataset.statEnd ?? 0)
        const prefix = el.dataset.statPrefix ?? ""
        const suffix = el.dataset.statSuffix ?? ""
        const colorFrom = el.dataset.statColorFrom
        const colorTo = el.dataset.statColorTo
        const counter = { value: 0 }

        tl.to(
          counter,
          {
            value: end,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatStatValue(counter.value, prefix, suffix)
            },
          },
          index * 0.12,
        )

        if (colorFrom && colorTo) {
          tl.fromTo(
            el,
            { color: colorFrom },
            { color: colorTo, duration: 1.8, ease: "power2.out" },
            index * 0.12,
          )
        }
      })

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 95%",
        once: true,
        animation: tl,
        toggleActions: "play none none none",
      })

      const runIfVisible = () => playStatsIfVisible(section, tl)

      runIfVisible()
      requestAnimationFrame(runIfVisible)
      void document.fonts?.ready.then(runIfVisible)
      const afterLayout = window.setTimeout(runIfVisible, 400)
      window.addEventListener("load", runIfVisible, { once: true })
      window.addEventListener("resize", runIfVisible)

      return () => {
        window.clearTimeout(afterLayout)
        window.removeEventListener("load", runIfVisible)
        window.removeEventListener("resize", runIfVisible)
        trigger.kill()
        tl.kill()
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )
}
