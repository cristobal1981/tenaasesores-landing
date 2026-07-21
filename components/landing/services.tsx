"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { m } from "framer-motion"
import { useHomeHorizontalScroll } from "@/components/gsap/use-home-horizontal-scroll"
import { SectionShell } from "@/components/layout/section-shell"
import { ServiceIconBadge } from "@/components/landing/service-icon-badge"
import { services } from "@/content/site"

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useHomeHorizontalScroll({ sectionRef, trackRef })

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="section-divider relative overflow-hidden bg-background"
    >
      <SectionShell className="flex min-h-[100svh] flex-col justify-center py-20 md:py-24">
        <div className="mb-14 max-w-3xl">
          <p className="mb-5 text-[0.72rem] font-semibold tracking-[0.2em] text-primary uppercase">
            {services.badge}
          </p>
          <h2 className="mb-5 text-[clamp(2rem,5vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-on-dark">
            {services.title[0]}
            <br />
            <span className="text-muted-on-dark">{services.title[1]}</span>
          </h2>
          <p className="max-w-[58ch] text-base leading-relaxed text-muted-on-dark sm:text-lg">
            {services.subtitle}
          </p>
        </div>

        <div className="relative w-full overflow-x-auto md:overflow-hidden">
          <div ref={trackRef} className="flex w-max gap-8 pr-24 will-change-transform">
            {services.items.map((service, index) => (
              <m.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="home-service-panel flex w-[min(82vw,420px)] shrink-0 flex-col justify-between"
              >
                <div>
                  <div className="mb-8">
                    <ServiceIconBadge slug={service.slug} size="lg" />
                  </div>
                  <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted-on-dark uppercase">
                    0{index + 1}
                  </p>
                  <h3 className="mb-4 text-2xl leading-tight font-semibold text-on-dark">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-on-dark sm:text-base">
                    {service.description}
                  </p>
                </div>
                <Link
                  href={`/servicios#${service.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-[gap,color] duration-300 hover:gap-3 hover:text-on-dark"
                >
                  Ver detalle
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </m.article>
            ))}
          </div>
        </div>
      </SectionShell>
    </section>
  )
}
