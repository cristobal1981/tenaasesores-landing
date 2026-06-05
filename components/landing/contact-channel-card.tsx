import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ContactChannelCardProps = {
  icon: LucideIcon
  label: string
  children: ReactNode
  iconPulse?: boolean
  className?: string
}

export function ContactChannelCard({
  icon: Icon,
  label,
  children,
  iconPulse = true,
  className,
}: ContactChannelCardProps) {
  return (
    <div className={cn("rounded-xl border border-agua/30 bg-on-dark/8 p-4", className)}>
      <p className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-on-dark uppercase">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/25">
          <Icon
            className={cn(
              "h-4 w-4 text-primary",
              iconPulse && "motion-safe:animate-pulse"
            )}
          />
        </span>
        {label}
      </p>
      {children}
    </div>
  )
}
