"use client"

import { Minus, Plus } from "lucide-react"
import { useCallback, useId, useState } from "react"
import { StaggerContainer, StaggerItem } from "@/components/animations"
import type { FaqItem } from "@/content/faq"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light"

type FaqAccordionListProps = {
  items: readonly FaqItem[]
  sectionLabel: string
  defaultOpenIndex?: number
  className?: string
}

export function FaqAccordionList({
  items,
  sectionLabel,
  defaultOpenIndex = -1,
  className,
}: FaqAccordionListProps) {
  const baseId = useId()
  const [openIndices, setOpenIndices] = useState<Set<number>>(() =>
    defaultOpenIndex >= 0 && defaultOpenIndex < items.length
      ? new Set([defaultOpenIndex])
      : new Set()
  )

  const toggle = useCallback((index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  return (
    <div role="group" aria-label={`Preguntas de ${sectionLabel}`} className={className}>
      <StaggerContainer className="space-y-3" staggerDelay={0.07}>
        {items.map((item, index) => {
          const isOpen = openIndices.has(index)
          const buttonId = `${baseId}-btn-${index}`
          const panelId = `${baseId}-panel-${index}`

          return (
            <StaggerItem key={item.question}>
              <article
                className={cn(
                  "overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
                  isOpen ? "border-primary/30 shadow-sm shadow-agua/8" : "border-on-light/15"
                )}
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-200 md:px-5",
                      focusRing,
                      isOpen ? "bg-primary/5" : "hover:bg-on-light/5"
                    )}
                  >
                    <span className="text-base font-semibold text-on-light">{item.question}</span>
                    <span className="sr-only">{isOpen ? "Ocultar respuesta" : "Mostrar respuesta"}</span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-300 motion-reduce:transition-none",
                        isOpen ? "rotate-180 bg-primary/12" : "bg-on-light/6"
                      )}
                      aria-hidden
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4 text-accent-on-light" />
                      ) : (
                        <Plus className="h-4 w-4 text-accent-on-light" />
                      )}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        "border-t border-on-light/10 px-4 py-4 text-base leading-relaxed text-muted-on-light md:px-5",
                        "transition-transform duration-300 ease-out motion-reduce:transition-none",
                        isOpen ? "translate-y-0" : "-translate-y-1"
                      )}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </div>
  )
}
