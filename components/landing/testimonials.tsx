"use client"

import { Star, Quote } from "lucide-react"
import { StaggerContainer, StaggerItem, FloatingElement } from "@/components/animations"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { SectionShell } from "@/components/layout/section-shell"
import { testimonials } from "@/content/site"

export function Testimonials() {
  return (
    <section
      id="testimonios"
      className="relative overflow-hidden bg-gradient-to-b from-brisa via-surface-light to-surface-light py-20 md:py-28"
    >
      <FloatingElement
        className="absolute top-20 left-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        duration={11}
      />
      <FloatingElement
        className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-agua/15 blur-3xl"
        duration={9}
        delay={2}
      />

      <SectionShell>
        <MarketingSectionHeading
          badge={testimonials.badge}
          title={testimonials.title}
          subtitle={testimonials.subtitle}
          tone="light"
        />

        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {testimonials.items.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="relative h-full rounded-2xl border border-on-light/10 bg-gradient-to-br from-on-light/5 to-agua/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent-on-light/40 hover:shadow-xl hover:shadow-agua/10">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-accent-on-light/30" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-on-light/90">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3 border-t border-on-light/10 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-on-light/15">
                    <span className="font-semibold text-accent-on-light">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-on-light">{testimonial.name}</div>
                    <div className="text-sm text-muted-on-light">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SectionShell>
    </section>
  )
}
