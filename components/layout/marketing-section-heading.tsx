import type { ReactNode } from "react"
import { FadeIn } from "@/components/animations"
import { cn } from "@/lib/utils"

type MarketingSectionHeadingProps = {
  badge?: string
  title: string | readonly [string, string]
  subtitle?: string
  align?: "center" | "left"
  tone?: "dark" | "light"
  titleLine2Tone?: "muted" | "primary"
  as?: "h1" | "h2"
  size?: "section" | "page" | "compact"
  className?: string
  subtitleClassName?: string
  subtitleProse?: boolean
  children?: ReactNode
}

export function MarketingSectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  titleLine2Tone = "muted",
  as: Heading = "h2",
  size = "section",
  className,
  subtitleClassName,
  subtitleProse = true,
  children,
}: MarketingSectionHeadingProps) {
  const [lineA, lineB] = Array.isArray(title) ? title : [title, null]
  const hasTitle = Boolean(lineA) || Boolean(lineB)
  const isDark = tone === "dark"
  const isCenter = align === "center"

  const badgeClass = isDark ? "badge-on-dark" : "badge-on-light"
  const badgeLabelClass = isDark ? "badge-label-on-dark" : "badge-label-on-light"

  const titleSizeClass =
    size === "compact"
      ? "text-2xl sm:text-3xl lg:text-4xl"
      : size === "page"
        ? "text-3xl leading-[1.15] sm:text-4xl lg:text-5xl"
        : "text-3xl leading-[1.2] sm:text-4xl lg:text-5xl"

  const titleMarginClass = size === "compact" ? "mb-0" : size === "page" ? "mb-6" : "mb-6"

  const line2Class = cn(
    titleLine2Tone === "primary"
      ? "text-primary"
      : isDark
        ? "text-muted-on-dark"
        : "text-on-light-muted"
  )

  const subtitleToneClass = isDark ? "text-muted-on-dark" : "text-muted-on-light"

  return (
    <FadeIn
      className={cn(
        isCenter ? "mx-auto text-center" : "text-left",
        size === "compact" ? "mb-14 max-w-2xl" : size === "page" ? "max-w-3xl" : "mb-16 max-w-2xl",
        isCenter && size !== "compact" && "max-w-2xl",
        size === "section" && subtitle && isCenter && "max-w-2xl",
        className
      )}
    >
      {badge ? (
        <div className={cn(badgeClass, "mb-6")}>
          <span className={badgeLabelClass}>{badge}</span>
        </div>
      ) : null}
      {hasTitle ? (
        <Heading
          className={cn(
            "font-bold text-balance",
            titleSizeClass,
            titleMarginClass,
            isDark ? "text-on-dark" : "text-on-light"
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
          className={cn(
            "leading-relaxed",
            size === "compact" ? "" : "text-lg",
            isCenter && subtitleProse ? "prose-width mx-auto" : "",
            subtitleToneClass,
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </FadeIn>
  )
}
