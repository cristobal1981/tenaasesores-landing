import type { ReactNode } from "react"
import { FieldErrorText } from "@/components/forms/field-error-text"
import { FieldLabel } from "@/components/forms/field-label"

type DarkFormFieldProps = {
  name: string
  label: ReactNode
  labelAddon?: ReactNode
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
  labelAddon,
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
      <div className="mb-2 flex items-center gap-1.5">
        <FieldLabel htmlFor={controlId} required={required} className="mb-0">
          {label}
        </FieldLabel>
        {labelAddon}
      </div>
      {children({
        id: controlId,
        invalid,
        describedBy: invalid ? errorId : undefined,
      })}
      <FieldErrorText id={errorId}>{error}</FieldErrorText>
    </div>
  )
}
