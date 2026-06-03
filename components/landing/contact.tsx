"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, ArrowRight, Clock, LinkedinIcon, InstagramIcon, Sparkles } from "lucide-react"
import { FadeIn } from "@/components/animations"
import { FaqSection } from "@/components/landing/faq-section"
import { BrisaFormCard, BrisaFormSection, DarkFormPanel } from "@/components/layout/brisa-form-section"
import { contact, faqContact, site } from "@/content/site"
import { contactForm } from "@/content/contact-form"
import {
  canSubmitContactFromClient,
  recordContactClientSubmission,
} from "@/lib/contact/rate-limit"
import { isLikelyValidPhone } from "@/lib/contact/validate-inquiry"
import { cn } from "@/lib/utils"

const socialIcons = {
  LinkedIn: LinkedinIcon,
  Instagram: InstagramIcon,
} as const

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const honeypotId = useId()
  const formStartedAtRef = useRef(Date.now())
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [company, setCompany] = useState("")
  const [formReady, setFormReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setFormReady(true), contactForm.limits.minSubmitDelayMs)
    return () => window.clearTimeout(timer)
  }, [])

  const canSubmit =
    formReady &&
    !isSubmitting &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length >= contactForm.limits.messageMin &&
    company.length === 0

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setErrorMessage(null)
      setSuccessMessage(null)

      if (company.length > 0) {
        setErrorMessage(contactForm.messages.honeypot)
        return
      }

      if (!canSubmit) {
        setErrorMessage(contactForm.messages.validation)
        return
      }

      if (phone.trim().length > 0 && !isLikelyValidPhone(phone)) {
        setErrorMessage(contactForm.messages.phoneInvalid)
        return
      }

      if (!canSubmitContactFromClient()) {
        setErrorMessage(contactForm.messages.rateLimit)
        return
      }

      setIsSubmitting(true)

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            email,
            message,
            company,
            formStartedAt: formStartedAtRef.current,
          }),
        })

        const payload = (await response.json()) as {
          ok?: boolean
          message?: string
          error?: string
        }

        if (response.status === 429 || payload.error === "rate_limit") {
          setErrorMessage(contactForm.messages.rateLimit)
          return
        }

        if (!response.ok || !payload.ok) {
          setErrorMessage(payload.message ?? contactForm.messages.genericError)
          return
        }

        recordContactClientSubmission()
        setSuccessMessage(payload.message ?? contactForm.messages.success)
        setName("")
        setPhone("")
        setEmail("")
        setMessage("")
        formStartedAtRef.current = Date.now()
      } catch {
        setErrorMessage(contactForm.messages.genericError)
      } finally {
        setIsSubmitting(false)
      }
    },
    [canSubmit, company, email, message, name, phone]
  )

  return (
    <BrisaFormSection ref={sectionRef} id="contacto" padding="spacious">
      <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
          <div className="badge-on-light mb-6">
            <span className="badge-label-on-light">{contact.badge}</span>
          </div>
          <h2 className="mb-5 text-3xl leading-[1.15] font-bold text-on-light sm:text-4xl lg:text-5xl">
            {contact.title[0]}
            <br />
            <span className="text-on-light-muted">{contact.title[1]}</span>
          </h2>
          <p className="prose-width mx-auto text-lg leading-relaxed text-muted-on-light">
            {contact.subtitle}
          </p>
      </FadeIn>

      <BrisaFormCard>
        <div className="grid gap-0 lg:grid-cols-12">
          <DarkFormPanel className="border-b border-agua/20 lg:col-span-7 lg:border-r lg:border-b-0">
                  <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-on-dark">{contact.formTitle}</h3>
                      <p className="mt-2 text-sm text-muted-on-dark">
                        Cuéntanos tu caso. Te respondemos con propuesta clara en menos de 24h laborables.
                      </p>
                    </div>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="sr-only" aria-hidden>
                      <label htmlFor={honeypotId}>{contactForm.fields.honeypotLabel}</label>
                      <input
                        id={honeypotId}
                        name="company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-on-dark/95">
                          Nombre completo
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Tu nombre completo"
                          className="input-on-dark"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          maxLength={contactForm.limits.nameMax}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-on-dark/95">
                          Teléfono
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+34 600 000 000"
                          className="input-on-dark"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          maxLength={contactForm.limits.phoneMax}
                          autoComplete="tel"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-on-dark/95">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="input-on-dark"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={contactForm.limits.emailMax}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-on-dark/95">
                        ¿En qué podemos ayudarte?
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Cuéntanos brevemente tu situación..."
                        rows={4}
                        className="input-on-dark resize-none overflow-hidden"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        minLength={contactForm.limits.messageMin}
                        maxLength={contactForm.limits.messageMax}
                        required
                        disabled={isSubmitting}
                        onInput={(event) => {
                          const target = event.currentTarget
                          target.style.height = "auto"
                          target.style.height = `${target.scrollHeight}px`
                        }}
                      />
                    </div>
                    {(errorMessage || successMessage) && (
                      <p
                        role="status"
                        aria-live="polite"
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm",
                          successMessage
                            ? "border-primary/35 bg-primary/10 text-on-dark"
                            : "border-red-400/40 bg-red-500/10 text-on-dark"
                        )}
                      >
                        {successMessage ?? errorMessage}
                      </p>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!canSubmit}
                      className={cn(
                        "w-full",
                        marketingCtaBaseClassName,
                        marketingCtaVariantClassName.primary
                      )}
                    >
                      {isSubmitting ? contactForm.messages.sending : "Enviar consulta"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-center text-xs text-muted-on-dark">
                      Al enviar aceptas la{" "}
                      <Link
                        href="/privacidad"
                        className="text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        política de privacidad
                      </Link>
                      .
                    </p>
                  </form>

                  <div className="mt-6 rounded-xl border border-agua/35 bg-on-dark/8 px-4 py-3 text-center text-sm text-muted-on-dark motion-safe:animate-pulse [animation-duration:4.8s]">
                    ¿Tienes dudas antes de enviar? Mira las preguntas frecuentes justo debajo.
                  </div>
                </DarkFormPanel>
                <div className="relative bg-surface-dark p-6 sm:p-8 lg:col-span-5">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-14 -left-4 h-44 w-44 rounded-full bg-primary/16 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-6 right-6 h-32 w-32 rounded-full bg-turquesa/14 blur-3xl"
                  />
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-on-dark">Canales directos</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-agua/30 bg-on-dark/8 p-4">
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-on-dark uppercase">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/25">
                          <Phone className="h-4 w-4 text-primary motion-safe:animate-pulse" />
                        </span>
                        Teléfono
                      </p>
                      <p className="text-sm font-semibold text-on-dark">{site.phone.display}</p>
                    </div>
                    <div className="rounded-xl border border-agua/30 bg-on-dark/8 p-4">
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-on-dark uppercase">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/25">
                          <Mail className="h-4 w-4 text-primary motion-safe:animate-pulse" />
                        </span>
                        Email
                      </p>
                      <p className="text-sm font-semibold text-on-dark">{site.email}</p>
                    </div>
                    <div className="rounded-xl border border-agua/30 bg-on-dark/8 p-4">
                      <p className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-on-dark uppercase">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/25">
                          <MapPin className="h-4 w-4 text-primary motion-safe:animate-pulse" />
                        </span>
                        Oficina
                      </p>
                      <p className="text-sm font-semibold text-on-dark">
                        C/ El Toscal, 29, 1º pta 7, Los Realejos (Tenerife)
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-on-dark">
                        <Clock className="h-3.5 w-3.5 text-accent-on-light" />
                        <span>Lunes a Viernes · {site.hours.weekdays}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-on-dark">
                        Puede variar por festivos y dias especiales.
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-primary/35 bg-primary/14 p-4">
                    <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold tracking-wide text-on-dark uppercase">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Siguenos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contact.socials
                        .filter((social) => social.label === "LinkedIn" || social.label === "Instagram")
                        .map((social) => {
                          const Icon = socialIcons[social.label as keyof typeof socialIcons]
                          if (!Icon) return null

                          return (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-agua/35 bg-on-dark/10 px-3 py-1.5 text-xs font-semibold text-on-dark transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-light/40"
                              aria-label={social.label}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span>{social.label}</span>
                            </a>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
        </BrisaFormCard>

      <FadeIn delay={0.15} className="mx-auto mt-8 max-w-6xl">
            <div className="rounded-3xl border border-agua/20 bg-white/85 p-6 shadow-lg shadow-agua/8 md:p-8">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold tracking-[0.18em] text-on-light-muted uppercase">
                  Resuelve dudas comunes
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-on-light">Preguntas frecuentes</h3>
              </div>
              <FaqSection
                embedded
                compact
                items={faqContact.items}
                className="mx-auto max-w-none"
              />
            </div>
      </FadeIn>
    </BrisaFormSection>
  )
}
