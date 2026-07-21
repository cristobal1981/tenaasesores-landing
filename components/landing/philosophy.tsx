"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { registerScrollTrigger } from "@/lib/gsap/register-scroll-trigger"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"
import { philosophy } from "@/content/site"

registerScrollTrigger()

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      const panels = gsap.utils.toArray<HTMLElement>("[data-clave-panel]", pin)
      if (panels.length === 0) return

      if (reducedMotion) {
        gsap.set(panels, { opacity: 1, y: 0 })
        gsap.set(panels.slice(1), { display: "none" })
        return
      }

      gsap.set(panels, { opacity: 0, y: 40, position: "absolute", inset: 0 })
      gsap.set(panels[0], { opacity: 1, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * philosophy.values.length}`,
          pin: pin,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      philosophy.values.forEach((_, index) => {
        if (index === 0) return
        const prev = panels[index - 1]
        const current = panels[index]
        tl.to(prev, { opacity: 0, y: -32, duration: 0.35, ease: "power2.in" }, index)
        tl.to(current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, index + 0.05)
      })

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <section
      ref={sectionRef}
      className="section-divider relative bg-surface-light"
      style={{ minHeight: `${(philosophy.values.length + 1) * 100}vh` }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center md:py-28">
          <p
            data-home-reveal
            className="mb-5 text-[0.72rem] font-semibold tracking-[0.2em] text-accent-on-light uppercase"
          >
            {philosophy.badge}
          </p>
          <h2
            data-home-reveal
            className="mx-auto max-w-4xl text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-on-light"
          >
            {philosophy.title[0]}
            <br />
            <span className="text-on-light-muted">{philosophy.title[1]}</span>
          </h2>
          <p
            data-home-reveal
            className="prose-width mx-auto mt-6 text-base leading-relaxed text-muted-on-light sm:text-lg"
          >
            {philosophy.subtitle}
          </p>
        </div>

        <div
          ref={pinRef}
          className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center pb-24 text-center"
        >
          {philosophy.values.map((value) => (
            <div
              key={value.letter}
              data-clave-panel
              className="flex flex-col items-center justify-center px-4"
            >
              <span className="home-clave-letter mb-6 font-semibold text-accent-on-light">
                {value.letter}
              </span>
              <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-on-light uppercase">
                {value.title}
              </p>
              <p className="max-w-[42ch] text-lg leading-relaxed text-muted-on-light sm:text-xl">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
