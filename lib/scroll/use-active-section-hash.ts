"use client"

import { useEffect, useState } from "react"

const SCROLL_SPY_OFFSET_PX = 120

export function useActiveSectionHash(sectionIds: readonly string[]) {
  const [activeHash, setActiveHash] = useState("")

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveHash("")
      return
    }

    const updateActiveHash = () => {
      let currentHash = ""

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) continue

        if (element.getBoundingClientRect().top <= SCROLL_SPY_OFFSET_PX) {
          currentHash = id
        }
      }

      setActiveHash((previous) => (previous === currentHash ? previous : currentHash))
    }

    const raf = window.requestAnimationFrame(updateActiveHash)
    window.addEventListener("scroll", updateActiveHash, { passive: true })
    window.addEventListener("resize", updateActiveHash, { passive: true })

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("scroll", updateActiveHash)
      window.removeEventListener("resize", updateActiveHash)
    }
  }, [sectionIds])

  return activeHash
}
