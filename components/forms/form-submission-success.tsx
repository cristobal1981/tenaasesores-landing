"use client"

import { SuccessIconAnimated } from "@/components/forms/success-icon-animated"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"

const successFadeMs = 0.2
const stepEase = [0.22, 1, 0.36, 1] as const
const progressFillDuration = 0.36
const progressSegmentStagger = 0.14

type FormSubmissionSuccessProps = {
  title: string
  body: string
  doneLabel: string
  progressSegments?: number
  className?: string
}

export function FormSubmissionSuccess({
  title,
  body,
  doneLabel,
  progressSegments = 1,
  className = "w-full",
}: FormSubmissionSuccessProps) {
  const reducedMotion = useReducedMotion()
  const segments = Math.max(1, progressSegments)

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        role="status"
        aria-live="polite"
        className={className}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : successFadeMs, ease: stepEase }}
      >
        <div
          className="mb-6 flex w-full gap-1.5"
          aria-label={doneLabel}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={segments}
          aria-valuenow={segments}
        >
          {Array.from({ length: segments }, (_, index) => (
            <span
              key={index}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-agua/25"
              aria-hidden
            >
              <m.span
                className="absolute inset-y-0 left-0 w-full rounded-full bg-primary"
                initial={reducedMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reducedMotion ? 0 : progressFillDuration,
                  delay: reducedMotion ? 0 : index * progressSegmentStagger,
                  ease: stepEase,
                }}
                style={{ transformOrigin: "0% 50%" }}
              />
            </span>
          ))}
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <SuccessIconAnimated />

          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-on-dark md:text-xl">{title}</h3>
            <p className="max-w-prose text-sm leading-relaxed text-muted-on-dark md:text-base">
              {body}
            </p>
            <p className="text-xs font-medium tracking-wide text-primary uppercase">{doneLabel}</p>
          </div>
        </div>
      </m.div>
    </LazyMotion>
  )
}
