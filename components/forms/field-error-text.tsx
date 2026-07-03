import { cn } from "@/lib/utils"

type FieldErrorTextProps = {
  id?: string
  children?: string
  className?: string
}

export function FieldErrorText({ id, children, className }: FieldErrorTextProps) {
  if (!children) return null

  return (
    <p
      id={id}
      role="alert"
      className={cn("mt-1.5 text-sm leading-snug text-red-300", className)}
    >
      {children}
    </p>
  )
}
