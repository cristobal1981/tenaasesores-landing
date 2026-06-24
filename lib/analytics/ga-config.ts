export function getGaId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim()
  return id || undefined
}
