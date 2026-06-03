"use client"

import { forwardRef, type ReactNode } from "react"
import { FadeIn } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { cn } from "@/lib/utils"

const brisaBackdropGradient =
  "radial-gradient(circle_at_12%_14%,rgba(1,222,162,0.24),transparent_32%),radial-gradient(circle_at_86%_20%,rgba(1,99,92,0.15),transparent_30%),radial-gradient(circle_at_72%_88%,rgba(43,192,169,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(214,242,232,0.95))"

function BrisaFormBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: brisaBackdropGradient }}
      />
      <div
        aria-hidden
        className="contact-geo-float contact-geo-float-a pointer-events-none absolute -top-24 right-12 h-60 w-60 rotate-12 rounded-[2rem] border border-agua/20 bg-white/55"
      />
      <div
        aria-hidden
        className="contact-geo-float contact-geo-float-b pointer-events-none absolute top-1/3 -left-16 h-44 w-44 rounded-full border border-primary/35 bg-primary/10"
      />
      <div
        aria-hidden
        className="contact-geo-float contact-geo-float-c pointer-events-none absolute bottom-12 right-1/3 h-24 w-24 rotate-45 border border-agua/30 bg-white/70"
      />
    </>
  )
}

type BrisaFormSectionProps = {
  id?: string
  className?: string
  shellClassName?: string
  "aria-labelledby"?: string
  padding?: "default" | "spacious"
  children: ReactNode
}

export const BrisaFormSection = forwardRef<HTMLElement, BrisaFormSectionProps>(
  function BrisaFormSection(
    { id, className, shellClassName, "aria-labelledby": ariaLabelledBy, padding = "default", children },
    ref
  ) {
    return (
      <section
        ref={ref}
        id={id}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          "relative overflow-x-hidden bg-brisa",
          padding === "spacious" ? "py-20 md:py-28" : "py-16 md:py-20",
          className
        )}
      >
        <BrisaFormBackdrop />
        <SectionShell className={cn("relative", shellClassName)}>{children}</SectionShell>
      </section>
    )
  }
)

type BrisaFormCardProps = {
  children: ReactNode
  className?: string
  maxWidthClassName?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function BrisaFormCard({
  children,
  className,
  maxWidthClassName = "max-w-6xl",
  delay = 0,
  direction = "up",
}: BrisaFormCardProps) {
  return (
    <div className={cn("mx-auto w-full", maxWidthClassName, className)}>
      <FadeIn delay={delay} direction={direction}>
        <div className="overflow-hidden rounded-3xl border border-agua/25 bg-white/90 shadow-xl shadow-agua/10 backdrop-blur-sm">
          {children}
        </div>
      </FadeIn>
    </div>
  )
}

type DarkFormPanelProps = {
  children: ReactNode
  className?: string
}

export function DarkFormPanel({ children, className }: DarkFormPanelProps) {
  return (
    <div className={cn("relative bg-surface-dark p-6 sm:p-8 md:p-9", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-6 h-52 w-52 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-10 h-36 w-36 rounded-full bg-turquesa/18 blur-3xl"
      />
      <div className="relative">{children}</div>
    </div>
  )
}
