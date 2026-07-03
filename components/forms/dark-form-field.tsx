import type { ReactNode } from "react"
import { FieldErrorText } from "@/components/forms/field-error-text"
import { FieldLabel } from "@/components/forms/field-label"

type DarkFormFieldProps = {
  name: string
  label: ReactNode
  htmlFor?: string
  required?: boolean
  error?: string
  children: (props: {
    id: string
    invalid: boolean
    describedBy?: string
  }) => ReactNode
}

export function DarkFormField({
  name,
  label,
  htmlFor,
  required,
  error,
  children,
}: DarkFormFieldProps) {
  const controlId = htmlFor ?? name
  const invalid = Boolean(error)
  const errorId = `${name}-error`

  return (
    <div>
      <FieldLabel htmlFor={controlId} required={required}>
        {label}
      </FieldLabel>
      {children({
        id: controlId,
        invalid,
        describedBy: invalid ? errorId : undefined,
      })}
      <FieldErrorText id={errorId}>{error}</FieldErrorText>
    </div>
  )
}
