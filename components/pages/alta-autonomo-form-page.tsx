"use client"

import Link from "next/link"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { DarkFormField } from "@/components/forms/dark-form-field"
import { FieldErrorText } from "@/components/forms/field-error-text"
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
  getAltaAutonomoValidationIssues,
  isAltaAutonomoFormComplete,
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
import { cn } from "@/lib/utils"

const darkSelectClassName =
  "select-on-dark h-9 w-full rounded-md border px-3 py-1 text-base md:text-sm"

type AltaAutonomoFormPageProps = {
  token: string
  initialEmail?: string
  addressCatalog: OnboardingAddressCatalog
}

function isStoredOdooId(value: string): boolean {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0
}

export function AltaAutonomoFormPage({
  token,
  initialEmail,
  addressCatalog,
}: AltaAutonomoFormPageProps) {
  const defaultCountryId = String(addressCatalog.defaultCountryId)
  const honeypotId = useId()
  const formStartedAtRef = useRef(Date.now())
  const successFocusRef = useRef<HTMLDivElement>(null)

  const [nombre, setNombre] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [nif, setNif] = useState("")
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
    () =>
      addressCatalog.provinces.filter(
        (province) => String(province.countryId) === pais
      ),
    [addressCatalog.provinces, pais]
  )

  useEffect(() => {
    const draft = readAltaAutonomoFormDraft(token)
    if (draft) {
      setNombre(draft.nombre)
      setApellidos(draft.apellidos)
      setNif(draft.nif)
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
      setActividad(draft.actividad)
      setIngresosAnuales(draft.ingresosAnuales)
      setIban(draft.iban)
      setComentarios(draft.comentarios)
      setPrivacyAccepted(draft.privacyAccepted)
    }
    setDraftHydrated(true)
  }, [token, initialEmail, defaultCountryId])

  useEffect(() => {
    const timer = window.setTimeout(
      () => setFormReady(true),
      altaAutonomoFormContent.limits.minSubmitDelayMs
    )
    return () => window.clearTimeout(timer)
  }, [])

  const formDraft = useMemo<AltaAutonomoFormDraft>(
    () => ({
      nombre,
      apellidos,
      nif,
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

  const payload = useMemo<AltaAutonomoSubmissionPayload>(
    () => ({
      token,
      nombre,
      apellidos,
      nif,
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
      actividad,
      ingresos_anuales: ingresosAnuales,
      iban,
      comentarios,
      privacidad: privacyAccepted,
      company,
      formStartedAt: formStartedAtRef.current,
    }),
    [
      token,
      nombre,
      apellidos,
      nif,
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

    const issues = getAltaAutonomoValidationIssues(payload)
    markFieldErrors(issues)

    if (issues.length > 0) {
      setErrorMessage(altaAutonomoFormContent.messages.validation)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/solicitud-alta-autonomo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
              <form className="space-y-5" onSubmit={onSubmit} noValidate>
                <HoneypotField
                  id={honeypotId}
                  label={altaAutonomoFormContent.fields.honeypotLabel}
                  value={company}
                  onChange={setCompany}
                />

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
                        onChange={(event) => setNombre(event.target.value)}
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
                        onChange={(event) => setApellidos(event.target.value)}
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
                        onChange={(event) => setNif(event.target.value)}
                        placeholder={altaAutonomoFormContent.placeholders.nif}
                        maxLength={altaAutonomoFormContent.limits.nifMax}
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
                        onChange={(event) => setTelefono(event.target.value)}
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
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={altaAutonomoFormContent.placeholders.email}
                      maxLength={altaAutonomoFormContent.limits.emailMax}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>

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
                        onChange={(event) =>
                          setCertificadoDigital(event.target.value as "si" | "no" | "")
                        }
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
                        onChange={(event) => setFechaAlta(event.target.value)}
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
                            onChange={(event) => setFechaDarAlta(event.target.value)}
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
                            onChange={(event) => setFechaBaja(event.target.value)}
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
                      onChange={(event) => setFechaEmpezarConNosotros(event.target.value)}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
                  )}
                </DarkFormField>

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
                      onChange={(event) => setDireccion(event.target.value)}
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
                        onChange={(event) => setCiudad(event.target.value)}
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
                        onChange={(event) => setProvincia(event.target.value)}
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
                        onChange={(event) => setCodigoPostal(event.target.value)}
                        placeholder={altaAutonomoFormContent.placeholders.codigo_postal}
                        maxLength={altaAutonomoFormContent.limits.codigoPostalLength}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                      />
                    )}
                  </DarkFormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                          onChange={(event) => setIngresosAnuales(event.target.value)}
                          placeholder={altaAutonomoFormContent.placeholders.ingresos_anuales}
                          aria-invalid={invalid}
                          aria-describedby={describedBy}
                        />
                      </div>
                    )}
                  </DarkFormField>
                </div>

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
                      onChange={(event) => setActividad(event.target.value)}
                      placeholder={altaAutonomoFormContent.placeholders.actividad}
                      maxLength={altaAutonomoFormContent.limits.actividadMax}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                    />
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
                      onChange={(event) => setIban(event.target.value)}
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
                      onChange={(event) => setComentarios(event.target.value)}
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
                      onChange={(event) => setPrivacyAccepted(event.target.checked)}
                      className={cn(
                        "size-4 shrink-0 rounded border-agua/35 accent-primary",
                        fieldErrors.privacidad &&
                          "border-red-400/60 ring-[3px] ring-red-400/40"
                      )}
                      aria-invalid={Boolean(fieldErrors.privacidad)}
                      aria-describedby={
                        fieldErrors.privacidad ? "privacidad-error" : undefined
                      }
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

                {errorMessage ? <FormStatusMessage variant="error">{errorMessage}</FormStatusMessage> : null}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                  <p className="text-center text-sm text-muted-on-dark md:flex-1 md:text-left">
                    <a href="#alta-autonomo-faq" className="underline-offset-4 hover:underline">
                      {altaAutonomoFormContent.panel.faqNotice}
                    </a>
                  </p>
                  <MarketingButton
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full shrink-0 md:w-auto"
                    size="lg"
                  >
                    {isSubmitting
                      ? altaAutonomoFormContent.actions.sending
                      : altaAutonomoFormContent.actions.submit}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </MarketingButton>
                </div>
              </form>
          )}
        </DarkFormPanel>
      </BrisaFormCard>

      <div id="alta-autonomo-faq">
        <AltaAutonomoFaqSection />
      </div>
    </BrisaFormSection>
  )
}
