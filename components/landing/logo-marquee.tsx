"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"
import { FadeIn } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { logoMarquee } from "@/content/site"

function LogoGroup({
  groupRef,
  ariaHidden,
  ariaLabel,
}: {
  groupRef?: RefObject<HTMLUListElement | null>
  ariaHidden?: boolean
  ariaLabel?: string
}) {
  const slotStyle = {
    width: logoMarquee.slotWidth,
    height: logoMarquee.slotHeight,
  } as const

  return (
    <ul
      ref={groupRef}
      className="logo-marquee-group"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {logoMarquee.items.map((logo) => (
        <li key={logo.name} className="logo-marquee-item">
          <div className="flex shrink-0 items-center justify-center" style={slotStyle}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logoMarquee.slotWidth}
              height={logoMarquee.slotHeight}
              loading="lazy"
              decoding="async"
              className="logo-marquee-image max-h-full max-w-full object-contain"
              style={
                logo.scale !== 1
                  ? { transform: `scale(${logo.scale})`, transformOrigin: "center" }
                  : undefined
              }
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function LogoMarquee() {
  const groupRef = useRef<HTMLUListElement>(null)
  const [marqueeDistance, setMarqueeDistance] = useState(0)
  const [repeatCount, setRepeatCount] = useState(2)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    const update = () => {
      const groupWidth = group.getBoundingClientRect().width
      if (groupWidth <= 0) return
      setMarqueeDistance(groupWidth)
      setRepeatCount(Math.max(2, Math.ceil((window.innerWidth * 2) / groupWidth)))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(group)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const trackStyle =
    marqueeDistance > 0
      ? ({ "--marquee-distance": `${marqueeDistance}px` } as CSSProperties)
      : undefined

  return (
    <section className="section-divider relative overflow-hidden bg-background py-14 md:py-20">
      <SectionShell>
        <FadeIn className="mb-10 text-center md:mb-12">
          <div className="badge-on-dark mb-4">
            <span className="badge-label-on-dark">{logoMarquee.badge}</span>
          </div>
          <p className="text-lg font-medium text-on-dark">{logoMarquee.title}</p>
        </FadeIn>
      </SectionShell>

      <div className="logo-marquee-mask relative left-1/2 w-screen -translate-x-1/2">
        <div className="logo-marquee-track" style={trackStyle}>
          {Array.from({ length: repeatCount }, (_, index) => (
            <LogoGroup
              key={index}
              groupRef={index === 0 ? groupRef : undefined}
              ariaHidden={index > 0}
              ariaLabel={index === 0 ? "Empresas con las que trabajamos" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
