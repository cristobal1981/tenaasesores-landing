"use client"

import Image from "next/image"
import { FadeIn } from "@/components/animations"
import { odoo } from "@/content/site"
import { cn } from "@/lib/utils"

export function OdooCredential() {
  return (
    <div className="relative mx-auto mb-16 max-w-4xl">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-48 w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/10 blur-[80px]"
        aria-hidden
      />

      <FadeIn className="text-center">
        <div className="mx-auto inline-flex ">
          <Image
            src={odoo.partners.odoo.batch.src}
            alt={odoo.partners.odoo.batch.alt}
            width={odoo.partners.odoo.batch.width}
            height={odoo.partners.odoo.batch.height}
            className="h-20 w-auto object-contain md:h-28 lg:h-32"
            priority
          />
        </div>
        <p className="prose-width mx-auto mt-8 text-base leading-relaxed text-muted-on-dark md:text-lg">
          {odoo.partners.odoo.text}
        </p>
      </FadeIn>
    </div>
  )
}

export function HoldedPartnerStrip() {
  return (
    <FadeIn delay={0.1}>
      <div className="mx-auto mt-16 max-w-4xl border-t border-agua/20 pt-10 text-center md:pt-12">
        <div className="flex flex-col items-center gap-5 md:gap-6">
          <Image
            src={odoo.partners.holded.logo.src}
            alt={odoo.partners.holded.logo.alt}
            width={odoo.partners.holded.logo.width}
            height={odoo.partners.holded.logo.height}
            className="h-8 w-auto object-contain md:h-9"
          />
          <p className="prose-width text-sm leading-relaxed text-muted-on-dark md:text-base">
            {odoo.partners.holded.text}
          </p>
          <Image
            src={odoo.partners.holded.batch.src}
            alt={odoo.partners.holded.batch.alt}
            width={odoo.partners.holded.batch.width}
            height={odoo.partners.holded.batch.height}
            className="h-14 w-auto object-contain md:h-16"
          />
        </div>
      </div>
    </FadeIn>
  )
}

type OdooStepsProps = {
  className?: string
}

export function OdooSteps({ className }: OdooStepsProps) {
  return (
    <div className={cn("mx-auto max-w-4xl", className)}>
      <FadeIn>
        <p className="mb-10 border-t border-agua/20 pt-10 text-center font-sans text-sm font-semibold tracking-wide text-primary uppercase">
          {odoo.stepsTitle}
        </p>
      </FadeIn>

      <ol
        className="relative flex flex-col gap-0 md:flex-row md:items-start md:justify-between"
        aria-label={odoo.stepsTitle}
      >
        {odoo.steps.map((step, index) => {
          const isLast = index === odoo.steps.length - 1

          return (
            <li
              key={step.title}
              className="relative flex flex-1 flex-col items-center px-2 pb-10 text-center last:pb-0 md:pb-0"
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
            </li>
          )
        })}
      </ol>
    </div>
  )
}
