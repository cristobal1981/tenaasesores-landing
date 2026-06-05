import type { LucideIcon } from "lucide-react"
import { Check, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ChecklistItemProps = {
  children: string
  icon?: "check" | "check-circle"
  className?: string
  textClassName?: string
  iconClassName?: string
}

const icons: Record<NonNullable<ChecklistItemProps["icon"]>, LucideIcon> = {
  check: Check,
  "check-circle": CheckCircle2,
}

export function ChecklistItem({
  children,
  icon = "check",
  className,
  textClassName,
  iconClassName,
}: ChecklistItemProps) {
  const Icon = icons[icon]

  return (
    <li className={cn("flex items-start gap-2 text-sm leading-relaxed", className)}>
      <Icon
        className={cn(
          "shrink-0 text-primary",
          icon === "check" ? "mt-0.5 h-5 w-5" : "mt-0.5 h-4 w-4",
          iconClassName
        )}
        aria-hidden
      />
      <span className={cn("text-muted-on-dark", textClassName)}>{children}</span>
    </li>
  )
}
