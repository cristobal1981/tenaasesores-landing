"use client"

import { useId } from "react"
import { CheckCircle2 } from "lucide-react"
import { m, useReducedMotion } from "framer-motion"

const haloSpinDuration = 0.82
const checkPopDelay = 0.68
const checkPopDuration = 0.38
const popEase = [0.22, 1, 0.36, 1] as const

type SuccessIconAnimatedProps = {
  className?: string
}

export function SuccessIconAnimated({ className }: SuccessIconAnimatedProps) {
  const reducedMotion = useReducedMotion()
  const gradientId = useId().replace(/:/g, "")

  if (reducedMotion) {
    return (
      <div
        className={
          className ??
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/45 bg-primary/12"
        }
      >
        <CheckCircle2 aria-hidden className="h-8 w-8 text-primary" strokeWidth={2} />
      </div>
    )
  }

  return (
    <div
      className={className ?? "relative h-14 w-14 shrink-0"}
      aria-hidden
    >
      <m.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 56 56"
        fill="none"
        initial={{ rotate: -90, opacity: 1 }}
        animate={{ rotate: 300, opacity: [1, 1, 0] }}
        transition={{
          rotate: { duration: haloSpinDuration, ease: "easeInOut" },
          opacity: { duration: haloSpinDuration, times: [0, 0.78, 1], ease: "easeOut" },
        }}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="8"
            y1="28"
            x2="48"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx="28"
          cy="28"
          r="24"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="88 163"
        />
      </m.svg>

      <div className="flex h-full w-full items-center justify-center rounded-full border border-primary/45 bg-primary/12">
        <m.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: [0.88, 1.22, 1], opacity: [0, 1, 1] }}
          transition={{
            delay: checkPopDelay,
            duration: checkPopDuration,
            times: [0, 0.5, 1],
            ease: popEase,
          }}
        >
          <CheckCircle2 className="h-8 w-8 text-primary" strokeWidth={2} />
        </m.div>
      </div>
    </div>
  )
}
