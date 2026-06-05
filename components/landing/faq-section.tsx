"use client"

import { ChevronDown } from "lucide-react"
import { useId, useState } from "react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"
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
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)
  const hasHeader = typeof title !== "undefined" || Boolean(subtitle) || Boolean(badge)
  const [lineA, lineB] = Array.isArray(title) ? title : [title ?? "", null]
  const headingClassName = embedded
    ? "font-semibold text-on-light text-xl sm:text-2xl"
    : cn("font-bold text-on-dark", compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl")
  const wrapperClassName = embedded
    ? cn("mx-auto text-left", compact ? "mb-6 max-w-none" : "mb-10 max-w-none")
    : cn("mx-auto text-center", compact ? "mb-8 max-w-3xl" : "mb-14 max-w-2xl")

  const content = (
    <>
      {hasHeader ? (
        embedded ? (
          <FadeIn className={wrapperClassName}>
            {badge ? (
              <div className="badge-on-dark mb-6">
                <span className="badge-label-on-dark">{badge}</span>
              </div>
            ) : null}
            {title ? (
              <h2 className={headingClassName}>
                {lineA}
                {lineB ? (
                  <>
                    <br />
                    <span className="text-on-light-muted">{lineB}</span>
                  </>
                ) : null}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-4 max-w-none text-base leading-relaxed text-muted-on-light">
                {subtitle}
              </p>
            ) : null}
          </FadeIn>
        ) : (
          <MarketingSectionHeading
            badge={badge}
            title={title ?? ""}
            subtitle={subtitle}
            className={compact ? "mb-8 max-w-3xl" : "mb-14 max-w-2xl"}
            size={compact ? "compact" : "section"}
          />
        )
      ) : null}

      <StaggerContainer className="mx-auto max-w-4xl space-y-4" staggerDelay={0.06}>
        {items.map((item, index) => {
          const isOpen = index === openIndex
          const panelId = `${baseId}-faq-panel-${index}`
          const buttonId = `${baseId}-faq-button-${index}`
          const articleClassName = embedded
            ? "overflow-hidden rounded-xl border border-agua/25 bg-white shadow-sm shadow-agua/8"
            : "overflow-hidden rounded-2xl border border-agua/30 bg-gradient-to-br from-card/90 to-agua/15"
          const buttonClassName = embedded
            ? "flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-on-light transition-colors hover:bg-brisa/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:px-5"
            : "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-on-dark transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:px-6 md:py-5"
          const answerClassName = embedded
            ? "border-t border-agua/20 px-4 py-3 text-sm leading-relaxed text-on-light-muted md:px-5"
            : "border-t border-agua/20 px-5 py-4 text-sm leading-relaxed text-muted-on-dark md:px-6 md:text-base"

          return (
            <StaggerItem key={item.question}>
              <article className={articleClassName}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => {
                      if (!isOpen) {
                        setOpenIndex(index)
                      }
                    }}
                    className={buttonClassName}
                  >
                    <span className={cn("font-semibold", embedded ? "text-[15px] md:text-base" : "text-base md:text-lg")}>
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform duration-300",
                        embedded ? "text-accent-on-light" : "text-primary",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className={answerClassName}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </>
  )

  if (embedded) {
    return <div className={className}>{content}</div>
  }

  return (
    <section className={cn("relative overflow-hidden bg-background py-20 md:py-28", className)}>
      <SectionShell>{content}</SectionShell>
    </section>
  )
}
