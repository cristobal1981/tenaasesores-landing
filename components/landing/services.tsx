"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { m } from "framer-motion"
import { useHomeSectionReveal } from "@/components/gsap/use-home-section-reveal"
import { SectionIntro } from "@/components/layout/section-intro"
import { SectionShell } from "@/components/layout/section-shell"
import { brand, services } from "@/content/site"
import { cn } from "@/lib/utils"

type ServiceListItem = (typeof services.items)[number]

const bentoLayout = [
  "lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-1",
  "lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2",
  "lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:row-span-1",
  "lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:row-span-1",
] as const

const labelBySlug: Record<string, string> = {
  fiscal: "Fiscal",
  contable: "Contable",
  laboral: "Laboral",
  constitucion: "Constitución",
}

const tintBySlug: Record<string, string> = {
  fiscal: "var(--service-fiscal)",
  contable: "var(--service-contable)",
  laboral: "var(--service-laboral)",
  constitucion: "var(--service-constitucion)",
}

const bentoBackgroundStyle = {
  backgroundImage: "url(/brand/isotipo-desbordado.svg)",
  backgroundRepeat: "no-repeat",
  backgroundColor: "color-mix(in oklch, var(--on-dark) 4%, var(--background))",
} as const

function DetailLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`/servicios#${slug}`}
      className="mt-3 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-[gap,color] duration-300 hover:gap-3 hover:text-on-dark"
    >
      Ver detalle
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

function ServiceCard({ service }: { service: ServiceListItem }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-surface-dark from-0% via-surface-dark/80 via-40% to-transparent to-90%"
      />
      <h3 className="flex items-center gap-2 text-lg leading-tight font-semibold text-on-dark">
        <span aria-hidden className="relative flex h-2 w-2 shrink-0">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: tintBySlug[service.slug] }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: tintBySlug[service.slug] }}
          />
        </span>
        <span className="sr-only">{labelBySlug[service.slug]}: </span>
        {service.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-on-dark">{service.description}</p>
      <DetailLink slug={service.slug} />
    </div>
  )
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  useHomeSectionReveal({ sectionRef })

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const align = () => {
      const rect = grid.getBoundingClientRect()
      const cards = grid.querySelectorAll<HTMLElement>("[data-bento-card]")
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        card.style.backgroundSize = `${rect.width}px ${rect.height}px`
        card.style.backgroundPosition = `${-(cardRect.left - rect.left)}px ${-(cardRect.top - rect.top)}px`
      })
    }

    align()
    window.addEventListener("resize", align)
    void document.fonts?.ready.then(align)
    return () => window.removeEventListener("resize", align)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="section-divider relative overflow-hidden bg-background py-20 md:py-28"
    >
      <SectionShell>
        <SectionIntro
          className="mx-auto mb-14"
          eyebrow={services.badge}
          title={services.title}
          subtitle={services.subtitle}
          align="center"
          tone="dark"
          reveal
        />

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[minmax(12rem,1fr)_minmax(10rem,1fr)_auto] lg:gap-5"
        >
          {services.items.map((service, index) => (
            <m.article
              key={service.title}
              data-bento-card
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={cn("relative overflow-hidden rounded-2xl", bentoLayout[index])}
              style={bentoBackgroundStyle}
            >
              <ServiceCard service={service} />
            </m.article>
          ))}

          <div
            data-bento-card
            className="relative hidden overflow-hidden rounded-2xl lg:col-start-3 lg:col-span-2 lg:row-start-2 lg:row-span-1 lg:flex lg:items-center lg:justify-center"
            style={bentoBackgroundStyle}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(4,29,35,.82), rgba(4,29,35,.35) 70%, transparent 100%)",
              }}
            />
            <Image
              src="/brand/tenaasesores-white.webp"
              alt="tenaasesores"
              width={brand.logoWidth}
              height={brand.logoHeight}
              className="relative z-10 h-auto w-[55%] max-w-[220px]"
            />
          </div>
        </div>
      </SectionShell>
    </section>
  )
}
