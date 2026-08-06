"use client"

import Image from "next/image"
import { Eye, ShieldCheck, Zap } from "lucide-react"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { FadeIn } from "@/components/animations"
import { TextLinkWithIcon } from "@/components/ui/text-link"
import { odoo } from "@/content/site"
import { cn } from "@/lib/utils"

const benefitIcons = [Eye, ShieldCheck, Zap] as const

export function PartnersDossier() {
  return (
    <FadeIn>
      <div
        className="relative overflow-hidden rounded-2xl border border-agua/20"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--on-dark) 5%, var(--surface-dark)) 0%, color-mix(in oklch, var(--agua) 16%, var(--surface-dark)) 55%, var(--surface-dark) 100%)",
        }}
      >
        {/* Certificaciones — dos columnas separadas por una línea, no dos widgets distintos */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col border-b border-agua/15 p-8 sm:p-10 lg:border-r lg:border-b-0 lg:p-12">
            <Image
              src={odoo.partners.odoo.batch.src}
              alt={odoo.partners.odoo.batch.alt}
              width={odoo.partners.odoo.batch.width}
              height={odoo.partners.odoo.batch.height}
              className="mb-5 h-20 w-auto object-contain object-left sm:h-24"
              style={{ width: "auto" }}
              priority
            />
            <p className="mt-auto max-w-[48ch] text-base leading-relaxed text-muted-on-dark">
              {odoo.partners.odoo.text}{" "}
              <TextLinkWithIcon href={odoo.partners.odoo.verifyLink.href}>
                {odoo.partners.odoo.verifyLink.label}
              </TextLinkWithIcon>
            </p>
          </div>

          <div className="flex flex-col p-8 sm:p-10 lg:p-12">
            <Image
              src={odoo.partners.holded.batch.src}
              alt={odoo.partners.holded.batch.alt}
              width={odoo.partners.holded.batch.width}
              height={odoo.partners.holded.batch.height}
              className="mb-5 h-11 w-auto object-contain object-left sm:h-12"
              style={{ width: "auto" }}
            />
            <p className="mt-auto max-w-[38ch] text-sm leading-relaxed text-muted-on-dark">
              {odoo.partners.holded.text}{" "}
              <TextLinkWithIcon href={odoo.partners.holded.verifyLink.href}>
                {odoo.partners.holded.verifyLink.label}
              </TextLinkWithIcon>
            </p>
          </div>
        </div>

        {/* Razones — fila tipográfica, sin tarjetas ni iconos, separada por una sola línea */}
        <div className="relative grid grid-cols-1 gap-8 border-t border-agua/15 p-8 sm:grid-cols-3 sm:gap-10 sm:p-10 lg:p-12">
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
