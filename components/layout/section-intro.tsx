import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionIntroProps = {
  eyebrow?: string
  title?: string | readonly [string, string]
  subtitle?: ReactNode
  align?: "center" | "left"
  tone?: "dark" | "light"
  titleLine2Tone?: "muted" | "primary"
  as?: "h1" | "h2"
  size?: "section" | "page" | "compact" | "large" | "support"
  className?: string
  subtitleClassName?: string
  reveal?: boolean
  children?: ReactNode
}

export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  titleLine2Tone = "muted",
  as: Heading = "h2",
  size = "section",
  className,
  subtitleClassName,
  reveal = false,
  children,
}: SectionIntroProps) {
  const [lineA, lineB] = title
    ? Array.isArray(title)
      ? title
      : [title, null]
    : [null, null]
  const hasTitle = Boolean(lineA) || Boolean(lineB)
  const isDark = tone === "dark"
  const isCenter = align === "center"
  const revealAttr = reveal ? { "data-home-reveal": true } : {}

  const titleSizeClass =
    size === "large"
      ? "text-[clamp(2rem,5vw,4rem)] leading-[1.05]"
      : size === "support"
        ? "text-[clamp(1.35rem,2.4vw,1.75rem)] leading-[1.2]"
        : size === "compact"
          ? "text-2xl leading-[1.12] sm:text-3xl lg:text-4xl"
          : size === "page"
            ? "text-3xl leading-[1.15] sm:text-4xl lg:text-5xl"
            : "text-[clamp(2rem,5vw,3.75rem)] leading-[1.06]"

  const titleMarginClass = subtitle || children ? "mb-4 md:mb-5" : "mb-0"

  const subtitleSizeClass =
    size === "support"
      ? "text-sm sm:text-base"
      : size === "compact"
        ? "text-sm sm:text-base"
        : "text-base sm:text-lg"

  const line2Class = cn(
    titleLine2Tone === "primary"
      ? "text-primary"
      : isDark
        ? "text-muted-on-dark"
        : "text-on-light-muted",
  )

  return (
    <div
      className={cn(
        isCenter ? "mx-auto text-center" : "text-left",
        size === "compact" ? "max-w-2xl" : size === "page" ? "max-w-3xl" : "max-w-4xl",
        className,
      )}
    >
      {eyebrow ? (
        <p
          {...revealAttr}
          className={cn(
            "section-eyebrow mb-3",
            isDark ? "section-eyebrow-on-dark text-primary" : "section-eyebrow-on-light",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      {hasTitle ? (
        <Heading
          {...revealAttr}
          className={cn(
            "section-title",
            titleSizeClass,
            titleMarginClass,
            isDark ? "text-on-dark" : "text-on-light",
          )}
        >
          {lineA}
          {lineB ? (
            <>
              <br />
              <span className={line2Class}>{lineB}</span>
            </>
          ) : null}
        </Heading>
      ) : null}
      {subtitle ? (
        <p
          {...revealAttr}
          className={cn(
            "section-subtitle",
            subtitleSizeClass,
            isCenter ? "prose-width mx-auto max-w-[58ch]" : "max-w-[58ch]",
            isDark ? "text-muted-on-dark" : "text-muted-on-light",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  )
}
