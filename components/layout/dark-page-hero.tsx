import type { ReactNode } from "react"
import { FadeIn } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { cn } from "@/lib/utils"

const darkHeroGradients = {
  default:
    "radial-gradient(circle_at_12%_16%,rgba(1,222,162,0.14),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(1,99,92,0.16),transparent_40%),linear-gradient(to_bottom,rgba(6,42,51,0.72),rgba(4,29,35,0.94))",
  strong:
    "radial-gradient(circle_at_12%_16%,rgba(1,222,162,0.17),transparent_36%),radial-gradient(circle_at_85%_14%,rgba(1,99,92,0.18),transparent_40%),linear-gradient(to_bottom,rgba(6,42,51,0.72),rgba(4,29,35,0.94))",
} as const

type DarkPageHeroProps = {
  eyebrow?: string
  badge?: string
  title: string | readonly [string, string]
  titleLine2Tone?: "primary" | "muted"
  lead?: ReactNode
  align?: "center" | "left"
  padding?: "default" | "spacious"
  gradient?: keyof typeof darkHeroGradients
  className?: string
}

export function DarkPageHero({
  eyebrow,
  badge,
  title,
  titleLine2Tone = "muted",
  lead,
  align = "left",
  padding = "default",
  gradient = "default",
  className,
}: DarkPageHeroProps) {
  const [lineA, lineB] = Array.isArray(title) ? title : [title, null]
  const isCenter = align === "center"

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-agua/30",
        padding === "spacious" ? "py-20 md:py-28" : "py-16 md:py-20",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: darkHeroGradients[gradient] }}
      />
      <SectionShell>
        <FadeIn className={cn("relative mx-auto max-w-3xl", isCenter && "text-center")}>
          {badge ? (
            <div className="badge-on-dark mb-6">
              <span className="badge-label-on-dark">{badge}</span>
            </div>
          ) : eyebrow ? (
            <p className="mb-3 text-sm font-medium tracking-wide text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "font-bold text-balance text-on-dark",
              isCenter
                ? "mb-6 text-3xl leading-[1.15] sm:text-4xl lg:text-5xl"
                : "mb-4 text-3xl leading-[1.15] sm:text-4xl"
            )}
          >
            {lineA}
            {lineB ? (
              <>
                <br />
                <span className={titleLine2Tone === "primary" ? "text-primary" : "text-muted-on-dark"}>
                  {lineB}
                </span>
              </>
            ) : null}
          </h1>
          {lead ? (
            <p
              className={cn(
                "text-lg leading-relaxed text-muted-on-dark",
                isCenter && "prose-width mx-auto"
              )}
            >
              {lead}
            </p>
          ) : null}
        </FadeIn>
      </SectionShell>
    </section>
  )
}
