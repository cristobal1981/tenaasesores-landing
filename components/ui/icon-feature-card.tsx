import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type IconFeatureCardProps = {
  icon: LucideIcon
  title: string
  description: string
  variant?: "subtle" | "gradient"
  iconSize?: "sm" | "md"
  children?: ReactNode
  className?: string
}

export function IconFeatureCard({
  icon: Icon,
  title,
  description,
  variant = "subtle",
  iconSize = "sm",
  children,
  className,
}: IconFeatureCardProps) {
  const shellClass =
    variant === "gradient"
      ? "group flex h-full flex-col rounded-2xl border border-agua/30 bg-gradient-to-br from-card to-agua/25 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
      : "h-full rounded-2xl border border-on-dark/15 bg-on-dark/5 p-6 transition-colors hover:border-primary/35"

  const iconBoxClass =
    iconSize === "md"
      ? "mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 transition-transform duration-300 group-hover:scale-105"
      : "mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15"

  const iconClass = iconSize === "md" ? "h-6 w-6 text-primary" : "h-5 w-5 text-primary"

  return (
    <div className={cn(shellClass, className)}>
      <div className={iconBoxClass}>
        <Icon className={iconClass} />
      </div>
      <h3
        className={cn(
          "font-semibold text-on-dark",
          iconSize === "md" ? "mb-3 text-lg" : "mb-2 text-lg"
        )}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-on-dark">{description}</p>
      {children}
    </div>
  )
}
