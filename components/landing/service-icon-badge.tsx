import { getServiceAccent } from "@/lib/service-accent"
import { getServiceIconBySlug } from "@/lib/service-icons"
import { cn } from "@/lib/utils"

const sizeStyles = {
  sm: {
    box: "h-12 w-12 rounded-xl",
    icon: "h-6 w-6",
  },
  md: {
    box: "h-14 w-14 rounded-2xl",
    icon: "h-7 w-7",
  },
  lg: {
    box: "h-14 w-14 rounded-xl lg:h-20 lg:w-20",
    icon: "h-7 w-7 lg:h-10 lg:w-10",
  },
} as const

type ServiceIconBadgeProps = {
  slug: string
  size?: keyof typeof sizeStyles
  className?: string
}

export function ServiceIconBadge({ slug, size = "md", className }: ServiceIconBadgeProps) {
  const Icon = getServiceIconBySlug(slug)
  const accent = getServiceAccent(slug)
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center transition-all duration-300",
        styles.box,
        accent.badge,
        accent.badgeHover,
        size === "lg" && "group-hover:scale-105",
        className,
      )}
    >
      <Icon className={cn(styles.icon, accent.icon)} aria-hidden />
    </div>
  )
}
