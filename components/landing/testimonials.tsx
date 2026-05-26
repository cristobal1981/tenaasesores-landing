"use client"

import { Star, Quote } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, FloatingElement } from "@/components/animations"
import { SectionShell } from "@/components/layout/section-shell"
import { testimonials } from "@/content/site"

export function Testimonials() {
  return (
    <section
      id="testimonios"
      className="relative overflow-hidden bg-gradient-to-b from-agua/40 via-background to-background py-20 md:py-28"
    >
      <FloatingElement
        className="absolute top-20 left-10 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
        duration={11}
      />
      <FloatingElement
        className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-agua/30 blur-3xl"
        duration={9}
        delay={2}
      />

      <SectionShell>
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <div className="badge-on-dark mb-6">
            <span className="badge-label-on-dark">{testimonials.badge}</span>
          </div>
          <h2 className="mb-6 text-3xl leading-[1.2] font-bold text-on-dark sm:text-4xl lg:text-5xl">
            {testimonials.title[0]}
            <br />
            <span className="text-muted-on-dark">{testimonials.title[1]}</span>
          </h2>
          <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-dark">
            {testimonials.subtitle}
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {testimonials.items.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="relative h-full rounded-2xl border border-agua/30 bg-gradient-to-br from-card to-agua/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-on-dark/90">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3 border-t border-agua/30 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <span className="font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-on-dark">{testimonial.name}</div>
                    <div className="text-sm text-muted-on-dark">{testimonial.role}</div>
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
