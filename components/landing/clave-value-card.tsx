import { cn } from "@/lib/utils"

type ClaveValue = {
  letter: string
  title: string
  description: string
}

type ClaveValueCardProps = {
  value: ClaveValue
  titleParts: { before: string; highlight: string; after: string }
  isActive: boolean
  hasActive: boolean
  className?: string
}

export function ClaveValueCard({
  value,
  titleParts,
  isActive,
  hasActive,
  className,
}: ClaveValueCardProps) {
  return (
    <article
      id={`clave-${value.letter.toLowerCase()}`}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-5 transition-[opacity,box-shadow,border-color,background-color] duration-300 ease-out sm:p-6",
        isActive
          ? "border-agua/45 bg-surface-light shadow-[0_12px_40px_-16px_rgba(4,29,35,0.18)]"
          : "border-on-light/10 bg-on-light/[0.04]",
        !isActive && hasActive && "opacity-60",
        className
      )}
    >
      <header className="mb-4 border-b border-on-light/10 pb-4">
        <h3 className="text-xl font-bold leading-tight tracking-wide sm:text-2xl" aria-label={value.title}>
          {titleParts.before ? (
            <span
              className={cn(
                "transition-colors duration-300",
                isActive ? "text-on-light" : "text-on-light"
              )}
            >
              {titleParts.before}
            </span>
          ) : null}
          <span
            className={cn(
              "transition-colors duration-300",
              isActive ? "text-agua" : hasActive ? "text-on-light-muted" : "text-accent-on-light"
            )}
          >
            {titleParts.highlight}
          </span>
          <span
            className={cn(
              "transition-colors duration-300",
              isActive ? "text-on-light" : "text-on-light"
            )}
          >
            {titleParts.after}
          </span>
        </h3>
      </header>
      <p
        className={cn(
          "flex-1 text-sm leading-relaxed transition-[opacity,transform] duration-300 sm:text-base",
          isActive ? "text-muted-on-light" : "text-muted-on-light"
        )}
      >
        {value.description}
      </p>
    </article>
  )
}
