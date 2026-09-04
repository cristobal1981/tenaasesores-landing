"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { CircleHelp } from "lucide-react"
import { cn } from "@/lib/utils"

type FieldHelpTooltipProps = {
  label: string
  title?: string
  children: ReactNode
  className?: string
}

/** Icono de ayuda contextual: hover en escritorio, toque para alternar en móvil. */
export function FieldHelpTooltip({ label, title, children, className }: FieldHelpTooltipProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <span ref={containerRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(event) => {
          event.stopPropagation()
          // En dispositivos con hover (ratón), el hover ya controla la apertura;
          // el clic solo alterna en pantallas táctiles, donde no hay hover previo.
          const hasHover = window.matchMedia("(hover: hover)").matches
          setOpen((prev) => (hasHover ? true : !prev))
        }}
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-on-dark transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
      >
        <CircleHelp className="size-3.5" aria-hidden />
      </button>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-agua/30 bg-surface-dark px-3 py-2 text-xs leading-relaxed text-on-dark shadow-lg"
        >
          {title ? <span className="mb-1 block font-semibold text-on-dark">{title}</span> : null}
          {children}
        </span>
      ) : null}
    </span>
  )
}
