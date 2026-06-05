type HoneypotFieldProps = {
  id: string
  label: string
  name?: string
  value: string
  onChange: (value: string) => void
  hide?: "sr-only" | "off-screen"
}

export function HoneypotField({
  id,
  label,
  name = "company",
  value,
  onChange,
  hide = "sr-only",
}: HoneypotFieldProps) {
  const wrapperClass =
    hide === "sr-only"
      ? "sr-only"
      : "absolute -left-[9999px] h-px w-px overflow-hidden"

  return (
    <div className={wrapperClass} aria-hidden={hide === "sr-only" ? true : undefined}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
