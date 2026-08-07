"use client"

import Image from "next/image"
import { Eye, ShieldCheck, Zap } from "lucide-react"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { FadeIn } from "@/components/animations"
import { TextLinkWithIcon } from "@/components/ui/text-link"
import { odoo } from "@/content/site"
import { cn } from "@/lib/utils"

const benefitIcons = [Eye, ShieldCheck, Zap] as const

// Colores reales de marca de cada partner — no los nuestros — para que cada
// card se identifique por quién es, igual que las cards de servicios se
// identifican por su propio color.
const ODOO_BRAND = "#714b67"

const partnerSurfaceStyle = {
  backgroundColor: "color-mix(in oklch, var(--on-dark) 4%, var(--surface-dark))",
} as const

function partnerGlowStyle(tint: string) {
  return {
    backgroundImage: `radial-gradient(circle at 88% 8%, color-mix(in srgb, ${tint} 28%, transparent), transparent 60%)`,
  } as const
}

// Tamaño generoso y centrado: al rotar la capa, las esquinas siguen
// cubriendo la card entera sin importar su proporción (Odoo y Holded tienen
// anchos muy distintos), a diferencia de un "scale" ajustado a mano.
const partnerPatternStyle = {
  backgroundImage: "url(/brand/isotipo-desbordado.svg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "220% 220%",
  backgroundPosition: "50% 50%",
} as const

export function PartnersDossier() {
  return (
    <FadeIn>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div
          className="relative flex flex-col overflow-hidden rounded-2xl p-8 sm:p-10 lg:col-span-3 lg:p-12"
          style={partnerSurfaceStyle}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0" style={partnerGlowStyle(ODOO_BRAND)} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rotate-[35deg] opacity-40"
            style={partnerPatternStyle}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-dark from-0% via-surface-dark/75 via-35% to-transparent to-85%"
          />
          <Image
            src={odoo.partners.odoo.batch.src}
            alt={odoo.partners.odoo.batch.alt}
            width={odoo.partners.odoo.batch.width}
            height={odoo.partners.odoo.batch.height}
            className="relative z-10 mb-6 h-20 w-auto object-contain object-left sm:h-24"
            style={{ width: "auto" }}
            priority
          />
          <p className="relative z-10 mt-auto max-w-[48ch] text-base leading-relaxed text-muted-on-dark">
            {odoo.partners.odoo.text}{" "}
            <TextLinkWithIcon href={odoo.partners.odoo.verifyLink.href}>
              {odoo.partners.odoo.verifyLink.label}
            </TextLinkWithIcon>
          </p>
        </div>

        <div
          className="relative flex flex-col overflow-hidden rounded-2xl p-8 sm:p-10 lg:col-span-2 lg:p-12"
          style={partnerSurfaceStyle}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={partnerGlowStyle("var(--turquesa)")}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rotate-[35deg] opacity-40"
            style={partnerPatternStyle}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-dark from-0% via-surface-dark/75 via-35% to-transparent to-85%"
          />
          <Image
            src={odoo.partners.holded.batch.src}
            alt={odoo.partners.holded.batch.alt}
            width={odoo.partners.holded.batch.width}
            height={odoo.partners.holded.batch.height}
            className="relative z-10 mb-6 h-11 w-auto object-contain object-left sm:h-12"
            style={{ width: "auto" }}
          />
          <p className="relative z-10 mt-auto max-w-[38ch] text-sm leading-relaxed text-muted-on-dark">
            {odoo.partners.holded.text}{" "}
            <TextLinkWithIcon href={odoo.partners.holded.verifyLink.href}>
              {odoo.partners.holded.verifyLink.label}
            </TextLinkWithIcon>
          </p>
        </div>
      </div>

      {/* Razones — fila tipográfica suelta, sin caja ni iconos sobre fondo: se
          separa del bloque de partners por aire, no por una línea. */}
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
        {odoo.benefits.map((benefit, index) => {
          const Icon = benefitIcons[index]
          return (
            <div key={benefit.title}>
              <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-on-dark">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-on-dark">{benefit.description}</p>
            </div>
          )
        })}
      </div>
    </FadeIn>
  )
}

type OdooStepsProps = {
  className?: string
}

export function OdooSteps({ className }: OdooStepsProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className={cn("mx-auto max-w-4xl", className)}>
      <FadeIn>
        <p className="mb-10 text-center font-sans text-sm font-semibold tracking-wide text-primary uppercase">
          {odoo.stepsTitle}
        </p>
      </FadeIn>

      <LazyMotion features={domAnimation} strict>
        <m.ol
          className="relative flex flex-col gap-0 md:flex-row md:items-start md:justify-between"
          aria-label={odoo.stepsTitle}
          initial={reducedMotion ? undefined : "hidden"}
          whileInView={reducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {odoo.steps.map((step, index) => {
            const isLast = index === odoo.steps.length - 1

            return (
              <m.li
                key={step.title}
                className="relative flex flex-1 flex-col items-center px-2 pb-10 text-center last:pb-0 md:pb-0"
                variants={
                  reducedMotion
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 24 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                        },
                      }
                }
              >
                {!isLast ? (
                  <>
                    <span
                      className="absolute top-5 left-[calc(50%+1.25rem)] hidden h-px w-[calc(100%-2.5rem)] bg-agua/35 md:block"
                      aria-hidden
                    />
                    <span
                      className="absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2 bg-agua/35 md:hidden"
                      aria-hidden
                    />
                  </>
                ) : null}

                <span className="relative z-10 mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface-dark font-sans text-lg font-bold text-primary">
                  {index + 1}
                </span>

                <h3 className="mb-2 font-semibold text-on-dark">{step.title}</h3>
                <p className="max-w-[22ch] text-sm leading-relaxed text-muted-on-dark md:max-w-none md:text-base">
                  {step.description}
                </p>
              </m.li>
            )
          })}
        </m.ol>
      </LazyMotion>
    </div>
  )
}
