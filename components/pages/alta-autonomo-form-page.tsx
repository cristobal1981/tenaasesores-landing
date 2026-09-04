"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { LazyMotion, AnimatePresence, domAnimation, m, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { DarkFormField } from "@/components/forms/dark-form-field"
import { FieldErrorText } from "@/components/forms/field-error-text"
import { FieldHelpTooltip } from "@/components/forms/field-help-tooltip"
import { HoneypotField } from "@/components/forms/honeypot-field"
import { FormStatusMessage } from "@/components/forms/form-status-message"
import { FormSubmissionSuccess } from "@/components/forms/form-submission-success"
import { AltaAutonomoFaqSection } from "@/components/pages/alta-autonomo-faq-section"
import { MarketingButton } from "@/components/ui/marketing-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BrisaFormCard, BrisaFormSection, DarkFormPanel } from "@/components/layout/brisa-form-section"
import { MarketingSectionHeading } from "@/components/layout/marketing-section-heading"
import { altaAutonomoFormContent, altaAutonomoYesNoOptions } from "@/content/alta-autonomo-form"
import { legalRoutes } from "@/content/legal"
import {
  getAltaAutonomoStepValidationError,
  getAltaAutonomoValidationIssues,
  isAltaAutonomoFormComplete,
  type AltaAutonomoStepValues,
  type AltaAutonomoSubmissionPayload,
} from "@/lib/alta-autonomo/validate-submission"
import {
  clearAltaAutonomoFormDraft,
  readAltaAutonomoFormDraft,
  writeAltaAutonomoFormDraft,
  type AltaAutonomoFormDraft,
} from "@/lib/alta-autonomo/form-draft-storage"
import type { OnboardingAddressCatalog } from "@/lib/alta-autonomo/onboarding-catalog"
import { getCountryDisplayName } from "@/lib/alta-autonomo/country-display-names"
import { formStepEase } from "@/lib/forms/motion-tokens"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 4

const STEP_FIELDS: Record<number, string[]> = {
  1: ["nombre", "apellidos", "nif", "naf", "fecha_nacimiento", "telefono", "email"],
  2: [
    "certificado_digital",
    "ya_eres_autonomo",
    "fecha_alta",
    "fecha_dar_alta",
    "fuiste_autonomo_3_anos",
    "fecha_baja",
    "fecha_empezar_con_nosotros",
  ],
  3: [
    "direccion",
    "ciudad",
    "provincia",
    "codigo_postal",
    "pais",
    "direccion_fiscal",
    "ciudad_fiscal",
    "provincia_fiscal",
    "codigo_postal_fiscal",
    "direccion_notificacion",
    "ciudad_notificacion",
    "provincia_notificacion",
    "codigo_postal_notificacion",
  ],
  4: ["actividad", "ingresos_anuales", "iban", "comentarios", "privacidad"],
}

function stepForField(field: string): number {
  for (const [step, fields] of Object.entries(STEP_FIELDS)) {
    if (fields.includes(field)) return Number(step)
  }
  return TOTAL_STEPS
}

/** Junta calle, CP+ciudad y provincia en una única línea de texto libre (para x_direccion_fiscal / x_direccion_notificacion). */
function formatFullAddress(street: string, postalCode: string, city: string, provinceName: string): string {
  const postalAndCity = [postalCode.trim(), city.trim()].filter((part) => part.length > 0).join(" ")
  return [street.trim(), postalAndCity, provinceName.trim()]
    .filter((part) => part.length > 0)
    .join(", ")
}

const darkSelectClassName =
  "select-on-dark h-9 w-full rounded-md border px-3 py-1 text-base md:text-sm"

const stepEnterMs = 0.28
const stepExitMs = 0.2
const stepHeightMs = 0.34
const stepEase = formStepEase
const stepMotion = { duration: stepEnterMs, ease: stepEase } as const
const stepExitMotion = { duration: stepExitMs, ease: stepEase } as const
const stepHeightMotion = { duration: stepHeightMs, ease: stepEase } as const

type AltaAutonomoFormPageProps = {
  token: string
  initialEmail?: string
  addressCatalog: OnboardingAddressCatalog
}

function isStoredOdooId(value: string): boolean {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0
}

function formatProgressLabel(current: number) {
  return altaAutonomoFormContent.steps.progressLabel
    .replace("{current}", String(current))
    .replace("{total}", String(TOTAL_STEPS))
}

function AltaAutonomoStepTransition({
  step,
  reducedMotion,
  children,
}: {
  step: number
  reducedMotion: boolean | null
  children: ReactNode
}) {
  const measureRef = useRef<HTMLDivElement>(null)
  const lastStableHeightRef = useRef(0)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    const node = measureRef.current
    if (!node) return

    const updateHeight = () => {
      const next = node.offsetHeight
      if (next > 0) {
        lastStableHeightRef.current = next
        setHeight(next)
        return
      }
      if (lastStableHeightRef.current > 0) {
        setHeight(lastStableHeightRef.current)
      }
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)
    return () => observer.disconnect()
  }, [step])

  const motionDisabled = reducedMotion === true

  return (
    <m.div
      initial={false}
      animate={{ height: motionDisabled ? "auto" : height }}
      transition={motionDisabled ? { duration: 0 } : stepHeightMotion}
    >
      <div ref={measureRef}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={step}
            className="w-full min-w-0"
            initial={motionDisabled ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={motionDisabled ? undefined : { opacity: 0, y: -6, transition: stepExitMotion }}
            transition={motionDisabled ? { duration: 0 } : stepMotion}
            style={{ willChange: motionDisabled ? undefined : "opacity, transform" }}
          >
            {children}
          </m.div>
        </AnimatePresence>
      </div>
    </m.div>
  )
}

export function AltaAutonomoFormPage({
  token,
  initialEmail,
  addressCatalog,
}: AltaAutonomoFormPageProps) {
  const defaultCountryId = String(addressCatalog.defaultCountryId)
  const honeypotId = useId()
  const formStartedAtRef = useRef(0)
  const successFocusRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const [step, setStep] = useState(1)
  const [nombre, setNombre] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [nif, setNif] = useState("")
  const [naf, setNaf] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [telefono, setTelefono] = useState("+34 ")
  const [email, setEmail] = useState(initialEmail ?? "")
  const [certificadoDigital, setCertificadoDigital] = useState<"" | "si" | "no">("")
  const [yaEresAutonomo, setYaEresAutonomo] = useState<"" | "si" | "no">("")
  const [fechaAlta, setFechaAlta] = useState("")
  const [fechaDarAlta, setFechaDarAlta] = useState("")
  const [fuisteAutonomo3Anos, setFuisteAutonomo3Anos] = useState<"" | "si" | "no">("")
  const [fechaBaja, setFechaBaja] = useState("")
  const [fechaEmpezarConNosotros, setFechaEmpezarConNosotros] = useState("")
  const [direccion, setDireccion] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [provincia, setProvincia] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [pais, setPais] = useState(defaultCountryId)
  const [direccionFiscalIgualDomicilio, setDireccionFiscalIgualDomicilio] = useState(true)
  const [direccionFiscal, setDireccionFiscal] = useState("")
  const [ciudadFiscal, setCiudadFiscal] = useState("")
  const [provinciaFiscal, setProvinciaFiscal] = useState("")
  const [codigoPostalFiscal, setCodigoPostalFiscal] = useState("")
  const [direccionNotificacionIgualFiscal, setDireccionNotificacionIgualFiscal] = useState(true)
  const [direccionNotificacion, setDireccionNotificacion] = useState("")
  const [ciudadNotificacion, setCiudadNotificacion] = useState("")
  const [provinciaNotificacion, setProvinciaNotificacion] = useState("")
  const [codigoPostalNotificacion, setCodigoPostalNotificacion] = useState("")
  const [actividad, setActividad] = useState("")
  const [ingresosAnuales, setIngresosAnuales] = useState("")
  const [iban, setIban] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [company, setCompany] = useState("")

  const [formReady, setFormReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [draftHydrated, setDraftHydrated] = useState(false)

  const visibleProvinces = useMemo(
    () => addressCatalog.provinces.filter((province) => String(province.countryId) === pais),
    [addressCatalog.provinces, pais]
  )

  const resolveProvinceName = useCallback(
    (id: string) => addressCatalog.provinces.find((item) => String(item.id) === id)?.name ?? "",
    [addressCatalog.provinces]
  )

  // Hidratación del borrador diferida a un tick: evita setState síncrono en efecto.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const draft = readAltaAutonomoFormDraft(token)
      if (draft) {
        setStep(draft.step)
        setNombre(draft.nombre)
        setApellidos(draft.apellidos)
        setNif(draft.nif)
        setNaf(draft.naf)
        setFechaNacimiento(draft.fechaNacimiento)
        setTelefono(draft.telefono || "+34 ")
        setEmail(draft.email || initialEmail || "")
        setCertificadoDigital(draft.certificadoDigital)
        setYaEresAutonomo(draft.yaEresAutonomo)
        setFechaAlta(draft.fechaAlta)
        setFechaDarAlta(draft.fechaDarAlta)
        setFuisteAutonomo3Anos(draft.fuisteAutonomo3Anos)
        setFechaBaja(draft.fechaBaja)
        setFechaEmpezarConNosotros(draft.fechaEmpezarConNosotros)
        setDireccion(draft.direccion)
        setCiudad(draft.ciudad)
        setProvincia(isStoredOdooId(draft.provincia) ? draft.provincia : "")
        setCodigoPostal(draft.codigoPostal)
        setPais(isStoredOdooId(draft.pais) ? draft.pais : defaultCountryId)
        setDireccionFiscalIgualDomicilio(draft.direccionFiscalIgualDomicilio)
        setDireccionFiscal(draft.direccionFiscal)
        setCiudadFiscal(draft.ciudadFiscal)
        setProvinciaFiscal(isStoredOdooId(draft.provinciaFiscal) ? draft.provinciaFiscal : "")
        setCodigoPostalFiscal(draft.codigoPostalFiscal)
        setDireccionNotificacionIgualFiscal(draft.direccionNotificacionIgualFiscal)
        setDireccionNotificacion(draft.direccionNotificacion)
        setCiudadNotificacion(draft.ciudadNotificacion)
        setProvinciaNotificacion(
          isStoredOdooId(draft.provinciaNotificacion) ? draft.provinciaNotificacion : ""
        )
        setCodigoPostalNotificacion(draft.codigoPostalNotificacion)
        setActividad(draft.actividad)
        setIngresosAnuales(draft.ingresosAnuales)
        setIban(draft.iban)
        setComentarios(draft.comentarios)
        setPrivacyAccepted(draft.privacyAccepted)
      }
      setDraftHydrated(true)
    }, 0)
    return () => window.clearTimeout(id)
  }, [token, initialEmail, defaultCountryId])

  useEffect(() => {
    formStartedAtRef.current = Date.now()
    const timer = window.setTimeout(
      () => setFormReady(true),
      altaAutonomoFormContent.limits.minSubmitDelayMs
    )
    return () => window.clearTimeout(timer)
  }, [])

  const formDraft = useMemo<AltaAutonomoFormDraft>(
    () => ({
      step,
      nombre,
      apellidos,
      nif,
      naf,
      fechaNacimiento,
      telefono,
      email,
      certificadoDigital,
      yaEresAutonomo,
      fechaAlta,
      fechaDarAlta,
      fuisteAutonomo3Anos,
      fechaBaja,
      fechaEmpezarConNosotros,
      direccion,
      ciudad,
      provincia,
      codigoPostal,
      pais,
      direccionFiscalIgualDomicilio,
      direccionFiscal,
      ciudadFiscal,
      provinciaFiscal,
      codigoPostalFiscal,
      direccionNotificacionIgualFiscal,
      direccionNotificacion,
      ciudadNotificacion,
      provinciaNotificacion,
      codigoPostalNotificacion,
      actividad,
      ingresosAnuales,
      iban,
      comentarios,
      privacyAccepted,
    }),
    [
      step,
      nombre,
      apellidos,
      nif,
      naf,
      fechaNacimiento,
      telefono,
      email,
      certificadoDigital,
      yaEresAutonomo,
      fechaAlta,
      fechaDarAlta,
      fuisteAutonomo3Anos,
      fechaBaja,
      fechaEmpezarConNosotros,
      direccion,
      ciudad,
      provincia,
      codigoPostal,
      pais,
      direccionFiscalIgualDomicilio,
      direccionFiscal,
      ciudadFiscal,
      provinciaFiscal,
      codigoPostalFiscal,
      direccionNotificacionIgualFiscal,
      direccionNotificacion,
      ciudadNotificacion,
      provinciaNotificacion,
      codigoPostalNotificacion,
      actividad,
      ingresosAnuales,
      iban,
      comentarios,
      privacyAccepted,
    ]
  )

  useEffect(() => {
    if (!draftHydrated || successMessage) return
    writeAltaAutonomoFormDraft(token, formDraft)
  }, [draftHydrated, formDraft, successMessage, token])

  useEffect(() => {
    if (!successMessage) return

    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(
      () => {
        const node = successFocusRef.current
        if (!node) return
        node.scrollIntoView({
          behavior: motionReduced ? "auto" : "smooth",
          block: "center",
        })
        node.focus({ preventScroll: true })
      },
      motionReduced ? 0 : 1100
    )

    return () => window.clearTimeout(timer)
  }, [successMessage])

  const stepValues: AltaAutonomoStepValues = useMemo(
    () => ({
      nombre,
      apellidos,
      nif,
      naf,
      fechaNacimiento,
      telefono,
      email,
      certificadoDigital,
      yaEresAutonomo,
      fechaAlta,
      fechaDarAlta,
      fuisteAutonomo3Anos,
      fechaBaja,
      fechaEmpezarConNosotros,
      direccion,
      ciudad,
      provincia,
      codigoPostal,
      pais,
      direccionFiscalIgualDomicilio,
      direccionFiscal,
      ciudadFiscal,
      provinciaFiscal,
      codigoPostalFiscal,
      direccionNotificacionIgualFiscal,
      direccionNotificacion,
      ciudadNotificacion,
      provinciaNotificacion,
      codigoPostalNotificacion,
      actividad,
      ingresosAnuales,
      iban,
      comentarios,
      privacyAccepted,
    }),
    [
      nombre,
      apellidos,
      nif,
      naf,
      fechaNacimiento,
      telefono,
      email,
      certificadoDigital,
      yaEresAutonomo,
      fechaAlta,
      fechaDarAlta,
      fuisteAutonomo3Anos,
      fechaBaja,
      fechaEmpezarConNosotros,
      direccion,
      ciudad,
      provincia,
      codigoPostal,
      pais,
      direccionFiscalIgualDomicilio,
      direccionFiscal,
      ciudadFiscal,
      provinciaFiscal,
      codigoPostalFiscal,
      direccionNotificacionIgualFiscal,
      direccionNotificacion,
      ciudadNotificacion,
      provinciaNotificacion,
      codigoPostalNotificacion,
      actividad,
      ingresosAnuales,
      iban,
      comentarios,
      privacyAccepted,
    ]
  )

  const isCurrentStepComplete = useMemo(
    () => getAltaAutonomoStepValidationError(step, stepValues) === null,
    [step, stepValues]
  )
  const isFinalStepComplete = useMemo(
    () => getAltaAutonomoStepValidationError(TOTAL_STEPS, stepValues) === null,
    [stepValues]
  )

  const focusField = (field: string) => {
    const node = document.getElementById(field)
    if (!node) return
    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    node.scrollIntoView({ behavior: motionReduced ? "auto" : "smooth", block: "center" })
    node.focus({ preventScroll: true })
  }

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleNext = () => {
    const error = getAltaAutonomoStepValidationError(step, stepValues)
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [error.field]: error.message }))
      focusField(error.field)
      return
    }
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return
    if (event.target instanceof HTMLTextAreaElement) return
    event.preventDefault()
    if (step < TOTAL_STEPS && isCurrentStepComplete) {
      handleNext()
    }
  }

  // La dirección fiscal y de notificación viajan a Odoo como una única línea de texto
  // (x_direccion_fiscal / x_direccion_notificacion), no como campos sueltos.
  const domicilioAddressText = useMemo(
    () => formatFullAddress(direccion, codigoPostal, ciudad, resolveProvinceName(provincia)),
    [direccion, codigoPostal, ciudad, provincia, resolveProvinceName]
  )

  const direccionFiscalText = useMemo(
    () =>
      direccionFiscalIgualDomicilio
        ? domicilioAddressText
        : formatFullAddress(
            direccionFiscal,
            codigoPostalFiscal,
            ciudadFiscal,
            resolveProvinceName(provinciaFiscal)
          ),
    [
      direccionFiscalIgualDomicilio,
      domicilioAddressText,
      direccionFiscal,
      codigoPostalFiscal,
      ciudadFiscal,
      provinciaFiscal,
      resolveProvinceName,
    ]
  )

  const direccionNotificacionText = useMemo(
    () =>
      direccionNotificacionIgualFiscal
        ? direccionFiscalText
        : formatFullAddress(
            direccionNotificacion,
            codigoPostalNotificacion,
            ciudadNotificacion,
            resolveProvinceName(provinciaNotificacion)
          ),
    [
      direccionNotificacionIgualFiscal,
      direccionFiscalText,
      direccionNotificacion,
      codigoPostalNotificacion,
      ciudadNotificacion,
      provinciaNotificacion,
      resolveProvinceName,
    ]
  )

  const payload = useMemo<AltaAutonomoSubmissionPayload>(
    () => ({
      token,
      nombre,
      apellidos,
      nif,
      naf,
      fecha_nacimiento: fechaNacimiento,
      telefono,
      email,
      certificado_digital: certificadoDigital,
      ya_eres_autonomo: yaEresAutonomo,
      fecha_alta: fechaAlta,
      fecha_dar_alta: fechaDarAlta,
      fuiste_autonomo_3_anos: fuisteAutonomo3Anos,
      fecha_baja: fechaBaja,
      fecha_empezar_con_nosotros: fechaEmpezarConNosotros,
      direccion,
      ciudad,
      provincia,
      codigo_postal: codigoPostal,
      pais,
      direccion_fiscal: direccionFiscalText,
      direccion_notificacion: direccionNotificacionText,
      actividad,
      ingresos_anuales: ingresosAnuales,
      iban,
      comentarios,
      privacidad: privacyAccepted,
      company,
    }),
    [
      token,
      nombre,
      apellidos,
      nif,
      naf,
      fechaNacimiento,
      telefono,
      email,
      certificadoDigital,
      yaEresAutonomo,
      fechaAlta,
      fechaDarAlta,
      fuisteAutonomo3Anos,
      fechaBaja,
      fechaEmpezarConNosotros,
      direccion,
      ciudad,
      provincia,
      codigoPostal,
      pais,
      direccionFiscalText,
      direccionNotificacionText,
      actividad,
      ingresosAnuales,
      iban,
      comentarios,
      privacyAccepted,
      company,
    ]
  )

  const canSubmit =
    formReady && !isSubmitting && company.length === 0 && isAltaAutonomoFormComplete(payload)

  const markFieldErrors = (issues: ReturnType<typeof getAltaAutonomoValidationIssues>) => {
    const next: Record<string, string> = {}
    for (const issue of issues) {
      next[issue.field] = issue.message
    }
    setFieldErrors(next)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (company.length > 0) {
      setErrorMessage(altaAutonomoFormContent.messages.honeypot)
      return
    }

    // formStartedAt se añade aquí (event handler): las reglas de React prohíben leer refs en render.
    const submission: AltaAutonomoSubmissionPayload = {
      ...payload,
      formStartedAt: formStartedAtRef.current,
    }

    const issues = getAltaAutonomoValidationIssues(submission)
    markFieldErrors(issues)

    if (issues.length > 0) {
      setErrorMessage(altaAutonomoFormContent.messages.validation)
      const firstField = issues[0].field
      const targetStep = stepForField(firstField)
      if (targetStep !== step) {
        setStep(targetStep)
        window.setTimeout(() => focusField(firstField), 400)
      } else {
        focusField(firstField)
      }
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/solicitud-alta-autonomo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })

      const apiPayload = (await response.json()) as {
        ok?: boolean
        message?: string
        fieldErrors?: Record<string, string>
      }

      if (!response.ok || apiPayload.ok === false) {
        if (apiPayload.fieldErrors) {
          setFieldErrors(apiPayload.fieldErrors)
        }
        setErrorMessage(apiPayload.message ?? altaAutonomoFormContent.submitErrors.unavailable)
        return
      }

      setFieldErrors({})
      setSuccessMessage(apiPayload.message ?? altaAutonomoFormContent.success.body)
      clearAltaAutonomoFormDraft(token)
      formStartedAtRef.current = Date.now()
    } catch {
      setErrorMessage(altaAutonomoFormContent.messages.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <fieldset className="w-full space-y-4">
          <legend className="text-base font-semibold text-on-dark">
            {altaAutonomoFormContent.step1.title}
          </legend>
          <p className="max-w-prose text-sm text-muted-on-dark">
            {altaAutonomoFormContent.step1.description}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkFormField
              name="nombre"
              label={altaAutonomoFormContent.fields.nombre}
              required
              error={fieldErrors.nombre}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  className="input-on-dark"
                  value={nombre}
                  onChange={(event) => {
                    setNombre(event.target.value)
                    clearFieldError("nombre")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.nombre}
                  maxLength={altaAutonomoFormContent.limits.nombreMax}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
            <DarkFormField
              name="apellidos"
              label={altaAutonomoFormContent.fields.apellidos}
              required
              error={fieldErrors.apellidos}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  className="input-on-dark"
                  value={apellidos}
                  onChange={(event) => {
                    setApellidos(event.target.value)
                    clearFieldError("apellidos")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.apellidos}
                  maxLength={altaAutonomoFormContent.limits.apellidosMax}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkFormField
              name="nif"
              label={altaAutonomoFormContent.fields.nif}
              required
              error={fieldErrors.nif}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  className="input-on-dark"
                  value={nif}
                  onChange={(event) => {
                    setNif(event.target.value)
                    clearFieldError("nif")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.nif}
                  maxLength={altaAutonomoFormContent.limits.nifMax}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
            <DarkFormField
              name="naf"
              label={altaAutonomoFormContent.fields.naf}
              labelAddon={
                <FieldHelpTooltip
                  label={altaAutonomoFormContent.help.naf.triggerLabel}
                  title={altaAutonomoFormContent.help.naf.title}
                >
                  {altaAutonomoFormContent.help.naf.body}
                </FieldHelpTooltip>
              }
              error={fieldErrors.naf}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  className="input-on-dark"
                  value={naf}
                  onChange={(event) => {
                    setNaf(event.target.value)
                    clearFieldError("naf")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.naf}
                  maxLength={altaAutonomoFormContent.limits.nafMax}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkFormField
              name="fecha_nacimiento"
              label={altaAutonomoFormContent.fields.fecha_nacimiento}
              required
              error={fieldErrors.fecha_nacimiento}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  type="date"
                  className="input-on-dark"
                  value={fechaNacimiento}
                  onChange={(event) => {
                    setFechaNacimiento(event.target.value)
                    clearFieldError("fecha_nacimiento")
                  }}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
            <DarkFormField
              name="telefono"
              label={altaAutonomoFormContent.fields.telefono}
              required
              error={fieldErrors.telefono}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  className="input-on-dark"
                  value={telefono}
                  onChange={(event) => {
                    setTelefono(event.target.value)
                    clearFieldError("telefono")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.telefono}
                  maxLength={altaAutonomoFormContent.limits.telefonoMax}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
          </div>

          <DarkFormField
            name="email"
            label={altaAutonomoFormContent.fields.email}
            required
            error={fieldErrors.email}
          >
            {({ id, invalid, describedBy }) => (
              <Input
                id={id}
                type="email"
                className="input-on-dark"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  clearFieldError("email")
                }}
                placeholder={altaAutonomoFormContent.placeholders.email}
                maxLength={altaAutonomoFormContent.limits.emailMax}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </DarkFormField>
        </fieldset>
      )
    }

    if (step === 2) {
      return (
        <fieldset className="w-full space-y-4">
          <legend className="text-base font-semibold text-on-dark">
            {altaAutonomoFormContent.step2.title}
          </legend>
          <p className="max-w-prose text-sm text-muted-on-dark">
            {altaAutonomoFormContent.step2.description}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkFormField
              name="certificado_digital"
              label={altaAutonomoFormContent.fields.certificado_digital}
              required
              error={fieldErrors.certificado_digital}
            >
              {({ id, invalid, describedBy }) => (
                <select
                  id={id}
                  className={darkSelectClassName}
                  value={certificadoDigital}
                  onChange={(event) => {
                    setCertificadoDigital(event.target.value as "si" | "no" | "")
                    clearFieldError("certificado_digital")
                  }}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                >
                  <option value="">Selecciona</option>
                  {altaAutonomoYesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </DarkFormField>
            <DarkFormField
              name="ya_eres_autonomo"
              label={altaAutonomoFormContent.fields.ya_eres_autonomo}
              required
              error={fieldErrors.ya_eres_autonomo}
            >
              {({ id, invalid, describedBy }) => (
                <select
                  id={id}
                  className={darkSelectClassName}
                  value={yaEresAutonomo}
                  onChange={(event) => {
                    const nextValue = event.target.value as "si" | "no" | ""
                    setYaEresAutonomo(nextValue)
                    if (nextValue !== "si") {
                      setFechaAlta("")
                    }
                    if (nextValue !== "no") {
                      setFechaDarAlta("")
                      setFuisteAutonomo3Anos("")
                      setFechaBaja("")
                    }
                    clearFieldError("ya_eres_autonomo")
                  }}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                >
                  <option value="">Selecciona</option>
                  {altaAutonomoYesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </DarkFormField>
          </div>

          {yaEresAutonomo === "si" ? (
            <DarkFormField
              name="fecha_alta"
              label={altaAutonomoFormContent.fields.fecha_alta}
              required
              error={fieldErrors.fecha_alta}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  type="date"
                  className="input-on-dark"
                  value={fechaAlta}
                  onChange={(event) => {
                    setFechaAlta(event.target.value)
                    clearFieldError("fecha_alta")
                  }}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
          ) : null}

          {yaEresAutonomo === "no" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <DarkFormField
                  name="fecha_dar_alta"
                  label={altaAutonomoFormContent.fields.fecha_dar_alta}
                  required
                  error={fieldErrors.fecha_dar_alta}
                >
                  {({ id, invalid, describedBy }) => (
                    <Input
                      id={id}
                      type="date"
                      className="input-on-dark"
                      value={fechaDarAlta}
                      onChange={(event) => {
                        setFechaDarAlta(event.target.value)
                        clearFieldError("fecha_dar_alta")
                      }}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>
                <DarkFormField
                  name="fuiste_autonomo_3_anos"
                  label={altaAutonomoFormContent.fields.fuiste_autonomo_3_anos}
                  required
                  error={fieldErrors.fuiste_autonomo_3_anos}
                >
                  {({ id, invalid, describedBy }) => (
                    <select
                      id={id}
                      className={darkSelectClassName}
                      value={fuisteAutonomo3Anos}
                      onChange={(event) => {
                        const nextValue = event.target.value as "si" | "no" | ""
                        setFuisteAutonomo3Anos(nextValue)
                        if (nextValue !== "si") setFechaBaja("")
                        clearFieldError("fuiste_autonomo_3_anos")
                      }}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    >
                      <option value="">Selecciona</option>
                      {altaAutonomoYesNoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </DarkFormField>
              </div>
              {fuisteAutonomo3Anos === "si" ? (
                <DarkFormField
                  name="fecha_baja"
                  label={altaAutonomoFormContent.fields.fecha_baja}
                  required
                  error={fieldErrors.fecha_baja}
                >
                  {({ id, invalid, describedBy }) => (
                    <Input
                      id={id}
                      type="date"
                      className="input-on-dark"
                      value={fechaBaja}
                      onChange={(event) => {
                        setFechaBaja(event.target.value)
                        clearFieldError("fecha_baja")
                      }}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>
              ) : null}
            </>
          ) : null}

          <DarkFormField
            name="fecha_empezar_con_nosotros"
            label={altaAutonomoFormContent.fields.fecha_empezar_con_nosotros}
            required
            error={fieldErrors.fecha_empezar_con_nosotros}
          >
            {({ id, invalid, describedBy }) => (
              <Input
                id={id}
                type="date"
                className="input-on-dark"
                value={fechaEmpezarConNosotros}
                onChange={(event) => {
                  setFechaEmpezarConNosotros(event.target.value)
                  clearFieldError("fecha_empezar_con_nosotros")
                }}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </DarkFormField>
        </fieldset>
      )
    }

    if (step === 3) {
      return (
        <fieldset className="w-full space-y-4">
          <legend className="text-base font-semibold text-on-dark">
            {altaAutonomoFormContent.step3.title}
          </legend>
          <p className="max-w-prose text-sm text-muted-on-dark">
            {altaAutonomoFormContent.step3.description}
          </p>

          <DarkFormField
            name="direccion"
            label={altaAutonomoFormContent.fields.direccion}
            required
            error={fieldErrors.direccion}
          >
            {({ id, invalid, describedBy }) => (
              <Input
                id={id}
                className="input-on-dark"
                value={direccion}
                onChange={(event) => {
                  setDireccion(event.target.value)
                  clearFieldError("direccion")
                }}
                placeholder={altaAutonomoFormContent.placeholders.direccion}
                maxLength={altaAutonomoFormContent.limits.direccionMax}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </DarkFormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <DarkFormField
              name="ciudad"
              label={altaAutonomoFormContent.fields.ciudad}
              required
              error={fieldErrors.ciudad}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  className="input-on-dark"
                  value={ciudad}
                  onChange={(event) => {
                    setCiudad(event.target.value)
                    clearFieldError("ciudad")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.ciudad}
                  maxLength={altaAutonomoFormContent.limits.ciudadMax}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
            <DarkFormField
              name="provincia"
              label={altaAutonomoFormContent.fields.provincia}
              required
              error={fieldErrors.provincia}
            >
              {({ id, invalid, describedBy }) => (
                <select
                  id={id}
                  className={darkSelectClassName}
                  value={provincia}
                  onChange={(event) => {
                    setProvincia(event.target.value)
                    clearFieldError("provincia")
                  }}
                  disabled={visibleProvinces.length === 0}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                >
                  <option value="">Selecciona</option>
                  {visibleProvinces.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            </DarkFormField>
            <DarkFormField
              name="codigo_postal"
              label={altaAutonomoFormContent.fields.codigo_postal}
              required
              error={fieldErrors.codigo_postal}
            >
              {({ id, invalid, describedBy }) => (
                <Input
                  id={id}
                  className="input-on-dark"
                  value={codigoPostal}
                  onChange={(event) => {
                    setCodigoPostal(event.target.value)
                    clearFieldError("codigo_postal")
                  }}
                  placeholder={altaAutonomoFormContent.placeholders.codigo_postal}
                  maxLength={altaAutonomoFormContent.limits.codigoPostalLength}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                />
              )}
            </DarkFormField>
          </div>

          <div className="max-w-xs">
            <DarkFormField
              name="pais"
              label={altaAutonomoFormContent.fields.pais}
              required
              error={fieldErrors.pais}
            >
              {({ id, invalid, describedBy }) => (
                <select
                  id={id}
                  className={darkSelectClassName}
                  value={pais}
                  onChange={(event) => {
                    const nextCountry = event.target.value
                    setPais(nextCountry)
                    if (nextCountry !== pais) {
                      setProvincia("")
                    }
                    clearFieldError("pais")
                  }}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                >
                  <option value="">Selecciona</option>
                  {addressCatalog.countries.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {getCountryDisplayName(item.code, item.name)}
                    </option>
                  ))}
                </select>
              )}
            </DarkFormField>
          </div>

          <div className="flex items-center gap-3 border-t border-agua/20 pt-4">
            <input
              id="direccion_fiscal_igual_domicilio"
              type="checkbox"
              checked={direccionFiscalIgualDomicilio}
              onChange={(event) => {
                const checked = event.target.checked
                setDireccionFiscalIgualDomicilio(checked)
                if (checked) {
                  setDireccionFiscal("")
                  setCiudadFiscal("")
                  setProvinciaFiscal("")
                  setCodigoPostalFiscal("")
                } else {
                  setProvinciaFiscal(provincia)
                }
              }}
              className="size-4 shrink-0 rounded border-agua/35 accent-primary"
            />
            <label
              htmlFor="direccion_fiscal_igual_domicilio"
              className="text-sm leading-snug text-muted-on-dark"
            >
              {altaAutonomoFormContent.fields.direccion_fiscal_igual_domicilio}
            </label>
          </div>

          {!direccionFiscalIgualDomicilio ? (
            <div className="space-y-4">
              <DarkFormField
                name="direccion_fiscal"
                label={altaAutonomoFormContent.fields.direccion_fiscal}
                required
                error={fieldErrors.direccion_fiscal}
              >
                {({ id, invalid, describedBy }) => (
                  <Input
                    id={id}
                    className="input-on-dark"
                    value={direccionFiscal}
                    onChange={(event) => {
                      setDireccionFiscal(event.target.value)
                      clearFieldError("direccion_fiscal")
                    }}
                    placeholder={altaAutonomoFormContent.placeholders.direccion_fiscal}
                    maxLength={altaAutonomoFormContent.limits.direccionMax}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                  />
                )}
              </DarkFormField>
              <div className="grid gap-4 sm:grid-cols-3">
                <DarkFormField
                  name="ciudad_fiscal"
                  label={altaAutonomoFormContent.fields.ciudad_fiscal}
                  required
                  error={fieldErrors.ciudad_fiscal}
                >
                  {({ id, invalid, describedBy }) => (
                    <Input
                      id={id}
                      className="input-on-dark"
                      value={ciudadFiscal}
                      onChange={(event) => {
                        setCiudadFiscal(event.target.value)
                        clearFieldError("ciudad_fiscal")
                      }}
                      placeholder={altaAutonomoFormContent.placeholders.ciudad_fiscal}
                      maxLength={altaAutonomoFormContent.limits.ciudadMax}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>
                <DarkFormField
                  name="provincia_fiscal"
                  label={altaAutonomoFormContent.fields.provincia_fiscal}
                  required
                  error={fieldErrors.provincia_fiscal}
                >
                  {({ id, invalid, describedBy }) => (
                    <select
                      id={id}
                      className={darkSelectClassName}
                      value={provinciaFiscal}
                      onChange={(event) => {
                        setProvinciaFiscal(event.target.value)
                        clearFieldError("provincia_fiscal")
                      }}
                      disabled={visibleProvinces.length === 0}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    >
                      <option value="">Selecciona</option>
                      {visibleProvinces.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </DarkFormField>
                <DarkFormField
                  name="codigo_postal_fiscal"
                  label={altaAutonomoFormContent.fields.codigo_postal_fiscal}
                  required
                  error={fieldErrors.codigo_postal_fiscal}
                >
                  {({ id, invalid, describedBy }) => (
                    <Input
                      id={id}
                      className="input-on-dark"
                      value={codigoPostalFiscal}
                      onChange={(event) => {
                        setCodigoPostalFiscal(event.target.value)
                        clearFieldError("codigo_postal_fiscal")
                      }}
                      placeholder={altaAutonomoFormContent.placeholders.codigo_postal_fiscal}
                      maxLength={altaAutonomoFormContent.limits.codigoPostalLength}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3 border-t border-agua/20 pt-4">
            <input
              id="direccion_notificacion_igual_fiscal"
              type="checkbox"
              checked={direccionNotificacionIgualFiscal}
              onChange={(event) => {
                const checked = event.target.checked
                setDireccionNotificacionIgualFiscal(checked)
                if (checked) {
                  setDireccionNotificacion("")
                  setCiudadNotificacion("")
                  setProvinciaNotificacion("")
                  setCodigoPostalNotificacion("")
                } else {
                  setProvinciaNotificacion(provincia)
                }
              }}
              className="size-4 shrink-0 rounded border-agua/35 accent-primary"
            />
            <label
              htmlFor="direccion_notificacion_igual_fiscal"
              className="text-sm leading-snug text-muted-on-dark"
            >
              {altaAutonomoFormContent.fields.direccion_notificacion_igual_fiscal}
            </label>
          </div>

          {!direccionNotificacionIgualFiscal ? (
            <div className="space-y-4">
              <DarkFormField
                name="direccion_notificacion"
                label={altaAutonomoFormContent.fields.direccion_notificacion}
                required
                error={fieldErrors.direccion_notificacion}
              >
                {({ id, invalid, describedBy }) => (
                  <Input
                    id={id}
                    className="input-on-dark"
                    value={direccionNotificacion}
                    onChange={(event) => {
                      setDireccionNotificacion(event.target.value)
                      clearFieldError("direccion_notificacion")
                    }}
                    placeholder={altaAutonomoFormContent.placeholders.direccion_notificacion}
                    maxLength={altaAutonomoFormContent.limits.direccionMax}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                  />
                )}
              </DarkFormField>
              <div className="grid gap-4 sm:grid-cols-3">
                <DarkFormField
                  name="ciudad_notificacion"
                  label={altaAutonomoFormContent.fields.ciudad_notificacion}
                  required
                  error={fieldErrors.ciudad_notificacion}
                >
                  {({ id, invalid, describedBy }) => (
                    <Input
                      id={id}
                      className="input-on-dark"
                      value={ciudadNotificacion}
                      onChange={(event) => {
                        setCiudadNotificacion(event.target.value)
                        clearFieldError("ciudad_notificacion")
                      }}
                      placeholder={altaAutonomoFormContent.placeholders.ciudad_notificacion}
                      maxLength={altaAutonomoFormContent.limits.ciudadMax}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>
                <DarkFormField
                  name="provincia_notificacion"
                  label={altaAutonomoFormContent.fields.provincia_notificacion}
                  required
                  error={fieldErrors.provincia_notificacion}
                >
                  {({ id, invalid, describedBy }) => (
                    <select
                      id={id}
                      className={darkSelectClassName}
                      value={provinciaNotificacion}
                      onChange={(event) => {
                        setProvinciaNotificacion(event.target.value)
                        clearFieldError("provincia_notificacion")
                      }}
                      disabled={visibleProvinces.length === 0}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    >
                      <option value="">Selecciona</option>
                      {visibleProvinces.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </DarkFormField>
                <DarkFormField
                  name="codigo_postal_notificacion"
                  label={altaAutonomoFormContent.fields.codigo_postal_notificacion}
                  required
                  error={fieldErrors.codigo_postal_notificacion}
                >
                  {({ id, invalid, describedBy }) => (
                    <Input
                      id={id}
                      className="input-on-dark"
                      value={codigoPostalNotificacion}
                      onChange={(event) => {
                        setCodigoPostalNotificacion(event.target.value)
                        clearFieldError("codigo_postal_notificacion")
                      }}
                      placeholder={altaAutonomoFormContent.placeholders.codigo_postal_notificacion}
                      maxLength={altaAutonomoFormContent.limits.codigoPostalLength}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>
              </div>
            </div>
          ) : null}
        </fieldset>
      )
    }

    return (
      <fieldset className="w-full space-y-4">
        <legend className="text-base font-semibold text-on-dark">
          {altaAutonomoFormContent.step4.title}
        </legend>
        <p className="max-w-prose text-sm text-muted-on-dark">
          {altaAutonomoFormContent.step4.description}
        </p>

        <DarkFormField
          name="actividad"
          label={altaAutonomoFormContent.fields.actividad}
          required
          error={fieldErrors.actividad}
        >
          {({ id, invalid, describedBy }) => (
            <Textarea
              id={id}
              className="input-on-dark min-h-[88px] resize-none"
              value={actividad}
              onChange={(event) => {
                setActividad(event.target.value)
                clearFieldError("actividad")
              }}
              placeholder={altaAutonomoFormContent.placeholders.actividad}
              maxLength={altaAutonomoFormContent.limits.actividadMax}
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </DarkFormField>

        <DarkFormField
          name="ingresos_anuales"
          label={altaAutonomoFormContent.fields.ingresos_anuales}
          required
          error={fieldErrors.ingresos_anuales}
        >
          {({ id, invalid, describedBy }) => (
            <div
              className={cn(
                "input-group-on-dark",
                invalid && "input-group-on-dark--invalid"
              )}
            >
              <span aria-hidden className="input-group-on-dark-addon">
                €
              </span>
              <Input
                id={id}
                inputMode="numeric"
                className="input-on-dark h-full py-0"
                value={ingresosAnuales}
                onChange={(event) => {
                  setIngresosAnuales(event.target.value)
                  clearFieldError("ingresos_anuales")
                }}
                placeholder={altaAutonomoFormContent.placeholders.ingresos_anuales}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            </div>
          )}
        </DarkFormField>

        <DarkFormField
          name="iban"
          label={altaAutonomoFormContent.fields.iban}
          required
          error={fieldErrors.iban}
        >
          {({ id, invalid, describedBy }) => (
            <Input
              id={id}
              className="input-on-dark"
              value={iban}
              onChange={(event) => {
                setIban(event.target.value)
                clearFieldError("iban")
              }}
              placeholder={altaAutonomoFormContent.placeholders.iban}
              maxLength={altaAutonomoFormContent.limits.ibanMax}
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </DarkFormField>

        <DarkFormField
          name="comentarios"
          label={altaAutonomoFormContent.fields.comentarios}
          error={fieldErrors.comentarios}
        >
          {({ id, invalid, describedBy }) => (
            <Textarea
              id={id}
              className="input-on-dark min-h-[88px] resize-none"
              value={comentarios}
              onChange={(event) => {
                setComentarios(event.target.value)
                clearFieldError("comentarios")
              }}
              placeholder={altaAutonomoFormContent.placeholders.comentarios}
              maxLength={altaAutonomoFormContent.limits.comentariosMax}
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </DarkFormField>

        <div>
          <div className="flex items-center gap-3">
            <input
              id="privacidad"
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => {
                setPrivacyAccepted(event.target.checked)
                clearFieldError("privacidad")
              }}
              className={cn(
                "size-4 shrink-0 rounded border-agua/35 accent-primary",
                fieldErrors.privacidad && "border-red-400/60 ring-[3px] ring-red-400/40"
              )}
              aria-invalid={Boolean(fieldErrors.privacidad)}
              aria-describedby={fieldErrors.privacidad ? "privacidad-error" : undefined}
            />
            <label htmlFor="privacidad" className="text-sm leading-snug text-muted-on-dark">
              {altaAutonomoFormContent.fields.privacidad}{" "}
              <Link
                href={legalRoutes.privacidad}
                className="text-primary underline-offset-4 hover:underline"
              >
                ({legalRoutes.privacidad})
              </Link>
            </label>
          </div>
          <FieldErrorText id="privacidad-error">{fieldErrors.privacidad}</FieldErrorText>
        </div>
      </fieldset>
    )
  }

  return (
    <BrisaFormSection id={altaAutonomoFormContent.sectionId} padding="spacious">
      <MarketingSectionHeading
        badge={altaAutonomoFormContent.hero.eyebrow}
        title={altaAutonomoFormContent.hero.title}
        subtitle={altaAutonomoFormContent.hero.subtitle}
        tone="light"
        size="page"
        className="mb-14 max-w-3xl"
      />

      <BrisaFormCard maxWidthClassName="max-w-6xl">
        <DarkFormPanel>
          {successMessage ? (
            <div ref={successFocusRef} tabIndex={-1} className="outline-none">
              <FormSubmissionSuccess
                title={altaAutonomoFormContent.success.title}
                body={successMessage}
                doneLabel={altaAutonomoFormContent.success.doneLabel}
                progressSegments={1}
              />
            </div>
          ) : (
            <LazyMotion features={domAnimation} strict>
              <m.form
                className="space-y-5"
                onSubmit={onSubmit}
                onKeyDown={handleFormKeyDown}
                noValidate
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : stepExitMs, ease: stepEase }}
              >
                <HoneypotField
                  id={honeypotId}
                  label={altaAutonomoFormContent.fields.honeypotLabel}
                  value={company}
                  onChange={setCompany}
                />

                <div className="mb-5 w-full">
                  <p
                    className="mb-1.5 text-xs font-medium tracking-wide text-primary uppercase"
                    aria-live="polite"
                  >
                    {formatProgressLabel(step)}
                  </p>
                  <div
                    className="flex w-full gap-1.5"
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={TOTAL_STEPS}
                    aria-valuenow={step}
                    aria-label={formatProgressLabel(step)}
                  >
                    {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                      <span
                        key={index}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-[background-color,opacity] duration-250 ease-out motion-reduce:transition-none",
                          index + 1 <= step ? "bg-primary opacity-100" : "bg-agua/25 opacity-70"
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>

                <AltaAutonomoStepTransition step={step} reducedMotion={reducedMotion}>
                  {renderStepContent()}
                </AltaAutonomoStepTransition>

                {errorMessage ? (
                  <FormStatusMessage variant="error">{errorMessage}</FormStatusMessage>
                ) : null}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                  <p className="text-center text-sm text-muted-on-dark md:flex-1 md:text-left">
                    <a href="#alta-autonomo-faq" className="underline-offset-4 hover:underline">
                      {altaAutonomoFormContent.panel.faqNotice}
                    </a>
                  </p>
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    {step > 1 ? (
                      <MarketingButton
                        type="button"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        marketingVariant="secondary"
                        className="min-h-11"
                      >
                        {altaAutonomoFormContent.steps.back}
                      </MarketingButton>
                    ) : null}
                    {step < TOTAL_STEPS ? (
                      <MarketingButton
                        type="button"
                        onClick={handleNext}
                        disabled={!formReady || isSubmitting}
                        className="min-h-11"
                      >
                        {altaAutonomoFormContent.steps.next}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </MarketingButton>
                    ) : (
                      <MarketingButton
                        type="submit"
                        disabled={!canSubmit || !isFinalStepComplete}
                        className="min-h-11"
                        size="lg"
                      >
                        {isSubmitting
                          ? altaAutonomoFormContent.actions.sending
                          : altaAutonomoFormContent.actions.submit}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </MarketingButton>
                    )}
                  </div>
                </div>
              </m.form>
            </LazyMotion>
          )}
        </DarkFormPanel>
      </BrisaFormCard>

      <div id="alta-autonomo-faq">
        <AltaAutonomoFaqSection />
      </div>
    </BrisaFormSection>
  )
}
