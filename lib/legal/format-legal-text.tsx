import Link from "next/link"
import { Fragment, type ReactNode } from "react"

const ROUTE_PATTERN = /(\/aviso-legal|\/privacidad|\/cookies)/g
const URL_PATTERN = /(https?:\/\/[^\s),;]+)/g
const EMPHASIS_PATTERN = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g

const routeLabels: Record<string, string> = {
  "/aviso-legal": "Aviso legal",
  "/privacidad": "Política de privacidad",
  "/cookies": "Política de cookies",
}

type LegalTextTone = "light" | "dark"

const toneClasses = {
  light: {
    strong: "font-semibold text-on-light",
    em: "text-on-light/90",
    link: "text-accent-on-light underline-offset-4 hover:underline",
  },
  dark: {
    strong: "font-semibold text-primary",
    em: "text-on-dark",
    link: "text-primary underline-offset-4 hover:underline",
  },
} as const

function parseEmphasis(text: string, keyPrefix: string, tone: LegalTextTone): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  EMPHASIS_PATTERN.lastIndex = 0
  while ((match = EMPHASIS_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const key = `${keyPrefix}-em-${match.index}`
    const classes = toneClasses[tone]
    if (match[2]) {
      nodes.push(
        <strong key={key} className={classes.strong}>
          <em className={tone === "dark" ? "text-on-dark" : undefined}>{match[2]}</em>
        </strong>
      )
    } else if (match[3]) {
      nodes.push(
        <strong key={key} className={classes.strong}>
          {match[3]}
        </strong>
      )
    } else if (match[4]) {
      nodes.push(
        <em key={key} className={classes.em}>
          {match[4]}
        </em>
      )
    }

    lastIndex = EMPHASIS_PATTERN.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

function parseSegment(segment: string, keyPrefix: string, tone: LegalTextTone): ReactNode[] {
  if (!segment) return []

  const urlParts = segment.split(URL_PATTERN)
  const nodes: ReactNode[] = []

  urlParts.forEach((part, index) => {
    if (!part) return

    if (part.startsWith("http://") || part.startsWith("https://")) {
      const href = part.replace(/[.,;:!?)]+$/, "")
      nodes.push(
        <a
          key={`${keyPrefix}-url-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={toneClasses[tone].link}
        >
          {href}
        </a>
      )
      return
    }

    nodes.push(
      ...parseEmphasis(part, `${keyPrefix}-txt-${index}`, tone).map((node, nodeIndex) =>
        typeof node === "string" ? (
          <Fragment key={`${keyPrefix}-frag-${index}-${nodeIndex}`}>{node}</Fragment>
        ) : (
          node
        )
      )
    )
  })

  return nodes
}

export function formatLegalText(
  text: string,
  options: { tone?: LegalTextTone } = {}
): ReactNode {
  const tone = options.tone ?? "light"
  const routeParts = text.split(ROUTE_PATTERN)

  return (
    <>
      {routeParts.map((part, index) => {
        if (part in routeLabels) {
          return (
            <Link
              key={`route-${index}`}
              href={part}
              className={toneClasses[tone].link}
            >
              {routeLabels[part]}
            </Link>
          )
        }

        return (
          <Fragment key={`seg-${index}`}>
            {parseSegment(part, `seg-${index}`, tone)}
          </Fragment>
        )
      })}
    </>
  )
}
