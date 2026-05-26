"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, ArrowRight, Clock } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, FloatingElement } from "@/components/animations"
import { SectionParallaxBackground } from "@/components/landing/section-parallax-background"
import { SectionShell } from "@/components/layout/section-shell"
import { contact, images, site } from "@/content/site"
import { useSectionParallax } from "@/lib/gsap/use-section-parallax"

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    content: site.phone.display,
    action: site.phone.href,
  },
  {
    icon: Mail,
    title: "Email",
    content: site.email,
    action: `mailto:${site.email}`,
  },
  {
    icon: MapPin,
    title: "Oficina",
    content: site.location,
    action: "#",
  },
]

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const parallaxRef = useSectionParallax(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative overflow-hidden bg-surface-light py-20 md:py-28"
    >
      <SectionParallaxBackground
        src={images.contact}
        parallaxRef={parallaxRef}
        imageClassName="opacity-[0.12]"
      />

      <FloatingElement
        className="absolute top-20 right-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        duration={12}
      />

      <SectionShell>
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <div className="badge-on-light mb-6">
            <span className="badge-label-on-light">{contact.badge}</span>
          </div>
          <h2 className="mb-6 text-3xl leading-[1.2] font-bold text-on-light sm:text-4xl lg:text-5xl">
            {contact.title[0]}
            <br />
            <span className="text-on-light-muted">{contact.title[1]}</span>
          </h2>
          <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-light">
            {contact.subtitle}
          </p>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="rounded-2xl border border-agua/30 bg-gradient-to-br from-surface-dark to-agua/80 p-8 shadow-2xl shadow-surface-dark/20">
              <h3 className="mb-6 text-xl font-semibold text-on-dark">{contact.formTitle}</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-on-dark/90">
                      Nombre
                    </label>
                    <Input id="name" name="name" placeholder="Tu nombre" className="input-on-dark" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-on-dark/90">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+34 600 000 000"
                      className="input-on-dark"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-on-dark/90">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="input-on-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-on-dark/90">
                    ¿En qué podemos ayudarte?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Cuéntanos brevemente tu situación..."
                    rows={4}
                    className="input-on-dark resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-semibold transition-transform hover:scale-[1.02]"
                >
                  Enviar consulta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-muted-on-dark">{contact.privacyNote}</p>
              </form>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="flex h-full flex-col justify-center">
              <div className="overflow-hidden rounded-2xl border border-on-light/10 bg-brisa shadow-xl shadow-on-light/5">
                <div className="border-b border-on-light/10 px-6 py-5">
                  <h3 className="text-lg font-semibold text-on-light">Datos de contacto</h3>
                  <p className="mt-1 text-sm text-muted-on-light">
                    Respuesta en menos de 24 horas laborables
                  </p>
                </div>

                <StaggerContainer staggerDelay={0.08}>
                  {contactInfo.map((info, index) => (
                    <StaggerItem key={info.title}>
                      <a
                        href={info.action}
                        className={`group flex items-center gap-4 px-6 py-5 transition-colors duration-200 hover:bg-primary/5 ${
                          index < contactInfo.length - 1 ? "border-b border-on-light/8" : ""
                        }`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 transition-colors group-hover:bg-primary/25">
                          <info.icon className="h-5 w-5 text-accent-on-light" />
                        </div>
                        <div className="min-w-0">
                          <div className="mb-0.5 text-xs font-medium tracking-wide text-on-light-muted uppercase">
                            {info.title}
                          </div>
                          <div className="truncate font-medium text-on-light transition-colors group-hover:text-accent-on-light">
                            {info.content}
                          </div>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-accent-on-light opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </a>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <div className="border-t border-on-light/10 bg-on-light/[0.03] px-6 py-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                      <Clock className="h-5 w-5 text-accent-on-light" />
                    </div>
                    <h4 className="font-semibold text-on-light">Horario de atención</h4>
                  </div>
                  <div className="space-y-2 pl-[52px] text-sm">
                    <div className="flex justify-between gap-4 text-muted-on-light">
                      <span>Lunes - Viernes</span>
                      <span className="text-right font-medium text-on-light">
                        {site.hours.weekdays}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-on-light">
                      <span>Sábados y Domingos</span>
                      <span className="text-on-light-muted">{site.hours.weekend}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </SectionShell>
    </section>
  )
}
