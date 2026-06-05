"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { LazyMotion, AnimatePresence, domAnimation, m, useReducedMotion } from "framer-motion"
import { HoneypotField } from "@/components/forms/honeypot-field"
import { ContactChannelCard } from "@/components/landing/contact-channel-card"
import { MarketingButton } from "@/components/ui/marketing-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, ArrowRight, Clock, LinkedinIcon, InstagramIcon, Sparkles } from "lucide-react"
import { FadeIn } from "@/components/animations"
import { FaqAccordionList } from "@/components/faq/faq-accordion-list"
import { BrisaFormCard, BrisaFormSection, DarkFormPanel } from "@/components/layout/brisa-form-section"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { contact, faqContact, site } from "@/content/site"
import { faqHref } from "@/content/faq"
import { contactForm } from "@/content/contact-form"
import {
  canSubmitContactFromClient,
  recordContactClientSubmission,
} from "@/lib/contact/rate-limit"
import { FieldLabel } from "@/components/forms/field-label"
import { FormStatusMessage } from "@/components/forms/form-status-message"
import { FormSubmissionSuccess } from "@/components/forms/form-submission-success"
import {
  formSubmitStubDelayMs,
  isFormSubmitStubEnabled,
} from "@/lib/forms/form-submit-stub"
import { resolveFormApiErrorMessage, type FormApiPayload } from "@/lib/forms/form-api-response"
import { isLikelyValidPhone } from "@/lib/contact/validate-inquiry"
import { formExitMs, formStepEase } from "@/lib/forms/motion-tokens"

const socialIcons = {
  LinkedIn: LinkedinIcon,
  Instagram: InstagramIcon,
} as const

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
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
  const successFocusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setFormReady(true), contactForm.limits.minSubmitDelayMs)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!successMessage) return

    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => {
      const node = successFocusRef.current
      if (!node) return
      node.scrollIntoView({
        behavior: motionReduced ? "auto" : "smooth",
        block: "center",
      })
      node.focus({ preventScroll: true })
    }, motionReduced ? 0 : 1100)

    return () => window.clearTimeout(timer)
  }, [successMessage])

  const phoneValid = isLikelyValidPhone(phone)

  const formSubmitStub = isFormSubmitStubEnabled()

  const canSubmit =
    formSubmitStub ||
    (formReady &&
      !isSubmitting &&
      name.trim().length > 0 &&
      phoneValid &&
      email.trim().length > 0 &&
      message.trim().length >= contactForm.limits.messageMin &&
      company.length === 0)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setErrorMessage(null)
      setSuccessMessage(null)

      if (formSubmitStub) {
        setIsSubmitting(true)
        await new Promise((resolve) => window.setTimeout(resolve, formSubmitStubDelayMs))
        setSuccessMessage(contactForm.success.body)
        formStartedAtRef.current = Date.now()
        setIsSubmitting(false)
        return
      }

      if (company.length > 0) {
        setErrorMessage(contactForm.messages.honeypot)
        return
      }

      if (!canSubmit) {
        setErrorMessage(contactForm.messages.validation)
        return
      }

      if (phone.trim() && !isLikelyValidPhone(phone)) {
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

        const payload = (await response.json()) as FormApiPayload

        const apiError = resolveFormApiErrorMessage(response, payload, {
          rateLimit: contactForm.messages.rateLimit,
          duplicateLead: contactForm.messages.duplicateLead,
          webhookForbidden: contactForm.messages.webhookForbidden,
          generic: contactForm.messages.genericError,
          validation: contactForm.messages.validation,
        })

        if (apiError) {
          setErrorMessage(apiError)
          return
        }

        recordContactClientSubmission()
        setSuccessMessage(payload.message ?? contactForm.success.body)
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
    [canSubmit, company, email, formSubmitStub, message, name, phone]
  )

  return (
    <BrisaFormSection ref={sectionRef} id="contacto" padding="spacious">
      <MarketingSectionHeading
        badge={contact.badge}
        title={contact.title}
        subtitle={contact.subtitle}
        tone="light"
        size="page"
        className="mb-14 max-w-3xl"
      />

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

                  <LazyMotion features={domAnimation} strict>
                  <AnimatePresence mode="wait" initial={false}>
                  {successMessage ? (
                    <div
                      ref={successFocusRef}
                      tabIndex={-1}
                      className="outline-none"
                      key="contact-form-success"
                    >
                      <FormSubmissionSuccess
                        title={contactForm.success.title}
                        body={successMessage}
                        doneLabel={contactForm.success.doneLabel}
                        progressSegments={1}
                      />
                    </div>
                  ) : (
                  <m.form
                    key="contact-form"
                    className="space-y-5"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : formExitMs, ease: formStepEase }}
                  >
                    <HoneypotField
                      id={honeypotId}
                      label={contactForm.fields.honeypotLabel}
                      value={company}
                      onChange={setCompany}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <FieldLabel htmlFor="name" required>
                          Nombre completo
                        </FieldLabel>
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
                        <FieldLabel htmlFor="phone">
                          {contactForm.fields.phoneLabel}
                        </FieldLabel>
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
                      <FieldLabel htmlFor="email" required>
                        Email
                      </FieldLabel>
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
                      <FieldLabel htmlFor="message" required>
                        ¿En qué podemos ayudarte?
                      </FieldLabel>
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
                    {errorMessage ? (
                      <FormStatusMessage variant="error">{errorMessage}</FormStatusMessage>
                    ) : null}
                    <MarketingButton
                      type="submit"
                      size="lg"
                      disabled={formSubmitStub ? isSubmitting : !canSubmit}
                      className="w-full"
                    >
                      {isSubmitting ? contactForm.messages.sending : "Enviar consulta"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </MarketingButton>
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
                  </m.form>
                  )}
                  </AnimatePresence>
                  </LazyMotion>

                  {!successMessage ? (
                  <div className="mt-6 rounded-xl border border-agua/35 bg-on-dark/8 px-4 py-3 text-center text-sm text-muted-on-dark motion-safe:animate-pulse [animation-duration:4.8s]">
                    ¿Tienes dudas antes de enviar? Mira las preguntas frecuentes justo debajo.
                  </div>
                  ) : null}
                </DarkFormPanel>
                <DarkFormPanel className="lg:col-span-5">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-on-dark">Canales directos</h3>
                  </div>

                  <div className="space-y-3">
                    <ContactChannelCard icon={Phone} label="Teléfono">
                      <p className="text-sm font-semibold text-on-dark">{site.phone.display}</p>
                    </ContactChannelCard>
                    <ContactChannelCard icon={Mail} label="Email">
                      <p className="text-sm font-semibold text-on-dark">{site.email}</p>
                    </ContactChannelCard>
                    <ContactChannelCard icon={MapPin} label="Oficina">
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
                    </ContactChannelCard>
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
                </DarkFormPanel>
              </div>
        </BrisaFormCard>

      <FadeIn delay={0.15} className="mx-auto mt-8 max-w-6xl">
            <div className="rounded-3xl border border-agua/20 bg-white/85 p-6 shadow-lg shadow-agua/8 md:p-8">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold tracking-[0.18em] text-on-light-muted uppercase">
                  Resuelve dudas comunes
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-on-light">Preguntas frecuentes</h3>
                <Link
                  href={`${faqHref}#contacto`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  Ver todas las preguntas
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <FaqAccordionList
                items={faqContact.items}
                sectionLabel={faqContact.title}
                defaultOpenIndex={-1}
              />
            </div>
      </FadeIn>
    </BrisaFormSection>
  )
}
