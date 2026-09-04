"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import { SectionIntro } from "@/components/layout/section-intro"
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
  return (
    <ul
      ref={groupRef}
      className="logo-marquee-group"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {logoMarquee.items.map((logo) => {
        const usesFluidSize = "fluidSize" in logo && logo.fluidSize
        const scaleStyle =
          logo.scale !== 1
            ? { transform: `scale(${logo.scale})`, transformOrigin: "center" as const }
            : undefined

        return (
        <li key={logo.name} className="logo-marquee-item">
          <div className="relative flex h-9 w-[130px] shrink-0 items-center justify-center sm:h-[46px] sm:w-[170px] lg:h-[60px] lg:w-[220px]">
            {usesFluidSize ? (
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 170px, 130px"
                className="logo-marquee-image object-contain"
              />
            ) : (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logoMarquee.slotWidth}
                height={logoMarquee.slotHeight}
                loading="lazy"
                decoding="async"
                className="logo-marquee-image max-h-full max-w-full object-contain"
                style={scaleStyle}
              />
            )}
          </div>
        </li>
        )
      })}
    </ul>
  )
}

export function LogoMarquee({ variant = "standalone" }: { variant?: "standalone" | "embedded" }) {
  const sectionRef = useRef<HTMLElement>(null)
  const groupRef = useRef<HTMLUListElement>(null)
  const [marqueeDistance, setMarqueeDistance] = useState(0)
  const [repeatCount, setRepeatCount] = useState(2)

  useHomeSectionReveal({ sectionRef })

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

  const isEmbedded = variant === "embedded"

  return (
    <section
      ref={sectionRef}
      className={
        isEmbedded
          ? "relative overflow-hidden bg-background pb-20 pt-6 md:pb-28 md:pt-10"
          : "section-divider relative overflow-hidden bg-background py-14 md:py-20"
      }
    >
      <SectionShell>
        <div className="mb-10 text-center md:mb-12">
          <SectionIntro
            eyebrow={logoMarquee.badge}
            title={logoMarquee.title}
            align="center"
            tone="dark"
            size="support"
            reveal
          />
        </div>
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
