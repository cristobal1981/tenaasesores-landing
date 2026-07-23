import type { ReactNode } from "react"
import { FadeIn } from "@/components/animations"
import { SectionIntro } from "@/components/layout/section-intro"
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
  as = "h2",
  size = "section",
  className,
  subtitleClassName,
  subtitleProse = true,
  children,
}: MarketingSectionHeadingProps) {
  const isCenter = align === "center"

  return (
    <FadeIn
      className={cn(
        isCenter ? "mx-auto text-center" : "text-left",
        size === "compact" ? "mb-14 max-w-2xl" : size === "page" ? "max-w-3xl" : "mb-16 max-w-2xl",
        isCenter && size !== "compact" && "max-w-2xl",
        size === "section" && subtitle && isCenter && "max-w-2xl",
        className,
      )}
    >
      <SectionIntro
        eyebrow={badge}
        title={title}
        subtitle={subtitle}
        align={align}
        tone={tone}
        titleLine2Tone={titleLine2Tone}
        as={as}
        size={size}
        subtitleClassName={cn(!subtitleProse && "max-w-none", subtitleClassName)}
        className="max-w-none"
      />
      {children}
    </FadeIn>
  )
}
