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
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { contactForm } from "@/content/contact-form"
import {
  planCustomizeForm,
  planCustomizeTaxRegions,
  planCustomizeYesNo,
  type PlanCustomizeAudience,
} from "@/content/plan-customize-form"
import { Button, marketingCtaBaseClassName, marketingCtaVariantClassName } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { isLikelyValidPhone } from "@/lib/contact/validate-inquiry"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 3

const stepEnterMs = 0.28
const stepExitMs = 0.2
const stepHeightMs = 0.34
const stepEase = [0.22, 1, 0.36, 1] as const
const stepMotion = { duration: stepEnterMs, ease: stepEase } as const
const stepExitMotion = { duration: stepExitMs, ease: stepEase } as const
const stepHeightMotion = { duration: stepHeightMs, ease: stepEase } as const
const successFadeMs = 0.2
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

function FieldLabel({
  htmlFor,
  id,
  children,
  required,
  className,
}: {
  htmlFor?: string
  id?: string
  children: ReactNode
  required?: boolean
  className?: string
}) {
  const content = (
    <>
      <span>{children}</span>
      {required ? (
        <span className="text-primary" aria-hidden="true">
          *
        </span>
      ) : null}
    </>
  )

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        id={id}
        className={cn("mb-2 flex items-center gap-1 text-sm font-medium text-on-dark", className)}
      >
        {content}
      </label>
    )
  }

  return (
    <span
      id={id}
      className={cn("mb-2 flex items-center gap-1 text-sm font-medium text-on-dark", className)}
    >
      {content}
    </span>
  )
}

function isStepComplete(
  currentStep: number,
  audience: PlanCustomizeAudience,
  values: PlanFormValues
): boolean {
  return getStepValidationError(currentStep, audience, values) === null
}

function isValidAnnualRevenueInput(raw: string): boolean {
  const digits = raw.replace(/\D/g, "")
  if (
    digits.length < planCustomizeForm.limits.revenueDigitsMin ||
    digits.length > planCustomizeForm.limits.revenueDigitsMax
  ) {
    return false
  }
  const value = Number.parseInt(digits, 10)
  return Number.isFinite(value) && value > 0
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

function PlanCustomizeSuccess({ detail }: { detail?: string | null }) {
  const reducedMotion = useReducedMotion()
  const body = detail ?? planCustomizeForm.success.body

  return (
    <m.div
      role="status"
      aria-live="polite"
      className={planFormWidthClass}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : successFadeMs, ease: stepEase }}
    >
      <div
        className="mb-6 flex w-full gap-1.5"
        aria-label={planCustomizeForm.success.stepsDoneLabel}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            className="h-1 flex-1 rounded-full bg-primary"
            aria-hidden
          />
        ))}
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/45 bg-primary/12">
          <CheckCircle2 aria-hidden className="h-8 w-8 text-primary" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-on-dark md:text-xl">
            {planCustomizeForm.success.title}
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-muted-on-dark md:text-base">
            {body}
          </p>
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            {planCustomizeForm.success.stepsDoneLabel}
          </p>
        </div>
      </div>
    </m.div>
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

function getStepValidationError(
  currentStep: number,
  audience: PlanCustomizeAudience,
  values: PlanFormValues
): string | null {
  if (currentStep === 1) {
    if (audience === "autonomos") {
      if (!values.isRegisteredAutonomo) {
        return planCustomizeForm.validation.registeredAutonomo
      }
      if (!values.willHireEmployees) {
        return planCustomizeForm.validation.hireEmployees
      }
    } else {
      if (!values.isNewConstitution) {
        return planCustomizeForm.validation.newConstitution
      }
      if (!values.hasEmployees) {
        return planCustomizeForm.validation.hasEmployees
      }
      if (values.hasEmployees === "yes") {
        const count = Number.parseInt(values.employeeCount, 10)
        if (!Number.isFinite(count) || count < 1) {
          return planCustomizeForm.validation.employeeCount
        }
      }
    }
    if (!isValidAnnualRevenueInput(values.annualRevenue)) {
      return planCustomizeForm.validation.revenue
    }
    return null
  }

  if (currentStep === 2) {
    if (values.services.length === 0) {
      return planCustomizeForm.validation.services
    }
    return null
  }

  if (currentStep === 3) {
    const activityTrimmed = values.activity.trim()
    if (
      activityTrimmed.length < planCustomizeForm.limits.activityMin ||
      activityTrimmed.length > planCustomizeForm.limits.activityMax
    ) {
      return planCustomizeForm.validation.activity
    }
    if (!values.taxRegion) {
      return planCustomizeForm.validation.taxRegion
    }
    if (!values.name.trim()) {
      return planCustomizeForm.validation.name
    }
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      return planCustomizeForm.validation.email
    }
    if (values.phone.trim().length > 0 && !isLikelyValidPhone(values.phone)) {
      return contactForm.messages.phoneInvalid
    }
  }

  return null
}

export function PlanCustomizeWizard({ audience, sectionTitleId }: PlanCustomizeWizardProps) {
  const panelId = useId()
  const stepLiveId = useId()
  const reducedMotion = useReducedMotion()

  const [step, setStep] = useState(1)
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

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
    const error = getStepValidationError(step, audience, formValues)
    if (error) {
      setStepError(error)
      return
    }
    setStepError(null)
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const handleBack = () => {
    setStepError(null)
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const revealSuccess = useCallback(() => {
    setSuccessMessage(planCustomizeForm.success.body)
    resetWizard()
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
    if (step < TOTAL_STEPS && isCurrentStepComplete) {
      handleNext()
    }
  }

  const handleSendRequest = () => {
    const error = getStepValidationError(3, audience, formValues)
    if (error) {
      setStepError(error)
      return
    }

    setStepError(null)
    setIsSubmitting(true)
    const submitDelay = reducedMotion ? 0 : submitDelayMs
    window.setTimeout(() => {
      setIsSubmitting(false)
      revealSuccess()
    }, submitDelay)
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
                label={planCustomizeForm.step1.empresas.hasEmployeesLabel}
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
                    {planCustomizeForm.step1.empresas.employeeCountLabel}
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
            <PlanCustomizeSuccess key="plan-customize-success" detail={successMessage} />
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
                  <m.p
                    key="plan-step-error"
                    id={`${panelId}-form-error`}
                    className="text-sm text-red-300"
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
                    {stepError}
                  </m.p>
                ) : null}
              </AnimatePresence>

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
                      <Button
                        type="button"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className={cn(
                          "min-h-11",
                          marketingCtaBaseClassName,
                          marketingCtaVariantClassName.secondary
                        )}
                      >
                        {planCustomizeForm.steps.back}
                      </Button>
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
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!isCurrentStepComplete || isSubmitting}
                        className={cn(
                          "min-h-11",
                          marketingCtaBaseClassName,
                          marketingCtaVariantClassName.primary
                        )}
                      >
                        {planCustomizeForm.steps.next}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </m.div>
                  ) : (
                    <m.div
                      key="plan-nav-submit"
                      initial={reducedMotion ? false : { opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reducedMotion ? undefined : { opacity: 0, x: -6 }}
                      transition={reducedMotion ? { duration: 0 } : stepMotion}
                    >
                      <Button
                        type="button"
                        onClick={handleSendRequest}
                        disabled={!isFinalStepComplete || isSubmitting}
                        className={cn(
                          "min-h-11",
                          marketingCtaBaseClassName,
                          marketingCtaVariantClassName.primary
                        )}
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting
                          ? planCustomizeForm.steps.sending
                          : planCustomizeForm.steps.submit}
                      </Button>
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
