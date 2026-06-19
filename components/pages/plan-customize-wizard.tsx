"use client"

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
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  planCustomizeForm,
  planCustomizeTaxRegions,
  planCustomizeYesNo,
  empresasEmployeeCountLabel,
  empresasHasEmployeesLabel,
  type PlanCustomizeAudience,
} from "@/content/plan-customize-form"
import { FieldLabel } from "@/components/forms/field-label"
import { FormStatusMessage } from "@/components/forms/form-status-message"
import { FormSubmissionSuccess } from "@/components/forms/form-submission-success"
import { HoneypotField } from "@/components/forms/honeypot-field"
import { MarketingButton } from "@/components/ui/marketing-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  formSubmitStubDelayMs,
  isFormSubmitStubEnabled,
} from "@/lib/forms/form-submit-stub"
import { resolveFormApiErrorMessage, type FormApiPayload } from "@/lib/forms/form-api-response"
import {
  canSubmitPlanCustomizeFromClient,
  recordPlanCustomizeClientSubmission,
} from "@/lib/plan-customize/rate-limit"
import {
  getPlanCustomizeStepValidationError,
  isValidAnnualRevenueInput,
} from "@/lib/plan-customize/validate-inquiry"
import { formStepEase } from "@/lib/forms/motion-tokens"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 3

const stepEnterMs = 0.28
const stepExitMs = 0.2
const stepHeightMs = 0.34
const stepEase = formStepEase
const stepMotion = { duration: stepEnterMs, ease: stepEase } as const
const stepExitMotion = { duration: stepExitMs, ease: stepEase } as const
const stepHeightMotion = { duration: stepHeightMs, ease: stepEase } as const
const submitDelayMs = 100
const planFormWidthClass = "w-full"

const compactChoiceButtonClass =
  "min-h-9 cursor-pointer rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-[border-color,background-color] duration-200 motion-reduce:transition-none"
const compactChoiceSelectedClass = "border-primary/55 bg-primary/10 text-on-dark"
const compactChoiceIdleClass =
  "border-agua/35 text-on-dark hover:border-primary/45 hover:bg-on-dark/8"

type YesNoValue = "" | "yes" | "no"
type TaxRegionValue = "" | "peninsula" | "canarias"

type PlanFormValues = {
  isRegisteredAutonomo: YesNoValue
  willHireEmployees: YesNoValue
  isNewConstitution: YesNoValue
  hasEmployees: YesNoValue
  employeeCount: string
  annualRevenue: string
  services: string[]
  activity: string
  taxRegion: TaxRegionValue
  name: string
  email: string
  phone: string
}

function isStepComplete(
  currentStep: number,
  audience: PlanCustomizeAudience,
  values: PlanFormValues
): boolean {
  return getPlanCustomizeStepValidationError(currentStep, audience, values) === null
}

type SegmentedChoiceProps = {
  id: string
  label: string
  value: YesNoValue
  onChange: (value: YesNoValue) => void
  options: readonly { value: string; label: string }[]
  invalid?: boolean
  compact?: boolean
  required?: boolean
}

function SegmentedChoice({
  id,
  label,
  value,
  onChange,
  options,
  invalid,
  compact = true,
  required,
}: SegmentedChoiceProps) {
  return (
    <div>
      <FieldLabel id={`${id}-label`} required={required}>
        {label}
      </FieldLabel>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-invalid={invalid}
        className={cn(
          "grid grid-cols-2 gap-2",
          compact ? "max-w-[11.5rem]" : "w-full"
        )}
      >
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value as YesNoValue)}
              className={cn(
                compactChoiceButtonClass,
                selected ? compactChoiceSelectedClass : compactChoiceIdleClass
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

type PlanCustomizeWizardProps = {
  audience: PlanCustomizeAudience
  sectionTitleId: string
}

function formatProgressLabel(current: number) {
  return planCustomizeForm.steps.progressLabel
    .replace("{current}", String(current))
    .replace("{total}", String(TOTAL_STEPS))
}

function PlanStepTransition({
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
            exit={
              motionDisabled
                ? undefined
                : { opacity: 0, y: -6, transition: stepExitMotion }
            }
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

export function PlanCustomizeWizard({ audience, sectionTitleId }: PlanCustomizeWizardProps) {
  const panelId = useId()
  const stepLiveId = useId()
  const honeypotId = useId()
  const formStartedAtRef = useRef(Date.now())
  const reducedMotion = useReducedMotion()

  const [step, setStep] = useState(1)
  const [company, setCompany] = useState("")
  const [isRegisteredAutonomo, setIsRegisteredAutonomo] = useState<YesNoValue>("")
  const [willHireEmployees, setWillHireEmployees] = useState<YesNoValue>("")
  const [isNewConstitution, setIsNewConstitution] = useState<YesNoValue>("")
  const [hasEmployees, setHasEmployees] = useState<YesNoValue>("")
  const [employeeCount, setEmployeeCount] = useState("")
  const [annualRevenue, setAnnualRevenue] = useState("")
  const [services, setServices] = useState<string[]>([])
  const [activity, setActivity] = useState("")
  const [taxRegion, setTaxRegion] = useState<TaxRegionValue>("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [formReady, setFormReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(
      () => setFormReady(true),
      planCustomizeForm.limits.minSubmitDelayMs
    )
    return () => window.clearTimeout(timer)
  }, [])

  const formSubmitStub = isFormSubmitStubEnabled()

  const formValues: PlanFormValues = {
    isRegisteredAutonomo,
    willHireEmployees,
    isNewConstitution,
    hasEmployees,
    employeeCount,
    annualRevenue,
    services,
    activity,
    taxRegion,
    name,
    email,
    phone,
  }

  const isCurrentStepComplete = useMemo(
    () => isStepComplete(step, audience, formValues),
    [step, audience, formValues]
  )

  const isFinalStepComplete = useMemo(
    () => isStepComplete(TOTAL_STEPS, audience, formValues),
    [audience, formValues]
  )

  useEffect(() => {
    setStepError(null)
  }, [step])

  const serviceOptions = planCustomizeForm.step2.serviceOptions[audience]

  const toggleService = (value: string) => {
    setServices((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const selectAllServices = () => {
    setServices(serviceOptions.map((option) => option.value))
  }

  const empresasEmployeesQuestionLabel = empresasHasEmployeesLabel(isNewConstitution)
  const empresasEmployeeCountQuestionLabel = empresasEmployeeCountLabel(isNewConstitution)

  const resetWizard = useCallback(() => {
    setStep(1)
    setIsRegisteredAutonomo("")
    setWillHireEmployees("")
    setIsNewConstitution("")
    setHasEmployees("")
    setEmployeeCount("")
    setAnnualRevenue("")
    setServices([])
    setActivity("")
    setTaxRegion("")
    setName("")
    setEmail("")
    setPhone("")
    setNotes("")
    setStepError(null)
  }, [])

  const handleNext = () => {
    if (!formSubmitStub) {
      const error = getPlanCustomizeStepValidationError(step, audience, formValues)
      if (error) {
        setStepError(error)
        return
      }
    }
    setStepError(null)
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const handleBack = () => {
    setStepError(null)
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const revealSuccess = useCallback((detail?: string) => {
    setSuccessMessage(detail ?? planCustomizeForm.success.body)
    resetWizard()
    formStartedAtRef.current = Date.now()
    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.setTimeout(() => {
      document.getElementById(planCustomizeForm.sectionId)?.scrollIntoView({
        behavior: motionReduced ? "auto" : "smooth",
        block: "start",
      })
    }, motionReduced ? 0 : 40)
  }, [resetWizard])

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return
    if (event.target instanceof HTMLTextAreaElement) return
    event.preventDefault()
    if (step < TOTAL_STEPS && (formSubmitStub || isCurrentStepComplete)) {
      handleNext()
    }
  }

  const handleSendRequest = async () => {
    if (formSubmitStub) {
      setStepError(null)
      setIsSubmitting(true)
      await new Promise((resolve) => window.setTimeout(resolve, formSubmitStubDelayMs))
      const submitDelay = reducedMotion ? 0 : submitDelayMs
      window.setTimeout(() => {
        revealSuccess(planCustomizeForm.success.body)
        setIsSubmitting(false)
      }, submitDelay)
      return
    }

    const error = getPlanCustomizeStepValidationError(3, audience, formValues)
    if (error) {
      setStepError(error)
      return
    }

    if (company.length > 0) {
      setStepError(planCustomizeForm.messages.honeypot)
      return
    }

    if (!canSubmitPlanCustomizeFromClient()) {
      setStepError(planCustomizeForm.messages.rateLimit)
      return
    }

    setStepError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/plan-customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          isRegisteredAutonomo,
          willHireEmployees,
          isNewConstitution,
          hasEmployees,
          employeeCount,
          annualRevenue,
          services,
          activity,
          taxRegion,
          name,
          email,
          phone,
          notes,
          company,
          formStartedAt: formStartedAtRef.current,
        }),
      })

      const payload = (await response.json()) as FormApiPayload

      const apiError = resolveFormApiErrorMessage(response, payload, {
        rateLimit: planCustomizeForm.messages.rateLimit,
        duplicateLead: planCustomizeForm.messages.duplicateLead,
        webhookForbidden: planCustomizeForm.messages.webhookForbidden,
        generic: planCustomizeForm.messages.genericError,
        validation: planCustomizeForm.messages.validation,
      })

      if (apiError) {
        setStepError(apiError)
        return
      }

      recordPlanCustomizeClientSubmission()
      const submitDelay = reducedMotion ? 0 : submitDelayMs
      window.setTimeout(() => {
        revealSuccess(payload.message)
      }, submitDelay)
    } catch {
      setStepError(planCustomizeForm.messages.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepErrorId = stepError ? `${panelId}-form-error` : undefined

  const renderRevenueInput = () => (
    <div className="max-w-xs">
      <FieldLabel htmlFor={`${panelId}-revenue`} required>
        {planCustomizeForm.step1.revenueLabel}
      </FieldLabel>
      <p id={`${panelId}-revenue-hint`} className="mb-2 text-xs text-muted-on-dark">
        {planCustomizeForm.step1.revenueHint}
      </p>
      <div
        className={cn(
          "flex overflow-hidden rounded-lg border border-agua/35 bg-transparent transition-[border-color] duration-200 focus-within:border-primary/55 motion-reduce:transition-none",
          stepError && step === 1 && "border-red-400/70"
        )}
      >
        <span
          className="flex min-h-10 shrink-0 items-center border-r border-agua/35 bg-on-dark/12 px-3 text-sm font-medium text-muted-on-dark"
          aria-hidden
        >
          €
        </span>
        <Input
          id={`${panelId}-revenue`}
          type="text"
          inputMode="numeric"
          value={annualRevenue}
          onChange={(event) => setAnnualRevenue(event.target.value)}
          placeholder={planCustomizeForm.step1.revenuePlaceholder}
          className="input-on-dark min-h-10 flex-1 rounded-none border-0 bg-transparent px-3 text-base shadow-none focus-visible:ring-0 md:text-sm"
          aria-describedby={`${panelId}-revenue-hint`}
          aria-invalid={Boolean(stepError && step === 1)}
        />
      </div>
    </div>
  )

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <fieldset className="w-full space-y-5" aria-describedby={stepErrorId}>
          <legend className="text-base font-semibold text-on-dark">
            {planCustomizeForm.step1.title}
          </legend>
          <p className="max-w-prose text-sm text-muted-on-dark">
            {planCustomizeForm.step1.description}
          </p>

          {audience === "autonomos" ? (
            <>
              <SegmentedChoice
                id={`${panelId}-registered`}
                label={planCustomizeForm.step1.autonomos.registeredLabel}
                value={isRegisteredAutonomo}
                onChange={setIsRegisteredAutonomo}
                options={planCustomizeYesNo}
                invalid={Boolean(stepError && step === 1)}
                required
              />
              <SegmentedChoice
                id={`${panelId}-hire`}
                label={planCustomizeForm.step1.autonomos.hireEmployeesLabel}
                value={willHireEmployees}
                onChange={setWillHireEmployees}
                options={planCustomizeYesNo}
                invalid={Boolean(stepError && step === 1)}
                required
              />
            </>
          ) : (
            <>
              <SegmentedChoice
                id={`${panelId}-constitution`}
                label={planCustomizeForm.step1.empresas.newConstitutionLabel}
                value={isNewConstitution}
                onChange={setIsNewConstitution}
                options={planCustomizeYesNo}
                invalid={Boolean(stepError && step === 1)}
                required
              />
              <SegmentedChoice
                id={`${panelId}-has-employees`}
                label={empresasEmployeesQuestionLabel}
                value={hasEmployees}
                onChange={(value) => {
                  setHasEmployees(value)
                  if (value !== "yes") setEmployeeCount("")
                }}
                options={planCustomizeYesNo}
                invalid={Boolean(stepError && step === 1)}
                required
              />
              {hasEmployees === "yes" ? (
                <div>
                  <FieldLabel htmlFor={`${panelId}-employee-count`} required>
                    {empresasEmployeeCountQuestionLabel}
                  </FieldLabel>
                  <Input
                    id={`${panelId}-employee-count`}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={employeeCount}
                    onChange={(event) => setEmployeeCount(event.target.value)}
                    placeholder={planCustomizeForm.step1.empresas.employeeCountPlaceholder}
                    className="input-on-dark min-h-11 max-w-xs text-base md:text-sm"
                  />
                </div>
              ) : null}
            </>
          )}

          {renderRevenueInput()}
        </fieldset>
      )
    }

    if (step === 2) {
      return (
        <fieldset className="w-full space-y-4" aria-describedby={stepErrorId}>
          <legend className="text-base font-semibold text-on-dark">
            {planCustomizeForm.step2.title}
          </legend>
          <p className="max-w-prose text-sm text-muted-on-dark">
            {planCustomizeForm.step2.description}
          </p>
          <p className="max-w-prose text-sm text-muted-on-dark">
            {planCustomizeForm.step2.digitalizationHint}
          </p>
          <FieldLabel id={`${panelId}-services-hint`} required>
            {planCustomizeForm.step2.servicesLabel}
          </FieldLabel>
          <div className="flex flex-wrap items-center gap-3">
            <MarketingButton
              type="button"
              marketingVariant="secondary"
              className="min-h-11"
              aria-label={planCustomizeForm.step2.selectAllAriaLabel}
              onClick={selectAllServices}
            >
              {planCustomizeForm.step2.selectAllLabel}
            </MarketingButton>
          </div>
          <ul
            className="grid w-full gap-3 sm:grid-cols-2"
            role="group"
            aria-labelledby={`${panelId}-services-hint`}
          >
            {serviceOptions.map((option) => {
              const checked = services.includes(option.value)
              const inputId = `${panelId}-service-${option.value}`
              return (
                <li key={option.value}>
                  <label
                    htmlFor={inputId}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-[border-color,background-color] duration-200 motion-reduce:transition-none",
                      checked
                        ? "border-primary/55 bg-primary/10 text-on-dark"
                        : "border-agua/35 text-on-dark hover:border-primary/45 hover:bg-on-dark/8"
                    )}
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      className="h-4 w-4 shrink-0 accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      checked={checked}
                      onChange={() => toggleService(option.value)}
                    />
                    {option.label}
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )
    }

    return (
      <fieldset className="w-full space-y-5" aria-describedby={stepErrorId}>
        <legend className="text-base font-semibold text-on-dark">
          {planCustomizeForm.step3.title}
        </legend>
        <p className="max-w-prose text-sm text-muted-on-dark">
          {planCustomizeForm.step3.description}
        </p>

        <div>
          <FieldLabel htmlFor={`${panelId}-activity`} required>
            {planCustomizeForm.step3.activityLabel}
          </FieldLabel>
          <Textarea
            id={`${panelId}-activity`}
            value={activity}
            onChange={(event) => setActivity(event.target.value)}
            placeholder={planCustomizeForm.step3.activityPlaceholder}
            className="input-on-dark min-h-[72px] w-full text-base md:text-sm"
            rows={2}
          />
        </div>

        <div>
          <FieldLabel id={`${panelId}-tax-label`} required>
            {planCustomizeForm.step3.taxRegionLabel}
          </FieldLabel>
          <div
            role="radiogroup"
            aria-labelledby={`${panelId}-tax-label`}
            className="grid max-w-md grid-cols-2 gap-2"
          >
            {planCustomizeTaxRegions.map((option) => {
              const selected = taxRegion === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTaxRegion(option.value as TaxRegionValue)}
                  className={cn(
                    compactChoiceButtonClass,
                    "text-left",
                    selected ? compactChoiceSelectedClass : compactChoiceIdleClass
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor={`${panelId}-name`} required>
              {planCustomizeForm.step3.nameLabel}
            </FieldLabel>
            <Input
              id={`${panelId}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={planCustomizeForm.step3.namePlaceholder}
              className="input-on-dark min-h-11 w-full text-base md:text-sm"
              autoComplete="name"
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${panelId}-email`} required>
              {planCustomizeForm.step3.emailLabel}
            </FieldLabel>
            <Input
              id={`${panelId}-email`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={planCustomizeForm.step3.emailPlaceholder}
              className="input-on-dark min-h-11 w-full text-base md:text-sm"
              autoComplete="email"
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${panelId}-phone`}>{planCustomizeForm.step3.phoneLabel}</FieldLabel>
            <Input
              id={`${panelId}-phone`}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={planCustomizeForm.step3.phonePlaceholder}
              className="input-on-dark min-h-11 w-full text-base md:text-sm"
              autoComplete="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor={`${panelId}-notes`}>{planCustomizeForm.step3.notesLabel}</FieldLabel>
            <Textarea
              id={`${panelId}-notes`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={planCustomizeForm.step3.notesPlaceholder}
              className="input-on-dark min-h-[88px] w-full text-base md:text-sm"
              rows={3}
              maxLength={planCustomizeForm.limits.notesMax}
            />
          </div>
        </div>
      </fieldset>
    )
  }

  const panelHeader = planCustomizeForm.panelHeader[audience]

  return (
    <div className={planFormWidthClass} data-plan-customize-form>
      <header className="mb-6">
        <h2
          id={sectionTitleId}
          className="text-sm font-semibold tracking-[0.12em] text-primary uppercase sm:text-base"
        >
          {panelHeader.eyebrow}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-on-dark">
          {panelHeader.lead}
        </p>
      </header>

      <LazyMotion features={domAnimation} strict>
        <AnimatePresence mode="wait" initial={false}>
          {successMessage ? (
            <FormSubmissionSuccess
              key="plan-customize-success"
              className={planFormWidthClass}
              title={planCustomizeForm.success.title}
              body={successMessage ?? planCustomizeForm.success.body}
              doneLabel={planCustomizeForm.success.stepsDoneLabel}
              progressSegments={TOTAL_STEPS}
            />
          ) : (
            <m.form
              key="plan-customize-form"
              onSubmit={(event) => event.preventDefault()}
              onKeyDown={handleFormKeyDown}
              noValidate
              className="w-full"
              aria-labelledby={sectionTitleId}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : stepExitMs, ease: stepEase }}
            >
              <HoneypotField
                id={honeypotId}
                label={planCustomizeForm.fields.honeypotLabel}
                value={company}
                onChange={setCompany}
              />
              <div className="mb-5 w-full">
                <p
                  id={stepLiveId}
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

              <PlanStepTransition step={step} reducedMotion={reducedMotion}>
                {renderStepContent()}
              </PlanStepTransition>

              <AnimatePresence initial={false}>
                {stepError ? (
                  <m.div
                    key="plan-step-error"
                    id={`${panelId}-form-error`}
                    role="alert"
                    aria-live="assertive"
                    initial={reducedMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginTop: 16,
                    }}
                    exit={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, height: 0, marginTop: 0, transition: stepExitMotion }
                    }
                    transition={reducedMotion ? { duration: 0 } : stepMotion}
                  >
                    <FormStatusMessage variant="error">{stepError}</FormStatusMessage>
                  </m.div>
                ) : null}
              </AnimatePresence>

              {step === TOTAL_STEPS ? (
                <p className="mt-4 text-center text-xs text-muted-on-dark">
                  Al enviar aceptas la{" "}
                  <Link
                    href="/privacidad"
                    className="text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    política de privacidad
                  </Link>
                  .
                </p>
              ) : null}

              <div className="mt-6 flex min-h-11 flex-wrap items-center gap-3">
                <AnimatePresence initial={false}>
                  {step > 1 ? (
                    <m.div
                      key="plan-nav-back"
                      initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reducedMotion ? undefined : { opacity: 0, x: -6 }}
                      transition={reducedMotion ? { duration: 0 } : stepMotion}
                      className="shrink-0"
                    >
                      <MarketingButton
                        type="button"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        marketingVariant="secondary"
                        className="min-h-11"
                      >
                        {planCustomizeForm.steps.back}
                      </MarketingButton>
                    </m.div>
                  ) : null}
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                  {step < TOTAL_STEPS ? (
                    <m.div
                      key="plan-nav-next"
                      initial={reducedMotion ? false : { opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reducedMotion ? undefined : { opacity: 0, x: -6 }}
                      transition={reducedMotion ? { duration: 0 } : stepMotion}
                    >
                      <MarketingButton
                        type="button"
                        onClick={handleNext}
                        disabled={
                          formSubmitStub
                            ? isSubmitting
                            : !formReady || !isCurrentStepComplete || isSubmitting
                        }
                        className="min-h-11"
                      >
                        {planCustomizeForm.steps.next}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </MarketingButton>
                    </m.div>
                  ) : (
                    <m.div
                      key="plan-nav-submit"
                      initial={reducedMotion ? false : { opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reducedMotion ? undefined : { opacity: 0, x: -6 }}
                      transition={reducedMotion ? { duration: 0 } : stepMotion}
                    >
                      <MarketingButton
                        type="button"
                        onClick={handleSendRequest}
                        disabled={
                          formSubmitStub
                            ? isSubmitting
                            : !formReady || !isFinalStepComplete || isSubmitting
                        }
                        className="min-h-11"
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting
                          ? planCustomizeForm.steps.sending
                          : planCustomizeForm.steps.submit}
                      </MarketingButton>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.form>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  )
}
