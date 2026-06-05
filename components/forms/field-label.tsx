import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FieldLabelProps = {
  htmlFor?: string
  id?: string
  children: ReactNode
  required?: boolean
  tone?: "dark" | "light"
  className?: string
}

export function FieldLabel({
  htmlFor,
  id,
  children,
  required,
  tone = "dark",
  className,
}: FieldLabelProps) {
  const toneClass = tone === "light" ? "text-on-light" : "text-on-dark"
  const content = (
    <>
      <span>{children}</span>
      {required ? (
        <span className="text-primary" aria-hidden="true">
          *
        </span>
      ) : null}
    </>
  )

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        id={id}
        className={cn(
          "mb-2 flex items-center gap-1 text-sm font-medium",
          toneClass,
          className
        )}
      >
        {content}
      </label>
    )
  }

  return (
    <span
      id={id}
      className={cn("mb-2 flex items-center gap-1 text-sm font-medium", toneClass, className)}
    >
      {content}
    </span>
  )
}
