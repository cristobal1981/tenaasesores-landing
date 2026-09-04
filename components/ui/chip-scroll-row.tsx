"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChipScrollRowProps {
  children: ReactNode
  className?: string
  /** Tailwind `from-*` class matching the surrounding background, so the edge fade blends in. */
  edgeFrom?: string
  /** Tailwind text color for the chevron hint icons. */
  chevronClassName?: string
}

export function ChipScrollRow({
  children,
  className,
  edgeFrom = "from-card",
  chevronClassName = "text-muted-on-dark",
}: ChipScrollRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState({ left: false, right: false })

  const updateOverflow = useCallback(() => {
    const el = rowRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setOverflow({
      left: scrollLeft > 4,
      right: scrollLeft + clientWidth < scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    updateOverflow()
    el.addEventListener("scroll", updateOverflow, { passive: true })
    window.addEventListener("resize", updateOverflow)
    return () => {
      el.removeEventListener("scroll", updateOverflow)
      window.removeEventListener("resize", updateOverflow)
    }
  }, [updateOverflow, children])

  const maskImage = `linear-gradient(to right, ${
    overflow.left ? "transparent, black 1.5rem" : "black 0%"
  }, ${overflow.right ? "black calc(100% - 1.5rem), transparent" : "black 100%"})`

  return (
    <div className="relative">
      <div
        ref={rowRef}
        className={cn("chip-scroll flex overflow-x-auto", className)}
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        {children}
      </div>
      {overflow.left ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-start bg-gradient-to-r to-transparent pl-1.5",
            edgeFrom,
            chevronClassName,
          )}
        >
          <ChevronLeft className="size-3.5 animate-pulse" />
        </span>
      ) : null}
      {overflow.right ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-end bg-gradient-to-l to-transparent pr-1.5",
            edgeFrom,
            chevronClassName,
          )}
        >
          <ChevronRight className="size-3.5 animate-pulse" />
        </span>
      ) : null}
    </div>
  )
}
