"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { LazyMotion, AnimatePresence, domAnimation, m, useReducedMotion } from "framer-motion"
import { planCustomizeForm } from "@/content/plan-customize-form"
import { FormStatusMessage } from "@/components/forms/form-status-message"
import { MarketingButton } from "@/components/ui/marketing-button"
import { Textarea } from "@/components/ui/textarea"
import { resolveFormApiErrorMessage } from "@/lib/forms/form-api-response"
import { formStepEase } from "@/lib/forms/motion-tokens"
import { postConfirmarPresupuesto } from "@/lib/plan-customize/confirmar-presupuesto-client"
import { cn } from "@/lib/utils"
import type { PresupuestoDecisionAccion } from "@/src/modules/leads/domain/presupuesto-decision"
import type { PresupuestoFlash } from "@/src/modules/leads/domain/presupuesto-flash"

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

type MotivoAccion = Extract<PresupuestoDecisionAccion, "rechazar" | "no_interesa">

type PanelView = { view: "summary" } | { view: "motivo"; accion: MotivoAccion }

type PlanCustomizePresupuestoPanelProps = {
  leadId: number
  presupuesto: PresupuestoFlash
  onResolved: (estado: PresupuestoDecisionAccion) => void
  className?: string
}

const panelMotion = { duration: 0.24, ease: formStepEase } as const

export function PlanCustomizePresupuestoPanel({
  leadId,
  presupuesto,
  onResolved,
  className,
}: PlanCustomizePresupuestoPanelProps) {
  const reducedMotion = useReducedMotion()
  const copy = planCustomizeForm.confirmarPresupuesto

  const [panelView, setPanelView] = useState<PanelView>({ view: "summary" })
  const [motivoValue, setMotivoValue] = useState("")
  const [motivoOtro, setMotivoOtro] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [panelError, setPanelError] = useState<string | null>(null)

  const submit = async (accion: PresupuestoDecisionAccion, motivo?: string) => {
    setPanelError(null)
    setIsSubmitting(true)
    try {
      const { response, payload } = await postConfirmarPresupuesto({ leadId, accion, motivo })
      const apiError = resolveFormApiErrorMessage(response, payload, {
        rateLimit: copy.messages.rateLimit,
        duplicateLead: copy.messages.genericError,
        webhookForbidden: copy.messages.webhookForbidden,
        generic: copy.messages.genericError,
        validation: copy.messages.validation,
      })
      if (apiError) {
        setPanelError(apiError)
        return
      }
      onResolved(payload.estado ?? accion)
    } catch {
      setPanelError(copy.messages.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openMotivo = (accion: MotivoAccion) => {
    setMotivoValue("")
    setMotivoOtro("")
    setPanelError(null)
    setPanelView({ view: "motivo", accion })
  }

  const backToSummary = () => {
    setPanelError(null)
    setPanelView({ view: "summary" })
  }

  const confirmMotivo = () => {
    if (panelView.view !== "motivo") return
    if (!motivoValue) {
      setPanelError(copy.validation.motivoRequired)
      return
    }
    if (motivoValue === "otro" && motivoOtro.trim().length === 0) {
      setPanelError(copy.validation.motivoOtroRequired)
      return
    }

    const options = copy.motivos[panelView.accion].options
    const selectedLabel = options.find((option) => option.value === motivoValue)?.label ?? motivoValue
    const motivo = motivoValue === "otro" ? motivoOtro.trim() : selectedLabel
    void submit(panelView.accion, motivo)
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        role="status"
        aria-live="polite"
        className={className}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : panelMotion}
      >
        <div className="mb-5 flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
            aria-hidden
          >
            <Zap className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-on-dark md:text-xl">{copy.title}</h3>
            <p className="text-sm text-muted-on-dark">{copy.intro}</p>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {panelView.view === "summary" ? (
            <m.div
              key="presupuesto-summary"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={reducedMotion ? { duration: 0 } : panelMotion}
            >
              <div className="rounded-xl border border-agua/25 bg-on-dark/5 p-4 sm:p-5">
                <ul className="divide-y divide-agua/15">
                  {presupuesto.lineas.map((linea, index) => (
                    <li
                      key={`${linea.nombre}-${index}`}
                      className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-on-dark">{linea.nombre}</p>
                        <p className="text-xs text-muted-on-dark">
                          {index === 0 ? copy.monthlyLineLabel : copy.oneTimeLineLabel}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-on-dark">
                        {currencyFormatter.format(linea.precio)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-agua/25 pt-3">
                  <span className="text-sm font-medium text-on-dark">{copy.totalLabel}</span>
                  <span className="text-xl font-semibold text-primary">
                    {currencyFormatter.format(presupuesto.totalMensual)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <MarketingButton
                  type="button"
                  onClick={() => void submit("aceptar")}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="min-h-11"
                >
                  {isSubmitting ? copy.actions.sending : copy.actions.accept}
                </MarketingButton>
                <MarketingButton
                  type="button"
                  marketingVariant="secondary"
                  onClick={() => openMotivo("rechazar")}
                  disabled={isSubmitting}
                  className="min-h-11"
                >
                  {copy.actions.reject}
                </MarketingButton>
                <MarketingButton
                  type="button"
                  marketingVariant="secondary"
                  onClick={() => openMotivo("no_interesa")}
                  disabled={isSubmitting}
                  className="min-h-11"
                >
                  {copy.actions.notInterested}
                </MarketingButton>
              </div>
            </m.div>
          ) : (
            <m.div
              key="presupuesto-motivo"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={reducedMotion ? { duration: 0 } : panelMotion}
            >
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-on-dark">
                  {copy.motivos[panelView.accion].label}
                </legend>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {copy.motivos[panelView.accion].options.map((option) => {
                    const selected = motivoValue === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isSubmitting}
                        onClick={() => setMotivoValue(option.value)}
                        className={cn(
                          "min-h-9 cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-[border-color,background-color] duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60",
                          selected
                            ? "border-primary/55 bg-primary/10 text-on-dark"
                            : "border-agua/35 text-on-dark hover:border-primary/45 hover:bg-on-dark/8"
                        )}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>

                {motivoValue === "otro" ? (
                  <Textarea
                    value={motivoOtro}
                    onChange={(event) => setMotivoOtro(event.target.value)}
                    placeholder={copy.motivos[panelView.accion].otroPlaceholder}
                    maxLength={copy.limits.motivoMax}
                    disabled={isSubmitting}
                    className="input-on-dark mt-3 min-h-[88px] w-full text-base md:text-sm"
                    rows={3}
                  />
                ) : null}
              </fieldset>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <MarketingButton
                  type="button"
                  marketingVariant="secondary"
                  onClick={backToSummary}
                  disabled={isSubmitting}
                  className="min-h-11"
                >
                  {copy.actions.back}
                </MarketingButton>
                <MarketingButton
                  type="button"
                  onClick={confirmMotivo}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="min-h-11"
                >
                  {isSubmitting ? copy.actions.sending : copy.actions.confirm}
                </MarketingButton>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {panelError ? (
            <m.div
              key="presupuesto-error"
              role="alert"
              aria-live="assertive"
              initial={reducedMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={reducedMotion ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
              transition={reducedMotion ? { duration: 0 } : panelMotion}
            >
              <FormStatusMessage variant="error">{panelError}</FormStatusMessage>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  )
}
