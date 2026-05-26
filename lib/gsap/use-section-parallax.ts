"use client"

import { useRef, type RefObject } from "react"
import {
  useBackgroundParallax,
  type ParallaxScrollRange,
} from "@/lib/gsap/use-background-parallax"

interface UseSectionParallaxOptions {
  range?: ParallaxScrollRange
}

/** Call from the same component that attaches `sectionRef` to `<section>`. */
export function useSectionParallax(
  sectionRef: RefObject<HTMLElement | null>,
  options: UseSectionParallaxOptions = {}
) {
  const parallaxRef = useRef<HTMLDivElement>(null)
  useBackgroundParallax({ sectionRef, parallaxRef, range: options.range })
  return parallaxRef
}
