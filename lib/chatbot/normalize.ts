const ACCENT_RE = /[\u0300-\u036f]/g

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(ACCENT_RE, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

export function tokenize(value: string): string[] {
  const normalized = normalizeText(value)
  if (!normalized) return []
  return normalized.split(/\s+/).filter((token) => token.length > 1)
}

export function extractSnippet(body: string, query: string, maxLength = 220): string {
  const tokens = tokenize(query)

  for (const token of tokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const match = new RegExp(escaped, "i").exec(body)
    if (match?.index != null) {
      const start = Math.max(0, match.index - 40)
      const end = Math.min(body.length, match.index + maxLength)
      let snippet = body.slice(start, end).trim()
      if (start > 0) snippet = `…${snippet}`
      if (end < body.length) snippet = `${snippet}…`
      return snippet
    }
  }

  if (body.length <= maxLength) return body
  return `${body.slice(0, maxLength).trim()}…`
}
