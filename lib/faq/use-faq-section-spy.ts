"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const SCROLL_SPY_OFFSET_PX = 120

type UseFaqSectionSpyOptions = {
  sectionIds: readonly string[]
}

export function useFaqSectionSpy({ sectionIds }: UseFaqSectionSpyOptions) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "")
  const initialHashHandled = useRef(false)

  const updateActiveSection = useCallback(() => {
    if (sectionIds.length === 0) return

    let currentId = sectionIds[0]

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (!element) continue

      const { top } = element.getBoundingClientRect()
      if (top <= SCROLL_SPY_OFFSET_PX) {
        currentId = id
      }
    }

    setActiveId((previous) => (previous === currentId ? previous : currentId))
  }, [sectionIds])

  useEffect(() => {
    setActiveId(sectionIds[0] ?? "")
    updateActiveSection()
  }, [sectionIds, updateActiveSection])

  useEffect(() => {
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [updateActiveSection])

  useEffect(() => {
    if (initialHashHandled.current) return

    const hash = window.location.hash.replace("#", "")
    if (!hash || !sectionIds.includes(hash)) return

    initialHashHandled.current = true

    const raf = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash)
      if (!target) return

      const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView({
        behavior: motionReduced ? "auto" : "smooth",
        block: "start",
      })
      setActiveId(hash)
    })

    return () => window.cancelAnimationFrame(raf)
  }, [sectionIds])

  const scrollToSection = useCallback((slug: string) => {
    const target = document.getElementById(slug)
    if (!target) return

    setActiveId(slug)
    window.history.replaceState(null, "", `#${slug}`)

    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({
      behavior: motionReduced ? "auto" : "smooth",
      block: "start",
    })
  }, [])

  return { activeId, scrollToSection }
}
