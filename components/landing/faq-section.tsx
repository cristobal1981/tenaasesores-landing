"use client"

import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { cn } from "@/lib/utils"

type FaqItem = {
  question: string
  answer: string
}

type FaqSectionProps = {
  title?: string | readonly [string, string]
  items: readonly FaqItem[]
  subtitle?: string
  badge?: string
  compact?: boolean
  embedded?: boolean
  className?: string
}

export function FaqSection({
  title,
  items,
  subtitle,
  badge,
  compact = false,
  embedded = false,
  className,
}: FaqSectionProps) {
  const sectionLabel =
    typeof title === "string" ? title : Array.isArray(title) ? title.join(" ") : "Preguntas frecuentes"

  const list = (
    <FaqAccordionList
      items={items}
      sectionLabel={sectionLabel}
      className={className}
    />
  )

  if (embedded) {
    return list
  }

  return (
    <section className={cn("relative overflow-hidden bg-background py-20 md:py-28", className)}>
      <SectionShell>
        <MarketingSectionHeading
          badge={badge}
          title={title ?? ""}
          subtitle={subtitle}
          className={compact ? "mb-8 max-w-3xl" : "mb-14 max-w-2xl"}
          size={compact ? "compact" : "section"}
        />
        {list}
      </SectionShell>
    </section>
  )
}
