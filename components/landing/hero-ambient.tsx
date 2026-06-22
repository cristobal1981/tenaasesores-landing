"use client"

import { Building2, Calculator, LineChart, Sparkles, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { m, useReducedMotion, useSpring } from "framer-motion"
import { FloatingElement } from "@/components/animations"

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2301dea2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

const CURSOR_AVOID_RADIUS = 120
const CURSOR_MAX_PUSH = 52
const CURSOR_CLOSE_BOOST = 14

type AmbientIconConfig = {
  Icon: LucideIcon
  position: string
  drift: { x: number[]; y: number[] }
  duration: number
  pulseDelay: number
}

const ambientIcons: AmbientIconConfig[] = [
  {
    Icon: Calculator,
    position: "left-[6%] top-[20%] md:left-[10%] md:top-[24%]",
    drift: { x: [0, 14, 8, -12, -18, -6, 0], y: [0, -8, -18, -12, 4, 16, 0] },
    duration: 19,
    pulseDelay: 0,
  },
  {
    Icon: Building2,
    position: "right-[7%] top-[16%] md:right-[12%] md:top-[20%]",
    drift: { x: [0, 16, 22, 16, 0, -16, -22, -16, 0], y: [0, -22, -16, 0, 16, 22, 16, 0, 0] },
    duration: 24,
    pulseDelay: 0.4,
  },
  {
    Icon: LineChart,
    position: "left-[12%] bottom-[18%] md:left-[16%] md:bottom-[22%]",
    drift: { x: [0, 18, 18, 0, -18, -18, 0], y: [0, 0, 18, 18, 18, 0, 0] },
    duration: 21,
    pulseDelay: 0.8,
  },
  {
    Icon: Users,
    position: "right-[10%] bottom-[20%] md:right-[14%] md:bottom-[24%]",
    drift: { x: [0, -20, -8, 12, 20, 6, 0], y: [0, 6, 20, 14, -4, -16, 0] },
    duration: 23,
    pulseDelay: 1.2,
  },
  {
    Icon: Sparkles,
    position: "left-[42%] top-[12%] hidden sm:block",
    drift: { x: [0, 10, 0, -10, 0], y: [0, -14, 0, 14, 0] },
    duration: 16,
    pulseDelay: 0.2,
  },
]
const ambientRings = [
  {
    sizeClass: "h-[min(90vw,520px)] w-[min(90vw,520px)]",
    strokeClass: "stroke-primary/16",
    duration: 2.6,
    delay: 0.2,
    spinDuration: 140,
    spinDirection: 1,
  },
  {
    sizeClass: "h-[min(70vw,380px)] w-[min(70vw,380px)]",
    strokeClass: "stroke-agua/22",
    duration: 2.2,
    delay: 0.6,
    spinDuration: 110,
    spinDirection: -1,
  },
] as const

function AmbientRing({
  sizeClass,
  strokeClass,
  duration,
  delay,
  spinDuration,
  spinDirection,
  reducedMotion,
}: (typeof ambientRings)[number] & { reducedMotion: boolean }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const radius = 49.5
  const circumference = 2 * Math.PI * radius

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
      aria-hidden
    >
      <m.div
        className="h-full w-full"
        animate={{ rotate: isSpinning ? spinDirection * 360 : 0 }}
        transition={
          isSpinning
            ? { repeat: Infinity, duration: spinDuration, ease: "linear" }
            : { duration: 0 }
        }
      >
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <m.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={strokeClass}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="butt"
            transform="rotate(-90 50 50)"
            initial={
              reducedMotion
                ? { strokeDashoffset: 0, strokeDasharray: `${circumference} ${circumference}` }
                : {
                    strokeDashoffset: circumference,
                    strokeDasharray: `${circumference} ${circumference}`,
                  }
            }
            animate={{ strokeDashoffset: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration, delay, ease: [0.22, 1, 0.36, 1] }
            }
            onAnimationComplete={() => {
              if (!reducedMotion) setIsSpinning(true)
            }}
          />
        </svg>
      </m.div>
    </div>
  )
}

function AmbientIcon({
  Icon,
  position,
  drift,
  duration,
  pulseDelay,
  reducedMotion,
}: AmbientIconConfig & { reducedMotion: boolean }) {
  const iconRef = useRef<HTMLDivElement>(null)
  const avoidX = useSpring(0, { stiffness: 340, damping: 24, mass: 0.5 })
  const avoidY = useSpring(0, { stiffness: 340, damping: 24, mass: 0.5 })

  useEffect(() => {
    if (reducedMotion) return

    const handlePointerMove = (event: PointerEvent) => {
      const icon = iconRef.current
      if (!icon) return

      const rect = icon.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = event.clientX - centerX
      const dy = event.clientY - centerY
      const distance = Math.hypot(dx, dy)

      if (distance < CURSOR_AVOID_RADIUS) {
        const falloff = 1 - distance / CURSOR_AVOID_RADIUS
        const push = falloff * falloff * CURSOR_MAX_PUSH + (distance < 32 ? CURSOR_CLOSE_BOOST : 0)
        let nx = -0.65
        let ny = -0.75
        if (distance > 4) {
          nx = -(dx / distance)
          ny = -(dy / distance)
        }
        avoidX.set(nx * push)
        avoidY.set(ny * push)
        return
      }

      avoidX.set(0)
      avoidY.set(0)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [reducedMotion, avoidX, avoidY])

  const iconShell = (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/8 shadow-[0_0_24px_-8px_rgba(1,222,162,0.45)] backdrop-blur-sm md:h-12 md:w-12">
      <Icon className="h-5 w-5 text-primary/70 md:h-[1.35rem] md:w-[1.35rem]" strokeWidth={1.75} />
    </div>
  )

  return (
    <div className={`absolute ${position}`} aria-hidden>
      <m.div
        ref={iconRef}
        className="pointer-events-auto w-fit cursor-default"
        style={{ x: avoidX, y: avoidY }}
      >
        {reducedMotion ? (
          iconShell
        ) : (
          <m.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 + pulseDelay, ease: "easeOut" }}
          >
            <m.div
              animate={{ x: drift.x, y: drift.y }}
              transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
            >
              <m.div
                animate={{ opacity: [0.55, 0.85, 0.55] }}
                transition={{
                  duration: 4.5,
                  delay: pulseDelay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {iconShell}
              </m.div>
            </m.div>
          </m.div>
        )}
      </m.div>
    </div>
  )
}
export function HeroAmbient() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: GRID_PATTERN }}
      />
      <FloatingElement
        className="absolute -bottom-24 left-[-12%] h-72 w-72 rounded-full bg-agua/20 blur-[90px]"
        duration={14}
        delay={0.5}
      />
      <FloatingElement
        className="absolute top-[8%] right-[-6%] h-56 w-56 rounded-full bg-primary/8 blur-[80px]"
        duration={11}
        delay={1}
      />
      {ambientRings.map((ring) => (
        <AmbientRing key={ring.sizeClass} {...ring} reducedMotion={Boolean(reducedMotion)} />
      ))}
      {ambientIcons.map((item) => (
        <AmbientIcon key={item.position} {...item} reducedMotion={Boolean(reducedMotion)} />
      ))}
    </div>
  )
}
