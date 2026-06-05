import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FormStatusMessageProps = {
  variant: "success" | "error"
  children: ReactNode
  tone?: "dark" | "light"
  boxed?: boolean
  className?: string
}

export function FormStatusMessage({
  variant,
  children,
  tone = "dark",
  boxed = true,
  className,
}: FormStatusMessageProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "text-sm",
        boxed && "rounded-lg border px-3 py-2",
        variant === "success"
          ? boxed
            ? "border-primary/35 bg-primary/10 text-on-dark"
            : "text-primary"
          : boxed
            ? tone === "light"
              ? "border-red-400/40 bg-red-500/10 text-destructive"
              : "border-red-400/40 bg-red-500/10 text-on-dark"
            : "text-destructive",
        className
      )}
    >
      {children}
    </p>
  )
}
