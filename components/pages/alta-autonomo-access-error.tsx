import { Link2Off, ServerCrash } from "lucide-react"
import { cn } from "@/lib/utils"

type AltaAutonomoAccessErrorProps = {
  title: string
  body: string
  hint?: string
  variant?: "link" | "service"
  className?: string
}

export function AltaAutonomoAccessError({
  title,
  body,
  hint,
  variant = "link",
  className,
}: AltaAutonomoAccessErrorProps) {
  const Icon = variant === "service" ? ServerCrash : Link2Off

  return (
    <main
      className={cn(
        "relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-brisa px-4 py-12 sm:min-h-[calc(100dvh-5rem)] sm:px-6",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-8 h-44 w-44 rounded-full bg-agua/15 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-agua/25 bg-white/80 text-agua shadow-lg shadow-agua/10">
          <Icon className="size-7" aria-hidden />
        </div>

        <p className="text-xs font-semibold tracking-[0.18em] text-muted-on-light uppercase">
          Solicitud alta autónomo
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-on-light sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-on-light">
          {body}
        </p>
        {hint ? (
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-on-light-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </main>
  )
}
