"use client"

import Image from "next/image"
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import type { ReactNode, CSSProperties, RefObject } from "react"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
}: FadeInProps) {
  const reducedMotion = useReducedMotion()
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{
          opacity: 0,
          ...directions[direction],
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
        }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

interface FloatingElementProps {
  className?: string
  duration?: number
  delay?: number
}

export function FloatingElement({
  className = "",
  duration = 6,
  delay = 0,
}: FloatingElementProps) {
  const style: CSSProperties = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }

  return (
    <div
      className={`animate-float pointer-events-none ${className}`}
      style={style}
      aria-hidden
    />
  )
}

interface ParallaxImageProps {
  src: string
  alt?: string
  scrollTargetRef: RefObject<HTMLElement | null>
  speed?: number
}

export function ParallaxImage({
  src,
  alt = "",
  scrollTargetRef,
  speed = 0.25,
}: ParallaxImageProps) {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  if (reducedMotion) {
    return (
      <div className="absolute inset-0">
        <Image src={src} alt={alt} fill className="object-cover" priority sizes="100vw" />
      </div>
    )
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div className="absolute -top-[12%] left-0 h-[125%] w-full" style={{ y }}>
        <Image src={src} alt={alt} fill className="object-cover" priority sizes="100vw" />
      </m.div>
    </LazyMotion>
  )
}

export function ScaleIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
