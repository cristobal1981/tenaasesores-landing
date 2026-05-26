"use client"

import Image from "next/image"
import type { ReactNode, RefObject } from "react"
import { cn } from "@/lib/utils"

interface SectionParallaxBackgroundProps {
  src: string
  parallaxRef: RefObject<HTMLDivElement | null>
  imageClassName?: string
  priority?: boolean
  sizes?: string
  overlay?: ReactNode
}

export function SectionParallaxBackground({
  src,
  parallaxRef,
  imageClassName,
  priority,
  sizes = "100vw",
  overlay,
}: SectionParallaxBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        ref={parallaxRef}
        className="absolute -top-[15%] left-0 h-[130%] w-full will-change-transform"
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
      {overlay}
    </div>
  )
}
