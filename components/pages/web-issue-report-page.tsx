"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useMemo, useState } from "react"
import { ArrowRight, Mail } from "lucide-react"
import { FadeIn } from "@/components/animations"
import { DarkPageHero } from "@/components/layout/dark-page-hero"
import { SectionShell } from "@/components/layout/section-shell"
import { FieldLabel } from "@/components/forms/field-label"
import { FormStatusMessage } from "@/components/forms/form-status-message"
import { HoneypotField } from "@/components/forms/honeypot-field"
import { MarketingButton } from "@/components/ui/marketing-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { webIssueReport, webIssueReportPath } from "@/content/web-issue"
import {
  buildWebIssueMailto,
  canOpenWebIssueMailto,
  recordWebIssueMailtoOpen,
} from "@/lib/web-issue/build-mailto"
import { cn } from "@/lib/utils"

const MIN_FORM_DELAY_MS = 2500

type WebIssueReportPageProps = {
  initialPageUrl?: string
}

export function WebIssueReportPage({ initialPageUrl = "" }: WebIssueReportPageProps) {
  const honeypotId = useId()
  const confirmId = useId()
  const [pageUrl, setPageUrl] = useState(initialPageUrl)
  const [issueType, setIssueType] = useState<string>(
    webIssueReport.issueTypes[0]?.value ?? ""
  )
  const [description, setDescription] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [formReady, setFormReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setPageUrl(initialPageUrl)
  }, [initialPageUrl])

  useEffect(() => {
    const timer = window.setTimeout(() => setFormReady(true), MIN_FORM_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const issueTypeLabel = useMemo(
    () => webIssueReport.issueTypes.find((t) => t.value === issueType)?.label ?? issueType,
    [issueType]
  )

  const descriptionValid = description.trim().length >= webIssueReport.fields.descriptionMinLength

  const canSubmit =
    formReady &&
    confirmed &&
    descriptionValid &&
    issueType.length > 0 &&
    honeypot.length === 0

  const openMailto = useCallback(() => {
    setErrorMessage(null)

    if (honeypot.length > 0) {
      setErrorMessage(webIssueReport.honeypotMessage)
      return
    }

    if (!canSubmit) {
      setErrorMessage(webIssueReport.validationMessage)
      return
    }

    if (!canOpenWebIssueMailto()) {
      setErrorMessage(webIssueReport.rateLimitMessage)
      return
    }

    const reportedFrom =
      typeof window !== "undefined"
        ? `${window.location.origin}${webIssueReportPath}`
        : webIssueReportPath

    const href = buildWebIssueMailto({
      issueTypeLabel,
      pageUrl: pageUrl.trim() || "(no indicada)",
      description: description.trim(),
      reportedFrom,
    })

    recordWebIssueMailtoOpen()
    window.location.href = href
  }, [canSubmit, description, honeypot, issueTypeLabel, pageUrl])

  return (
    <main className="min-h-screen">
      <DarkPageHero
        eyebrow={webIssueReport.badge}
        title={webIssueReport.title}
        lead={
          <>
            {webIssueReport.subtitle}{" "}
            <Link
              href={webIssueReport.contactHref}
              className="text-primary underline-offset-4 hover:underline"
            >
              {webIssueReport.contactLinkLabel}
            </Link>
            .
          </>
        }
      />

      <section className="border-t border-agua/20 bg-surface-light py-12 md:py-16">
        <SectionShell>
          <FadeIn className="mx-auto max-w-xl">
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                openMailto()
              }}
              noValidate
            >
              <HoneypotField
                id={honeypotId}
                label={webIssueReport.fields.honeypotLabel}
                value={honeypot}
                onChange={setHoneypot}
                hide="off-screen"
              />

              <div className="space-y-2">
                <FieldLabel htmlFor="page-url" tone="light">
                  {webIssueReport.fields.pageUrl}
                </FieldLabel>
                <Input
                  id="page-url"
                  name="pageUrl"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={webIssueReport.fields.pageUrlPlaceholder}
                  value={pageUrl}
                  onChange={(event) => setPageUrl(event.target.value)}
                  className="border-on-light/20 bg-on-light/5 text-on-light placeholder:text-muted-on-light"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="issue-type" tone="light">
                  {webIssueReport.fields.issueType}
                </FieldLabel>
                <select
                  id="issue-type"
                  name="issueType"
                  required
                  value={issueType}
                  onChange={(event) => setIssueType(event.target.value)}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-on-light/20 bg-on-light/5 px-3 py-2 text-sm text-on-light",
                    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  )}
                >
                  {webIssueReport.issueTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="description" tone="light">
                  {webIssueReport.fields.description}
                </FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  minLength={webIssueReport.fields.descriptionMinLength}
                  placeholder={webIssueReport.fields.descriptionPlaceholder}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-[8rem] border-on-light/20 bg-on-light/5 text-on-light placeholder:text-muted-on-light"
                />
                <p className="text-xs text-muted-on-light">
                  Mínimo {webIssueReport.fields.descriptionMinLength} caracteres (
                  {description.trim().length}/{webIssueReport.fields.descriptionMinLength}).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id={confirmId}
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-1 size-4 shrink-0 rounded border-on-light/25 accent-[#01635c]"
                />
                <label
                  htmlFor={confirmId}
                  className="cursor-pointer text-sm leading-relaxed text-muted-on-light"
                >
                  {webIssueReport.fields.confirmLabel}
                </label>
              </div>

              {errorMessage ? (
                <FormStatusMessage variant="error" tone="light" boxed={false}>
                  {errorMessage}
                </FormStatusMessage>
              ) : null}

              <div className="space-y-2 pt-2">
                <MarketingButton type="submit" size="lg" disabled={!canSubmit} className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  {webIssueReport.submitLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </MarketingButton>
                <p className="text-xs text-muted-on-light">{webIssueReport.submitHint}</p>
              </div>
            </form>
          </FadeIn>
        </SectionShell>
      </section>
    </main>
  )
}
